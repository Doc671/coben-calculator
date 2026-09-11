export class CobenResult {
    readonly name: string;
    readonly chance: number;
    private _lowerInterval?: number;
    private _upperInterval?: number;

    get lowerInterval(): number | undefined {
        return this._lowerInterval;
    }

    get upperInterval() : number | undefined {
        return this._upperInterval;
    }

    constructor(name: string, chance: number);
    constructor(name: string, chance: number, lowerInterval?: number, upperInterval?: number);
    constructor(name: string, chance: number, lowerInterval?: number, upperInterval?: number) {
        this.name = name;
        this.chance = chance;
        this._lowerInterval = lowerInterval;
        this._upperInterval = upperInterval;
    }

    calculateWilsonIntervals(zScore: number, simulationCount: number) {
        const p = this.chance;
        const a = p + zScore * zScore / (2 * simulationCount);
        const b = zScore * Math.sqrt(p * (1 - p) / simulationCount + zScore * zScore / (4 * simulationCount * simulationCount));
        const c = 1 + zScore * zScore / simulationCount;
        
        this._lowerInterval = Math.max((a - b) / c, 0);
        this._upperInterval = Math.min((a + b) / c, 1);
    }
}
