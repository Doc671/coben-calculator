export interface CobenThreadRequest {
    readonly currentPoints: number[],
    readonly pointsToDistribute: number[],
    readonly eliminationCount: number,
    readonly simulationCount: number
}

export interface CobenThreadResponse {
    readonly eliminations: number[];
}
