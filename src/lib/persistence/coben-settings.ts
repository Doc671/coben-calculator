export type RoundingMode = "DecimalPlaces" | "SignificantFigures" | "IntervalSignificantFigures";
export type TiebreakMode = "Random" | "HighestPreviousPoints" | "EliminateAll";

export interface CobenSettings {
    version: number;
    eliminationCount: number;
    simulationCount: number;
    showWilsonIntervals: boolean;
    zScore: number;
    roundingMode: RoundingMode;
    roundingNumber: number;
    tiebreakMode: TiebreakMode;
    theme: "System" | "Light" | "Dark";
}
