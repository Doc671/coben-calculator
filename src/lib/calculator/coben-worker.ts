import type { CobenThreadRequest, CobenThreadResponse } from '../calculator/message-types'

onmessage = (e) => {
    const request = e.data as CobenThreadRequest;

    const athleteCount = request.currentPoints.length;
    const pointsToDistribute: number[] = [...request.pointsToDistribute];
    const newPoints = new Array<number>(athleteCount);
    const lowestPoints = new Array<number>(request.eliminationCount);
    const eliminationCounts = new Array<number>(athleteCount).fill(0);
    const eliminationPossible = new Array<boolean>(athleteCount).fill(false);

    for (let i = 0; i < request.simulationCount; i++) {
        lowestPoints.fill(Number.MAX_VALUE);
        eliminationPossible.fill(false);
        shuffle(pointsToDistribute);

        for (let j = 0; j < athleteCount; j++) {
            const newPointsThisAthlete = request.currentPoints[j] + pointsToDistribute[j];
            newPoints[j] = newPointsThisAthlete;

            // If the athlete's new points value is lower than entries in the lowest points array,
            // add their new point total to the lowest points array
            let k = 0;
            let inserted = false;
            while (k < request.eliminationCount && !inserted) {
                if (newPointsThisAthlete < lowestPoints[k]) {
                    for (let l = request.eliminationCount - 1; l > k; l--) {
                        lowestPoints[l] = lowestPoints[l - 1];
                    }

                    lowestPoints[k] = newPointsThisAthlete;
                    inserted = true;
                }

                k++;
            }
        }

        // Find who got the nth lowest score and increment their elimination count
        const nthLowestPoints = lowestPoints[request.eliminationCount - 1];
        let endangeredAthleteCount = 0;
        for (let j = 0; j < athleteCount; j++) {
            if (newPoints[j] <= nthLowestPoints) {
                endangeredAthleteCount++;
                eliminationPossible[j] = true;
            }
        }

        switch (request.tiebreakMode) {
            case "Random":
                const eliminationsToAdd = request.eliminationCount / endangeredAthleteCount;
                for (let j = 0; j < athleteCount; j++) {
                    if (eliminationPossible[j]) {
                        eliminationCounts[j] += eliminationsToAdd;
                    }
                }
                break;

            case "HighestPreviousPoints":
                let maxPreviousPoints = Number.MIN_VALUE;
                for (let j = 0; j < athleteCount; j++) {
                    if (eliminationPossible[j] && request.currentPoints[j] > maxPreviousPoints) {
                        maxPreviousPoints = request.currentPoints[j];
                    }
                }
                for (let j = 0; j < athleteCount; j++) {
                    if (eliminationPossible[j] && request.currentPoints[j] === maxPreviousPoints) {
                        eliminationCounts[j]++;
                    }
                }
                break;

            case "EliminateAll":
                for (let j = 0; j < athleteCount; j++) {
                    if (eliminationPossible[j]) {
                        eliminationCounts[j]++;
                    }
                }
                break;
                
            default:
                console.error(`Unknown tiebreak mode: ${request.tiebreakMode}`);
                break;
        }
    }

    const response: CobenThreadResponse = {
        eliminations: eliminationCounts
    };

    postMessage(response);
}

function shuffle(array: number[]) {
    let n = array.length;
    while (n > 1) {
        const values = new Uint32Array(1);
        crypto.getRandomValues(values);
        const k = values[0] % n--;
        [array[n], array[k]] = [array[k], array[n]];
    }
}
