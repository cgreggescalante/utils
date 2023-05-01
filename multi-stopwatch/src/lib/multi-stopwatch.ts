import Stopwatch from "./stopwatch";

class MultiStopwatch {
    public stopwatches: Stopwatch[];
    public startTime: number | undefined;
    public stopTime: number | undefined;
    public running: boolean;
    public hasStarted: boolean;
    public name: string;

    constructor() {
        this.stopwatches = [new Stopwatch('1')];
        this.running = false;
        this.hasStarted = false;
        this.name = "Stopwatch";
    }

    addStopwatch() {
        this.stopwatches.push(new Stopwatch((this.stopwatches.length + 1).toString()));
    }

    removeStopwatch() {
        this.stopwatches = this.stopwatches.slice(0, this.stopwatches.length - 1);
    }

    startAll(startTime: number) {
        this.startTime = startTime;
        this.stopwatches.forEach(sw => sw.start(startTime));
        this.running = true;
        this.hasStarted = true;
    }

    stopAll(stopTime: number) {
        this.stopTime = stopTime;
        this.stopwatches.forEach(sw => sw.stop(stopTime));
        this.running = false;
    }

    reset() {
        this.startTime = undefined;
        this.stopTime = undefined;
        this.running = false;
        this.hasStarted = false;
        this.stopwatches = this.stopwatches.map(sw => new Stopwatch(sw.name));
    }

    getMaxSplitCount() {
        return this.stopwatches
            .map(sw => sw.getSplits().length)
            .reduce((m, c) => c > m ? c : m, 1);
    }

    lap(index: number, lapTime: number) {
        this.stopwatches[index].lap(lapTime);
    }

    stop(index: number, stopTime: number) {
        this.stopwatches[index].stop(stopTime);

        if (!this.stopwatches.some(s => s.isRunning())) {
            this.running = false;
        }
    }

    setName(index: number, name: string) {
        this.stopwatches[index].name = name;
    }

    getSplitTime(index: number, splitIndex: number) {
        return this.stopwatches[index].getSplits()[splitIndex].splitTime;
    }

    getLapTime(index: number, lapIndex: number) {
        return this.stopwatches[index].getSplits()[lapIndex].lapTime;
    }

    deepCopy(): MultiStopwatch {
        const m = new MultiStopwatch();

        m.stopwatches = this.stopwatches.map(s => s.deepCopy());
        m.startTime = this.startTime;
        m.stopTime = this.stopTime;
        m.running = this.running;
        m.hasStarted = this.hasStarted;
        m.name = this.name;

        return m;
    }
}

export default MultiStopwatch;