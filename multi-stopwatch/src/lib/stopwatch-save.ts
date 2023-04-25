import {Split} from "./split";

export interface StopwatchSave {
    saveName: string;
    startTime: number | null;
    stopTime: number | null;
    elapsedTime: number;
    fastestLap: number | null;
    slowestLap: number | null;
    splits: Split[] | null;
}