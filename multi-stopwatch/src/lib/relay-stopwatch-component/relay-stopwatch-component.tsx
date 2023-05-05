import {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {GrowingInput, ManagedInput} from "@utils/shared/ui";
import {formatMilliseconds} from "@utils/shared/tools";
import MultiStopwatch from "../multi-stopwatch";
import style from './relay-stopwatch-component.module.css';
import stopwatch from "../stopwatch";

interface RelayStopwatchProps {
    multiStopwatch: MultiStopwatch;
    setMultiStopwatch: (ms: MultiStopwatch) => void;
}

const RelayStopwatchComponent = ({ multiStopwatch, setMultiStopwatch }: RelayStopwatchProps) => {
    const [elapsedTime, setElapsedTime] = useState<number>(0);

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

    const handleStopAll = (stopTime: number) => {
        const m = multiStopwatch.deepCopy();
        m.stopAll(stopTime);
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

    return (
        <Card className={'mx-auto py-1 px-1'} style={{ backgroundColor: "#F0ECD1", maxWidth: "800px", minHeight: "200px", marginTop: "2%", marginBottom: "2%" }}>
            <div>
                <button onClick={() => handleStartAll(Date.now())} disabled={multiStopwatch.running}>Start All</button>
                <button onClick={() => handleStopAll(Date.now())} disabled={!multiStopwatch.running}>Stop All</button>
                <button onClick={handleReset}>Reset</button>
                <button onClick={handleAddStopwatch} disabled={multiStopwatch.running}>+</button>
                <button onClick={handleRemoveStopwatch} disabled={multiStopwatch.stopwatches.length == 0}>-</button>
            </div>

            <Card.Body>
                <div>
                    <ManagedInput value={multiStopwatch.name} valueSetter={(name: string) => updateName(name)} />
                </div>

                { formatMilliseconds(elapsedTime, { decimalDigits: 1 } ) }

                <div className={"table-responsive"}>
                    <table className={"table table-sm table-striped-columns align-middle"}>
                        <thead>
                        <tr>
                            <th style={{ width: "1%" }}/>
                            <th style={{ width: "1%" }}/>
                            <th style={{ width: "1%" }}/>
                            {
                                Array.from({ length: getMaxSplitCount() }, (_, index) => index + 1).map(i => <th key={i}>{ i }</th>)
                            }
                            {
                                multiStopwatch.intermediateSplit ? <th>Leg</th> : <></>
                            }
                            <th style={{ width: "90%" }}/>
                        </tr>
                        </thead>
                        <tbody className={"table-group-divider"}>
                        {
                            multiStopwatch.stopwatches.map((sw, stopwatchIndex) =>
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


                                    {/*<tr key={stopwatchIndex} style={{ height: "65px" }}>*/}
                                    {/*    <td className={"fs-5"}>*/}
                                    {/*        <GrowingInput value={ sw.name } onChange={(v) => handleNameChange(stopwatchIndex, v)}/>*/}
                                    {/*    </td>*/}
                                    {/*    <td className={style.fillable}>*/}
                                    {/*        <button className={style.expand} onClick={() => handleLap(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Lap</button>*/}
                                    {/*    </td>*/}
                                    {/*    <td>*/}
                                    {/*        <GrowingInput value={sw.legNames[0]} onChange={(v: string) => setLegName(stopwatchIndex, 0, v)} />*/}
                                    {/*    </td>*/}
                                    {/*    { sw.getSplits().length ?*/}
                                    {/*        <td key={0}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 0)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 0)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*    { sw.getSplits().length > 1 ?*/}
                                    {/*        <td key={1}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 1)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 1)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*</tr>*/}



                                    {/*<tr key={stopwatchIndex} style={{ height: "65px" }}>*/}
                                    {/*    <td></td>*/}
                                    {/*    <td className={style.fillable}>*/}
                                    {/*        <button className={style.expand} onClick={() => handleStop(stopwatchIndex, Date.now())} disabled={!sw.isRunning() || sw.isFinished()}>Finish</button>*/}
                                    {/*    </td>*/}
                                    {/*    <td>*/}
                                    {/*        <GrowingInput value={sw.legNames[1]} onChange={(v: string) => setLegName(stopwatchIndex, 1, v)} />*/}
                                    {/*    </td>*/}
                                    {/*    { sw.getSplits().length > 2 ?*/}
                                    {/*        <td key={2}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 2)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 2)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*    { sw.getSplits().length > 3 ?*/}
                                    {/*        <td key={3}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 3)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 3)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*</tr>*/}



                                    {/*<tr key={stopwatchIndex} style={{ height: "65px" }}>*/}
                                    {/*    <td></td>*/}
                                    {/*    <td></td>*/}
                                    {/*    <td>*/}
                                    {/*        <GrowingInput value={sw.legNames[2]} onChange={(v: string) => setLegName(stopwatchIndex, 2, v)} />*/}
                                    {/*    </td>*/}

                                    {/*    { sw.getSplits().length > 4 ?*/}
                                    {/*        <td key={4}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 4)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 4)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*    { sw.getSplits().length > 5 ?*/}
                                    {/*        <td key={5}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 5)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 5)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*</tr>*/}



                                    {/*<tr key={stopwatchIndex} style={{ height: "65px" }}>*/}
                                    {/*    <td></td>*/}
                                    {/*    <td></td>*/}
                                    {/*    <td>*/}
                                    {/*        <GrowingInput value={sw.legNames[3]} onChange={(v: string) => setLegName(stopwatchIndex, 3, v)} />*/}
                                    {/*    </td>*/}

                                    {/*    { sw.getSplits().length > 6 ?*/}
                                    {/*        <td key={4}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 6)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 6)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*    { sw.getSplits().length > 7 ?*/}
                                    {/*        <td key={5}>*/}
                                    {/*            <span className={"fs-5"}>{ formatMilliseconds(multiStopwatch.getSplitTime(stopwatchIndex, 7)) }</span> <br />*/}
                                    {/*            <span className={"fw-light fs-6"}>{ formatMilliseconds(multiStopwatch.getLapTime(stopwatchIndex, 7)) }</span>*/}
                                    {/*        </td> : <td></td>*/}
                                    {/*    }*/}
                                    {/*</tr>*/}
                                </>
                            )
                        }
                        </tbody>
                    </table>
                </div>

            </Card.Body>

        </Card>
    );
};

export default RelayStopwatchComponent;
