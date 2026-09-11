import type { CobenThreadRequest, CobenThreadResponse } from '../calculator/message-types'

onmessage = (e) => {
    const request = e.data as CobenThreadRequest;

    const athleteCount = request.currentPoints.length;
    const pointsToDistribute: number[] = [...request.pointsToDistribute];
    const newPoints = new Array<number>(athleteCount);
    const lowestPoints = new Array<number>(request.eliminationCount);
    const eliminationCounts = new Array<number>(athleteCount).fill(0);

    for (let i = 0; i < request.simulationCount; i++) {
        lowestPoints.fill(Number.MAX_VALUE);
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

        const nthLowestPoints = lowestPoints[request.eliminationCount - 1];
        for (let j = 0; j < athleteCount; j++) {
            if (newPoints[j] <= nthLowestPoints) {
                eliminationCounts[j]++;
            }
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
