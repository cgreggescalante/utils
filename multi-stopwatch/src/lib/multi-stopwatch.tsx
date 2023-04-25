import {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import GrowingInput from "./growing-input";
import downloadFile from "./dowload-file";
import Stopwatch from "./stopwatch";
import {exportLaps, LapExportFormat} from "./lap-export";

const MultiStopwatch = () => {
    const [stopwatches, setStopwatches] = useState<Stopwatch[]>([new Stopwatch("1")]);
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [running]);

    const handleAddStopwatch = () => {
        const ns = [...stopwatches, new Stopwatch((stopwatches.length + 1).toString())]
        setStopwatches(ns);
    }

    const handleRemoveStopwatch = () => {
        const ns = [...stopwatches.slice(0, stopwatches.length - 1)];
        setStopwatches(ns);
    };

    const handleStartAll = () => {
        const startTime = Date.now();
        const ns = stopwatches.map(sw => { sw.start(startTime); return sw });
        setStopwatches(ns);
        setStartTime(startTime);
        setRunning(true);
    }

    const handleStopAll = (stopTime: number) => {
        const ns = stopwatches.map(sw => {
            if (sw.isRunning()) {
                sw.stop(stopTime);
            }
            return sw;
        });

        setStopwatches(ns);
        setRunning(false);
        setElapsedTime(stopTime - startTime)
    }

    const handleReset = () => {
        const ns = stopwatches.map(sw => new Stopwatch(sw.name));
        setStopwatches(ns);
        setStartTime(0);
        setElapsedTime(0);
        setRunning(false);
    }

    const exportJSON = () => {
        const exportData = exportLaps(stopwatches.map(sw => sw.saveData()), LapExportFormat.JSON);
        const blob = new Blob([exportData], { type: "application/json"});

        downloadFile("save.json", blob);
    }

    const exportCSV = () => {
        const exportData = exportLaps(stopwatches.map(sw => sw.saveData()), LapExportFormat.CSV);
        const blob = new Blob([exportData], { type: "text/csv"});

        downloadFile("save.csv", blob);
    }

    const getMaxSplitCount = () => stopwatches.map(sw => sw.getSplits().length).reduce((max, current) => current > max ? current : max, 1);

    const handleLap = (index: number, time: number) => {
        const ns = [...stopwatches];
        const updated = stopwatches[index];
        updated.lap(time);
        ns[index] = updated;
        setStopwatches(ns);
    }

    const handleStop = (index: number, time: number) => {
        const ns = [...stopwatches];
        ns[index].stop(time);
        setStopwatches(ns);
        const nr = ns.some(sw => sw.isRunning());
        if (!nr) {
            handleStopAll(time);
        }
        setRunning(nr);
    }

    const handleNameChange = (index: number, name: string) => {
        const ns = [...stopwatches];
        ns[index].name = name;
        setStopwatches(ns);
    }

    return (
        <Card className={'mx-auto py-1 px-1'} style={{ maxWidth: "800px", minHeight: "200px", marginTop: "2%" }}>
            <div>
                <button onClick={handleStartAll} disabled={running}>Start All</button>
                <button onClick={() => handleStopAll(Date.now())} disabled={!running}>Stop All</button>
                <button onClick={handleReset}>Reset</button>
                <button onClick={handleAddStopwatch} disabled={running}>+</button>
                <button onClick={handleRemoveStopwatch} disabled={stopwatches.length == 0}>-</button>
            </div>

            <Card.Body>
                {elapsedTime / 1000}s

                <div className={"table-responsive"}>
                    <table className={"table table-sm table-striped-columns align-middle"}>
                        <thead>
                        <tr>
                            <th style={{ width: "1%" }}/>
                            <th style={{ width: "1%" }}/>
                            <th style={{ width: "1%" }}/>
                            {
                                Array.from({ length: getMaxSplitCount() }, (_, index) => getMaxSplitCount() - index).map(i => <th>{ i }</th>)
                            }
                            <th style={{ width: "98%" }}/>
                        </tr>
                        </thead>
                        <tbody className={"table-group-divider"}>
                        {
                            stopwatches.map((sw, index) =>
                                <tr style={{ height: "65px" }}>
                                    <td className={"fs-5"}>
                                        <GrowingInput value={ sw.name } onChange={(v) => handleNameChange(index, v)}/>
                                    </td>
                                    <td>
                                        <span><button onClick={() => handleLap(index, Date.now())} disabled={elapsedTime == 0 || sw.isFinished()}>Lap</button></span>
                                    </td>
                                    <td>
                                        <span><button onClick={() => handleStop(index, Date.now())} disabled={elapsedTime == 0 || sw.isFinished()}>Finish</button></span>
                                    </td>
                                    {
                                        Array.from({ length: getMaxSplitCount() }, (_, index) => getMaxSplitCount() - index - 1).map(i =>
                                            i >= sw.getSplits().length ?
                                                <td></td>
                                                :
                                                <td>
                                                    <span className={"fs-5"}>{ sw.getSplits()[i].splitTime / 1000 }</span> <br />
                                                    <span className={"fw-light fs-6"}>{ sw.getSplits()[i].lapTime / 1000 }</span>
                                                </td>
                                        )
                                    }
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>

            </Card.Body>

            <div>
                <button onClickCapture={exportJSON} disabled={stopwatches.length == 0 || startTime == 0}>Export JSON</button>
                <button onClickCapture={exportCSV} disabled={stopwatches.length == 0 || startTime == 0}>Export CSV</button>
            </div>
        </Card>
    );
};

export default MultiStopwatch;
