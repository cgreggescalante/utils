import {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Collapse, Row} from "react-bootstrap";
import {GrowingInput, ManagedInput} from "@utils/shared/ui";
import {formatMilliseconds} from "@utils/shared/tools";
import MultiStopwatch from "../multi-stopwatch";
import styles from './multi-stopwatch-component.module.css';
import MultiStopwatchControls from "./multi-stopwatch-controls";

interface MultiStopwatchProps {
    multiStopwatch: MultiStopwatch;
    setMultiStopwatch: (ms: MultiStopwatch) => void;
    removeMultiStopwatch: () => void;
}

function MultiStopwatchHeader(props: {
    multiStopwatchName: string,
    setMultiStopwatchName: (name: string) => void,
    onToggleOpen: () => void,
    open: boolean,
    onRemove: () => void
}) {
    return <>
        <ManagedInput value={props.multiStopwatchName} valueSetter={props.setMultiStopwatchName}/>

        <Button variant="primary" onClick={props.onToggleOpen}>
            <b>{props.open ? "-" : "+"}</b>
        </Button>
        <Button variant="warning" onClick={props.onRemove}><b>X</b></Button>
    </>;
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
        <div className="container mx-auto py-1 px-1"
             style={{backgroundColor: "#F0ECD1", maxWidth: "800px", marginTop: "2%", marginBottom: "2%"}}>
            <MultiStopwatchHeader multiStopwatchName={multiStopwatch.name} setMultiStopwatchName={(name: string) => updateName(name)}
                                  onToggleOpen={() => setOpen(!open)} open={open} onRemove={removeThis}/>

            <Collapse in={open}>
                <div>
                    <MultiStopwatchControls onStartAll={() => handleStartAll(Date.now())}
                                            disabled={multiStopwatch.running}
                                            onReset={handleReset} onAddStopwatch={handleAddStopwatch}
                                            onRemoveStopwatch={handleRemoveStopwatch}
                                            stopwatches={multiStopwatch.stopwatches}/>

                    {formatMilliseconds(elapsedTime, {decimalDigits: 1})}

                    {/* Results Table */}
                    <div className={"table-responsive"}>
                        <table className={"table table-sm table-striped-columns align-middle"}>
                            <thead>
                                <tr>
                                    <th style={{width: "1%"}}/> {/* Stopwatch Name */}
                                    <th style={{width: "1%"}}/> {/* Lap/Finish Buttons */}
                                    <th style={{width: "1%"}}>{ multiStopwatch.relay ? "" : "C"}</th>
                                    {
                                        multiStopwatch.relay ?
                                            <>
                                                <th>1</th>
                                                { multiStopwatch.intermediateSplit ?
                                                    <>
                                                        <th>2</th>
                                                        <th>Leg</th>
                                                    </> : <></>
                                                }
                                            </> :
                                            <>
                                                {
                                                    Array.from({length: getMaxSplitCount()}, (_, index) => getMaxSplitCount() - index).map(i =>
                                                        <th key={i}>{i}</th>
                                                    )
                                                }
                                            </>
                                    }
                                    <th style={{width: "90%"}}/>
                                </tr>
                            </thead>

                            <tbody className={"table-group-divider"}>
                            {
                                multiStopwatch.stopwatches.map((sw, stopwatchIndex) =>
                                    multiStopwatch.relay ?
                                        <>
                                            {
                                                sw.legNames.map((legName, index) =>
                                                    <tr key={stopwatchIndex} style={{minHeight: "65px"}}>
                                                        {
                                                            index == 0 ?
                                                                <>
                                                                    <td className={"fs-5"}>
                                                                        <GrowingInput value={sw.name}
                                                                                      onChange={(v) => handleNameChange(stopwatchIndex, v)}/>
                                                                    </td>
                                                                    <td>
                                                                        <Button variant={"success"}
                                                                                className={styles.relayButton}
                                                                                onClick={() => handleLap(stopwatchIndex, Date.now())}
                                                                                disabled={!sw.isRunning() || sw.isFinished()}>Lap</Button>
                                                                    </td>
                                                                </>
                                                                :
                                                                index == 1 ?
                                                                    <>
                                                                        <td />
                                                                        <td>
                                                                            <Button variant={"secondary"}
                                                                                    className={styles.relayButton}
                                                                                    onClick={() => handleStop(stopwatchIndex, Date.now())}
                                                                                    disabled={!sw.isRunning() || sw.isFinished()}>Finish</Button>
                                                                        </td>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <td />
                                                                        <td />
                                                                    </>
                                                        }

                                                        <td>
                                                            <GrowingInput value={legName}
                                                                          onChange={(v: string) => setLegName(stopwatchIndex, index, v)}/>
                                                        </td>

                                                        {
                                                            multiStopwatch.intermediateSplit ?
                                                                <>
                                                                    {
                                                                        sw.getSplits().length > index * 2 ?
                                                                            <td key={index * 2}>
                                                                                <span
                                                                                    className={"fs-5"}>{formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index * 2))}</span>
                                                                                <br/>
                                                                                <span
                                                                                    className={"fw-light fs-6"}>{formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2))}</span>
                                                                            </td> : <td/>
                                                                    }
                                                                    {
                                                                        sw.getSplits().length > index * 2 + 1 ?
                                                                            <td key={index * 2 + 1}>
                                                                                <span
                                                                                    className={"fs-5"}>{formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index * 2 + 1))}</span>
                                                                                <br/>
                                                                                <span
                                                                                    className={"fw-light fs-6"}>{formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2 + 1))}</span>
                                                                            </td> : <td/>
                                                                    }
                                                                </> :
                                                                sw.getSplits().length > index ?
                                                                    <td key={index}>
                                                                        <span
                                                                            className={"fs-5"}>{formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, index))}</span>
                                                                        <br/>
                                                                        <span
                                                                            className={"fw-light fs-6"}>{formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index))}</span>
                                                                    </td> : <></>
                                                        }

                                                        {
                                                            multiStopwatch.intermediateSplit && sw.getSplits().length > index * 2 + 1 ?
                                                                <td key={'Split' + index * 2 + 1}>
                                                                    <span
                                                                        className={"fs-5"}>{formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, index * 2 + 1) + multiStopwatch.getLapTime(stopwatchIndex, index * 2))}</span>
                                                                    <br/>
                                                                </td> : <td/>
                                                        }
                                                    </tr>
                                                )
                                            }
                                        </> :
                                        <tr key={stopwatchIndex} style={{height: "65px"}}>
                                            <td className={"fs-5"}>
                                                <GrowingInput value={sw.name}
                                                              onChange={(v) => handleNameChange(stopwatchIndex, v)}/>
                                            </td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button variant={"success"} className={styles.lapButton}
                                                            onClick={() => handleLap(stopwatchIndex, Date.now())}
                                                            disabled={!sw.isRunning() || sw.isFinished()}>Lap</Button>
                                                    <Button variant={"secondary"} className={styles.finishButton}
                                                            onClick={() => handleStop(stopwatchIndex, Date.now())}
                                                            disabled={!sw.isRunning() || sw.isFinished()}>Finish</Button>
                                                </ButtonGroup>
                                            </td>
                                            <td>
                                                <span
                                                    className={"fs-5"}>{formatMilliseconds(multiStopwatch.getCurrentElapsedLap(stopwatchIndex), {decimalDigits: 1})}</span>
                                            </td>
                                            {
                                                Array.from({length: getMaxSplitCount()}, (_, i) => getMaxSplitCount() - i - 1).map(splitIndex =>
                                                    splitIndex >= sw.getSplits().length ?
                                                        <td key={splitIndex}></td>
                                                        :
                                                        <td key={splitIndex}>
                                                            <span
                                                                className={"fs-5"}>{formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, splitIndex))}</span>
                                                            <br/>
                                                            <span
                                                                className={"fw-light fs-6"}>{formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, splitIndex))}</span>
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
