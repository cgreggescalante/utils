import {useState} from "react";
import MultiStopwatch from "./multi-stopwatch";
import MultiStopwatchComponent from "./multi-stopwatch-component";

const stopwatchSession = () => {
    const [multiStopwatch, setMultiStopwatch] = useState(new MultiStopwatch())

    return (
        <MultiStopwatchComponent multiStopwatch={multiStopwatch} setMultiStopwatch={setMultiStopwatch} />
    )
}

export default stopwatchSession;