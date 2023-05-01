import {Split} from "./split";

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

    getSplits(): Split[] {
        return this.splits;
    }

    isRunning(): boolean {
        return this.running;
    }

    isFinished(): boolean {
        return this.stopTime !== null;
    }

    deepCopy(): Stopwatch {
        const s = new Stopwatch(this.name);

        s.startTime = this.startTime;
        s.stopTime = this.stopTime;
        s.splits = this.splits;
        s.running = this.running;
        s.fastestLap = this.fastestLap;
        s.slowestLap = this.slowestLap;

        return s;
    }

    getElapsedTime(): number {
        if (this.startTime !== null && this.stopTime !== null)
            return this.stopTime - this.startTime;
        return this.startTime ? Date.now() - this.startTime : 0;
    }
}



export default Stopwatch;