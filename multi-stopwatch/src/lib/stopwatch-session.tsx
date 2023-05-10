import {useEffect, useState} from "react";
import MultiStopwatch from "./multi-stopwatch";
import MultiStopwatchComponent from "./multi-stopwatch-component/multi-stopwatch-component";
import * as XLSX from 'xlsx';
import downloadFile from "./download-file";
import {ManagedInput} from "@utils/shared/ui";
import {Button, Card, Dropdown, DropdownButton} from "react-bootstrap";


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

    const addMultiStopwatch = (relay: boolean = false, intermediateSplits: boolean = false) => {
        const arr = [...multiStopwatches];
        arr.push(new MultiStopwatch(`Stopwatch`, relay, intermediateSplits));
        setMultiStopwatches(arr);
    }

    const removeMultiStopwatch = (index: number) => {
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
        if (confirm("Are you sure you want to clear the session?")) {
            setSessionName('New Session');
            setMultiStopwatches([new MultiStopwatch('Stopwatch')]);
        }
    }

    const addMultiStopwatchDrop = (e: string | null) => {
        if (e == "1") {
            addMultiStopwatch();
        } else if (e == "2") {
            addMultiStopwatch(true, true);
        } else if (e == "3") {
            addMultiStopwatch(true);
        }
    }

    return (
        <div style={{ backgroundColor: "#1E1F06", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: '1' }}>
                <Card className={'mx-auto py-4 px-4'} style={{ backgroundColor: "#F0ECD1", maxWidth: "600px", marginTop: "2%" }}>
                    <ManagedInput value={sessionName} valueSetter={setSessionName} />

                    <Card.Body>
                        <Button variant={"info"} onClick={exportData}>Export (.xlsx)</Button>
                        <Button variant={"warning"} onClick={clearSession}>Clear Session</Button>

                        <DropdownButton title={"Add"} onSelect={addMultiStopwatchDrop}>
                            <Dropdown.Item eventKey="1">Standard</Dropdown.Item>
                            <Dropdown.Item eventKey="2">4x800m</Dropdown.Item>
                            <Dropdown.Item eventKey="3">4x400m</Dropdown.Item>
                        </DropdownButton>
                    </Card.Body>

                </Card>

                {
                    multiStopwatches.map((ms, i) =>
                        <MultiStopwatchComponent multiStopwatch={ms} setMultiStopwatch={(ms: MultiStopwatch) => setMultiStopwatch(ms, i)} removeMultiStopwatch={() => removeMultiStopwatch(i)} />
                    )
                }
            </div>
        </div>
    )
}

export default stopwatchSession;