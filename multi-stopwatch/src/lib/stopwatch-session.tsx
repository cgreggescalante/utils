import {useEffect, useState} from "react";
import MultiStopwatch from "./multi-stopwatch";
import MultiStopwatchComponent from "./multi-stopwatch-component/multi-stopwatch-component";
import * as XLSX from 'xlsx';
import downloadFile from "./download-file";
import {ManagedInput} from "@utils/shared/ui";
import {Card} from "react-bootstrap";


type UseLocalStorageStateResult<T> = [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorageState<T>(key: string, defaultValue: T): UseLocalStorageStateResult<T> {
    const [state, setState] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

function useLocalStorageMultiStopwatchArray(defaultValue: MultiStopwatch[]): [MultiStopwatch[], React.Dispatch<React.SetStateAction<MultiStopwatch[]>>] {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem('MultiStopwatchesState');
        if (!storedValue)
            return defaultValue;

        return JSON.parse(storedValue).map((ms: Object) => MultiStopwatch.fromObject(ms));
    });

    useEffect(() => {
        localStorage.setItem('MultiStopwatchesState', JSON.stringify(state));
    }, [state]);

    return [state, setState];
}

const stopwatchSession = () => {
    const [sessionName, setSessionName] = useLocalStorageState<string>('SessionName', 'New Session');
    const [multiStopwatches, setMultiStopwatches] = useLocalStorageMultiStopwatchArray([new MultiStopwatch("Stopwatch 1")])

    const addMultiStopwatch = () => {
        const arr = [...multiStopwatches];
        arr.push(new MultiStopwatch(`Stopwatch`));
        setMultiStopwatches(arr);
    }

    const addRelayStopwatch = (intermediateSplits: boolean) => {
        const arr = [...multiStopwatches];
        arr.push(new MultiStopwatch(`Stopwatch`, true, intermediateSplits));
        setMultiStopwatches(arr);
    }

    const removeMultiStopwatchIndex = (index: number) => {
        const arr = [...multiStopwatches];
        arr.splice(index, 1);
        setMultiStopwatches(arr);
    }

    const setMultiStopwatch = (multiStopwatch: MultiStopwatch, index: number) => {
        const arr = [...multiStopwatches];
        arr[index] = multiStopwatch;
        setMultiStopwatches(arr);
    }

    const exportData = () => {
        const arr = multiStopwatches.filter(ms => !ms.running && ms.hasStarted);

        const workbook = XLSX.utils.book_new();

        arr.forEach((ms, index) => {
            const worksheet = XLSX.utils.aoa_to_sheet(ms.export());
            XLSX.utils.book_append_sheet(workbook, worksheet, `${index} ${ms.name}`);
        });

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        downloadFile(`${sessionName}.xlsx`, blob);
    }

    const clearSession = () => {
        setSessionName('New Session');
        setMultiStopwatches([new MultiStopwatch('Stopwatch 1')]);
    }

    return (
        <div style={{ backgroundColor: "#1E1F06", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: '1' }}>
                <Card className={'mx-auto py-4 px-4'} style={{ backgroundColor: "#F0ECD1", maxWidth: "600px", marginTop: "2%" }}>
                    <ManagedInput value={sessionName} valueSetter={setSessionName} />

                    <div>
                        <button onClick={addMultiStopwatch}>Add</button>
                        <button onClick={() => addRelayStopwatch(true)}>Add 4x800m</button>
                        <button onClick={() => addRelayStopwatch(false)}>Add 4x400m</button>
                    </div>
                    <div>
                        <button onClick={exportData}>Export (.xlsx)</button>
                        <button onClick={clearSession}>Clear Session</button>
                    </div>
                </Card>

                {
                    multiStopwatches.map((ms, i) =>
                        <MultiStopwatchComponent multiStopwatch={ms} setMultiStopwatch={(ms: MultiStopwatch) => setMultiStopwatch(ms, i)} removeMultiStopwatch={() => removeMultiStopwatchIndex(i)} />
                    )
                }
            </div>
        </div>
    )
}

export default stopwatchSession;