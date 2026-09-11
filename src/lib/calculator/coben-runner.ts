import { CobenResult } from '../calculator/coben-result';
import type { CobenThreadRequest, CobenThreadResponse } from './message-types';

export async function calculateCoben(
    names: string[],
    currentPoints: number[],
    pointsToDistribute: number[],
    eliminationCount: number = 1,
    simulationCount: number = 1_000_000,
    showWilsonIntervals: boolean = false,
    zScore: number = 1.96
): Promise<CobenResult[]> {
    let athleteCount: number = currentPoints.length;
    if (pointsToDistribute.length != athleteCount) {
        pointsToDistribute.length = athleteCount;
    }

    ({ athleteCount, currentPoints, names } = cullImmuneAthletes(athleteCount, pointsToDistribute, currentPoints, eliminationCount, names));
    
    const workerCount: number = navigator.hardwareConcurrency ?? 4;
    const simulationsPerThread = new Array<number>(workerCount);
    simulationsPerThread.fill(Math.floor(simulationCount / workerCount));
    
    const remainder: number = simulationCount % workerCount;
    if (remainder < Number.EPSILON) {
        simulationsPerThread[workerCount - 1] = simulationCount % workerCount;
    }
    
    const workerResults = await Promise.all(
        simulationsPerThread.map(workerSimulationCount => runWorker({
            currentPoints: currentPoints,
            pointsToDistribute: pointsToDistribute,
            eliminationCount: eliminationCount,
            simulationCount: workerSimulationCount
        }))
    );
    
    const eliminationCounts = new Array<number>(athleteCount).fill(0);
    for (let i = 0; i < workerResults.length; i++) {
        for (let j = 0; j < athleteCount; j++) {
            eliminationCounts[j] += workerResults[i].eliminations[j];
        }
    }

    const chances = eliminationCounts.map(count => count / simulationCount);
    const results = new Array<CobenResult>();
    for (let i = 0; i < athleteCount; i++) {
        const result = new CobenResult(names[i], chances[i]);

        if (showWilsonIntervals) {
            result.calculateWilsonIntervals(zScore, simulationCount);
        }

        results.push(result);
    }

    return results;
}

function cullImmuneAthletes(athleteCount: number, pointsToDistribute: number[], currentPoints: number[], eliminationCount: number, names: string[]) {
    let minPointsToDistribute = 0;
    let maxPointsToDistribute = 0;
    for (let i = 0; i < athleteCount; i++) {
        if (pointsToDistribute[i] < minPointsToDistribute) {
            minPointsToDistribute = pointsToDistribute[i];
        }
        if (pointsToDistribute[i] > maxPointsToDistribute) {
            maxPointsToDistribute = pointsToDistribute[i];
        }
    }

    const orderedCurrentPoints: number[] = [...currentPoints];
    orderedCurrentPoints.sort();

    // Immunity culling
    // The immunity threshold is the nth worst current score + the maximum points given next event
    // If a contestant does as badly as possible (they gain the minimum points in the next event),
    // but their score is higher than the threshold, they are immune
    const returnValue: Record<string, CobenResult> = {};
    const immunityThreshold: number = orderedCurrentPoints[eliminationCount - 1] + maxPointsToDistribute;
    const remove = new Array<boolean>(athleteCount).fill(false);
    let removeCount = 0;
    for (let i = 0; i < athleteCount; i++) {
        if (currentPoints[i] + minPointsToDistribute > immunityThreshold) {
            returnValue[names[i]] = new CobenResult(names[i], 0, 0, 0);
            remove[i] = true;
            removeCount++;
        }
    }

    if (removeCount != 0) {
        const newAthleteCount = athleteCount - removeCount;
        const newCurrentPoints = new Array<number>(newAthleteCount);
        const newNames = new Array<string>(newAthleteCount);
        let newIndex = 0;
        for (let i = 0; i < athleteCount; i++) {
            if (!remove[i]) {
                newCurrentPoints[newIndex] = currentPoints[i];
                newNames[newIndex] = names[i];
                newIndex++;
            }
        }

        athleteCount = newAthleteCount;
        currentPoints = newCurrentPoints;
        names = newNames;
    }
    return { athleteCount, currentPoints, names };
}

function runWorker(request: CobenThreadRequest): Promise<CobenThreadResponse> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL("./coben-worker.ts", import.meta.url), { type: "module" });

        worker.onmessage = (e) => {
            const response = e.data as CobenThreadResponse;
            resolve(response);
        };

        worker.onerror = (error) => {
            worker.terminate();
            reject(error);
        };

        worker.postMessage(request);
    })
}
