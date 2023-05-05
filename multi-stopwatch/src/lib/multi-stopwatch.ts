import Stopwatch from "./stopwatch";
import {formatMilliseconds} from "@utils/shared/tools";

class MultiStopwatch {
    public stopwatches: Stopwatch[];
    public startTime: number | undefined;
    public stopTime: number | undefined;
    public running: boolean;
    public hasStarted: boolean;
    public name: string;

    public relay: boolean;
    public intermediateSplit: boolean;

    constructor(name: string, relay: boolean = false, intermediateSplit: boolean = false) {
        this.relay = relay;
        this.intermediateSplit = intermediateSplit;

        this.stopwatches = [new Stopwatch('1', relay, intermediateSplit)];
        this.running = false;
        this.hasStarted = false;
        this.name = name;
    }

    addStopwatch() {
        this.stopwatches.push(new Stopwatch((this.stopwatches.length + 1).toString(), this.relay, this.intermediateSplit));
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
        this.stopwatches = this.stopwatches.map(sw => new Stopwatch(sw.name, this.relay, this.intermediateSplit));
    }

    getMaxSplitCount() {
        if (this.relay) {
            return this.intermediateSplit ? 2 : 1
        }

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
        const m = new MultiStopwatch(this.name);

        m.stopwatches = this.stopwatches.map(s => s.deepCopy());
        m.startTime = this.startTime;
        m.stopTime = this.stopTime;
        m.running = this.running;
        m.hasStarted = this.hasStarted;
        m.relay = this.relay;
        m.intermediateSplit = this.intermediateSplit;

        return m;
    }

    export(): any[][] {
        if (this.relay) {
            const arr: (any)[][] = [['Relay', 'Finish Time', 'Runner', 'Lap 1']];

            if (this.intermediateSplit)
                arr[0].push('Lap 2');

            arr[0].push('Leg Time');

            this.stopwatches.forEach(sw => {
                const mult = this.intermediateSplit ? 2 : 1;
                const rows: any[][] = [];

                sw.legNames.forEach((name, index) => {
                    let row = ['', '', name, formatMilliseconds(sw.getSplits()[index * mult].splitTime)]

                    if (this.intermediateSplit)
                        row.push(formatMilliseconds(sw.getSplits()[index * mult + 1].splitTime), formatMilliseconds(sw.getSplits()[index * mult].lapTime + sw.getSplits()[index * mult + 1].lapTime));
                    else
                        row.push(formatMilliseconds(sw.getSplits()[index * mult].lapTime))

                    rows.push(row);

                    if (this.intermediateSplit)
                        rows.push(['', '', '', formatMilliseconds(sw.getSplits()[index * mult].lapTime), formatMilliseconds(sw.getSplits()[index * mult + 1].lapTime)]);
                });

                rows[0][0] = sw.name
                rows[0][1] = formatMilliseconds(sw.getElapsedTime())

                arr.push(...rows);
            });

            return arr;
        }

        const arr: (any)[][] = [['Runner', 'Finish Time']];

        for (let i = 0; i < this.getMaxSplitCount(); i++) {
            arr[0].push(`Lap ${i + 1}`);
        }

        this.stopwatches.forEach(sw => {
            const a = [sw.name, formatMilliseconds(sw.getElapsedTime())];
            const b: (string | number)[] = ['', '']

            sw.getSplits().forEach(split =>  {
                a.push(formatMilliseconds(split.splitTime));
                b.push(formatMilliseconds(split.lapTime));
            });

            arr.push(a, b)
        });

        return arr;
    }

    static fromObject(ms: Object) {
        const nm = Object.assign(new MultiStopwatch(''), ms);
        nm.stopwatches = nm.stopwatches.map(sw => Object.assign(new Stopwatch(sw.name, sw.relay, sw.intermediateSplits), sw))
        return nm;
    }
}

export default MultiStopwatch;