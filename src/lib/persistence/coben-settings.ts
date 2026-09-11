export type RoundingMode = "DecimalPlaces" | "SignificantFigures" | "IntervalSignificantFigures";

export interface CobenSettings {
    version: number;
    eliminationCount: number;
    simulationCount: number;
    showWilsonIntervals: boolean;
    zScore: number;
    roundingMode: RoundingMode;
    roundingNumber: number;
    theme: "System" | "Light" | "Dark";
}
