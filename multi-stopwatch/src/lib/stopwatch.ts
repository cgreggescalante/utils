import {Split} from "./split";

class Stopwatch {
    public name: string;
    public startTime: number | null;
    public stopTime: number | null;
    public splits: Split[];
    public running: boolean;

    public relay: boolean;
    public intermediateSplits: boolean;
    public legNames: string[];

    public fastestLap: number | null;
    public slowestLap: number | null;

    constructor(name: string, relay: boolean, intermediateSplit: boolean) {
        this.name = name;
        this.startTime = null;
        this.stopTime = null;
        this.splits = [];
        this.running = false;
        this.fastestLap = null;
        this.slowestLap = null;

        this.relay = relay;
        this.intermediateSplits = intermediateSplit;
        this.legNames = ["A", "B", "C", "D"];
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

    getCurrentElapsedLap(): number {
        if (this.running && this.startTime) {
            const current = Date.now();
            if (this.splits.length > 0) {
                return current - this.splits[this.splits.length - 1].splitTime - this.startTime;
            }
            return current - this.startTime;
        }

        return 0;
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
        const s = new Stopwatch(this.name, this.relay, this.intermediateSplits);

        s.startTime = this.startTime;
        s.stopTime = this.stopTime;
        s.splits = this.splits;
        s.running = this.running;
        s.fastestLap = this.fastestLap;
        s.slowestLap = this.slowestLap;
        s.legNames = this.legNames;

        return s;
    }

    getElapsedTime(): number {
        if (this.startTime !== null && this.stopTime !== null)
            return this.stopTime - this.startTime;
        return this.startTime ? Date.now() - this.startTime : 0;
    }
}



export default Stopwatch;