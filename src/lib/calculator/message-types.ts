import type { TiebreakMode } from "../persistence/coben-settings";

export interface CobenThreadRequest {
    readonly currentPoints: number[],
    readonly pointsToDistribute: number[],
    readonly eliminationCount: number,
    readonly simulationCount: number,
    readonly tiebreakMode: TiebreakMode
}

export interface CobenThreadResponse {
    readonly eliminations: number[];
}
