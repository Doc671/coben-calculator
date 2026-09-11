import type { CobenSettings } from "./coben-settings";

export default interface CobenSaveData {
    readonly settings: CobenSettings;
    readonly names: Array<string>;
    readonly currentPoints: Array<number>;
    readonly nextEventPoints: Array<number>;
}
