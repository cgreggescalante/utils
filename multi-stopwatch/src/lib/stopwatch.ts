import {Split} from "./split";
import {StopwatchSave} from "./stopwatch-save";

class Stopwatch {
    public name: string | undefined;
    private startTime: number | null;
    private stopTime: number | null;
    private splits: Split[];
    private running: boolean;

    public fastestLap: number | null;
    public slowestLap: number | null;

    constructor(name?: string) {
        this.name = name;
        this.startTime = null;
        this.stopTime = null;
        this.splits = [];
        this.running = false;
        this.fastestLap = null;
        this.slowestLap = null;
    }

    start(startTime?: number) {
        this.startTime = startTime ? startTime : Date.now();
        this.stopTime = null;
        this.splits = [];
        this.running = true;
        this.fastestLap = null;
        this.slowestLap = null;
    }

    stop(stopTime?: number) {
        if (!this.running || this.startTime === null) {
            return
        }
        this.lap();
        this.stopTime = stopTime ? stopTime : Date.now();
        this.running = false;
    }

    lap(time?: number) {
        if (this.running && this.startTime !== null) {
            const current = time ? time : Date.now();
            const splitTime = current - this.startTime;
            const lapTime = current - (this.splits.length > 0 ? this.splits[this.splits.length - 1].splitTime : 0) - this.startTime
            this.splits.push({
                splitNumber: this.splits.length + 1,
                splitTime: splitTime,
                lapTime: lapTime
            });
            if (this.fastestLap == null || lapTime < this.fastestLap) {
                this.fastestLap = lapTime;
            }
            if (this.slowestLap == null || lapTime > this.slowestLap) {
                this.slowestLap = lapTime;
            }
        }
    }

    reset() {
        this.startTime = null;
        this.stopTime = null;
        this.splits = [];
        this.running = false;
        this.fastestLap = null;
        this.slowestLap = null;
    }

    getElapsedTime(): number {
        if (this.startTime === null) {
            return 0;
        }
        const stopTime = this.stopTime ?? Date.now();
        return stopTime - this.startTime;
    }

    getSplits(): Split[] {
        return this.splits;
    }

    isRunning(): boolean {
        return this.running;
    }

    // Used to sync up the starts of multiple stopwatches
    setStartTime(startTime: number): void {
        this.startTime = startTime;
        this.running = true;
    }

    isFinished(): boolean {
        return this.stopTime !== null;
    }

    saveData(): StopwatchSave {
        return {
            saveName: this.name ? this.name : "SAVE",
            startTime: this.startTime,
            stopTime: this.stopTime,
            elapsedTime: this.getElapsedTime(),
            fastestLap: this.fastestLap,
            slowestLap: this.slowestLap,
            splits: this.splits
        }
    }
}



export default Stopwatch;