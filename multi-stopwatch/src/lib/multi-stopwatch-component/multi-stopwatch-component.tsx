import {useEffect, useState} from "react";
import {Button, Collapse} from "react-bootstrap";
import {GrowingInput, ManagedInput} from "@utils/shared/ui";
import {formatMilliseconds} from "@utils/shared/tools";
import MultiStopwatch from "../multi-stopwatch";
import style from './multi-stopwatch-component.module.css';

interface MultiStopwatchProps {
    multiStopwatch: MultiStopwatch;
    setMultiStopwatch: (ms: MultiStopwatch) => void;
    removeMultiStopwatch: () => void;
}

const MultiStopwatchComponent = ({ multiStopwatch, setMultiStopwatch, removeMultiStopwatch }: MultiStopwatchProps) => {
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (multiStopwatch.running && multiStopwatch.startTime !== undefined)
            interval = setInterval(() => setElapsedTime(Date.now() - (multiStopwatch.startTime !== undefined ? multiStopwatch.startTime : Date.now())), 100);
        return () => clearInterval(interval);
    }, [multiStopwatch.running]);

    const handleAddStopwatch = () => {
        const m = multiStopwatch.deepCopy();
        m.addStopwatch();
        setMultiStopwatch(m);
    }

    const handleRemoveStopwatch = () => {
        const m = multiStopwatch.deepCopy();
        m.removeStopwatch();
        setMultiStopwatch(m);
    };

    const handleStartAll = (startTime: number) => {
        const m = multiStopwatch.deepCopy();
        m.startAll(startTime);
        setMultiStopwatch(m);
    }

    const handleReset = () => {
        const m = multiStopwatch.deepCopy();
        m.reset();
        setElapsedTime(0);
        setMultiStopwatch(m);
    }

    const getMaxSplitCount = () => multiStopwatch.getMaxSplitCount();

    const handleLap = (index: number, time: number) => {
        const m = multiStopwatch.deepCopy();
        m.lap(index, time);
        setMultiStopwatch(m);
    }

    const handleStop = (index: number, time: number) => {
        const m = multiStopwatch.deepCopy();
        m.stop(index, time);

        if (!m.running && m.startTime !== undefined) {
            setElapsedTime(time - m.startTime);
        }

        setMultiStopwatch(m);
    }

    const handleNameChange = (index: number, name: string) => {
        const m = multiStopwatch.deepCopy();
        m.setName(index, name)
        setMultiStopwatch(m);
    }

    const updateName = (name: string) => {
        const m = multiStopwatch.deepCopy();
        m.name = name;
        setMultiStopwatch(m);
    }

    const setLegName = (stopwatchIndex: number, legIndex: number, name: string) => {
        const m = multiStopwatch.deepCopy();
        m.stopwatches[stopwatchIndex].legNames[legIndex] = name;
        setMultiStopwatch(m);
    }

    const removeThis = () => {
        if (confirm(`Are you sure you want to delete ${multiStopwatch.name}?`))
            removeMultiStopwatch();
    }

    return (
        <div className="container mx-auto py-1 px-1" style={{ backgroundColor: "#F0ECD1", maxWidth: "800px", marginTop: "2%", marginBottom: "2%" }}>
            <ManagedInput value={multiStopwatch.name} valueSetter={(name: string) => updateName(name)} />

            <Button variant="primary" onClick={() => setOpen(!open)}>
                <b>{ open ? "-" : "+" }</b>
            </Button>
            <Button variant="warning" onClick={removeThis}><b>X</b></Button>

            <Collapse in={open}>
                <div>
                    <div>
                        <button onClick={() => handleStartAll(Date.now())} disabled={multiStopwatch.running}>Start All</button>
                        <button onClick={handleReset}>Reset</button>
                        <button onClick={handleAddStopwatch} disabled={multiStopwatch.running}>+</button>
                        <button onClick={handleRemoveStopwatch} disabled={multiStopwatch.stopwatches.length == 0}>-</button>
                    </div>

                    { formatMilliseconds(elapsedTime, { decimalDigits: 1 } ) }

                    <div className={"table-responsive"}>
                        <table className={"table table-sm table-striped-columns align-middle"}>
                            <thead>
                            <tr>
                                <th style={{ width: "1%" }}/>
                                <th style={{ width: "1%" }}/>
                                <th style={{ width: "1%" }}/>

                                { multiStopwatch.relay ?
                                    <>
                                        <th>1</th>
                                        { multiStopwatch.intermediateSplit ? <><th>2</th><th>Leg</th></> : <></> }
                                    </> :
                                    <>
                                        { Array.from({ length: getMaxSplitCount() }, (_, index) => getMaxSplitCount() - index).map(i => <th key={i}>{ i }</th>) }
                                    </>
                                }
                                <th style={{ width: "90%" }}/>
                            </tr>
                            </thead>

                            <tbody className={"table-group-divider"}>
                            {
                                multiStopwatch.stopwatches.map((sw, stopwatchIndex) =>
                                    multiStopwatch.relay ?
                                        <>
                                            {
                                                sw.legNames.map((legName, index) =>
                                                    <tr key={stopwatchIndex} style={{ height: "65px" }}>
                                                        {
                                                            index == 0 ?
                                                                <td className={"fs-5"}>
                                                                    <GrowingInput value={ sw.name } onChange={(v) => handleNameChange(stopwatchIndex, v)}/>
                                                                </td> : <td />
                                                        }

                                                        {
                                                            index == 0 ?
                                                                <td className={style.fillable}>
                                                                    <button className={style.expand} onClick={() => handleLap(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Lap</button>
                                                                </td> :
                                                                index == 1 ?
                                                                    <td className={style.fillable}>
                                                                        <button className={style.expand} onClick={() => handleStop(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Finish</button>
                                                                    </td> : <td />
                                                        }

                                                        <td>
                                                            <GrowingInput value={legName} onChange={(v: string) => setLegName(stopwatchIndex, index, v)} />
                                                        </td>

                                                        {
                                                            multiStopwatch.intermediateSplit ?
                                                                <>
                                                                    {
                                                                        sw.getSplits().length > index * 2 ?
                                                                            <td key={index * 2}>
                                                                                <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index * 2)) }</span> <br />
                                                                                <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2)) }</span>
                                                                            </td> : <td />
                                                                    }
                                                                    {
                                                                        sw.getSplits().length > index * 2 + 1 ?
                                                                            <td key={index * 2 + 1}>
                                                                                <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index * 2 + 1)) }</span> <br />
                                                                                <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2 + 1)) }</span>
                                                                            </td> : <td />
                                                                    }
                                                                </> :
                                                                sw.getSplits().length > index ?
                                                                    <td key={index}>
                                                                        <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index)) }</span> <br />
                                                                        <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index)) }</span>
                                                                    </td> : <></>
                                                        }

                                                        {
                                                            multiStopwatch.intermediateSplit && sw.getSplits().length > index * 2 + 1 ?
                                                                <td key={'Split' + index * 2 + 1}>
                                                                    <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2 + 1) + multiStopwatch.getLapTime(stopwatchIndex, index * 2)) }</span> <br />
                                                                </td> : <td />
                                                        }
                                                    </tr>
                                                )
                                            }
                                        </> :
                                        <tr key={stopwatchIndex} style={{ height: "65px" }}>
                                            <td className={"fs-5"}>
                                                <GrowingInput value={ sw.name } onChange={(v) => handleNameChange(stopwatchIndex, v)}/>
                                            </td>
                                            <td className={style.fillable}>
                                                <button className={style.expand} onClick={() => handleLap(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Lap</button>
                                            </td>
                                            <td className={style.fillable}>
                                                <button className={style.expand} onClick={() => handleStop(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Finish</button>
                                            </td>
                                            {
                                                Array.from({ length: getMaxSplitCount() }, (_, i) => getMaxSplitCount() - i - 1).map(splitIndex =>
                                                    splitIndex >= sw.getSplits().length ?
                                                        <td key={splitIndex}></td>
                                                        :
                                                        <td key={splitIndex}>
                                                            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, splitIndex)) }</span> <br />
                                                            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, splitIndex)) }</span>
                                                        </td>
                                                )
                                            }
                                        </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default MultiStopwatchComponent;
