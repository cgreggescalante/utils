import {Split} from "./split";

export interface StopwatchData {
    name: string;
    startTime: number | null;
    stopTime: number | null;
    elapsedTime: number;
    fastestLap: number | null;
    slowestLap: number | null;
    splits: Split[] | null;
}