import {useState} from "react";
import MultiStopwatch from "./multi-stopwatch";
import MultiStopwatchComponent from "./multi-stopwatch-component/multi-stopwatch-component";
import * as XLSX from 'xlsx';
import downloadFile from "./download-file";
import {ManagedInput} from "@utils/shared/ui";
import {formatMilliseconds} from "@utils/shared/tools";

const stopwatchSession = () => {
    const [sessionName, setSessionName] = useState<string>('New Session');
    const [multiStopwatches, setMultiStopwatches] = useState([new MultiStopwatch("Stopwatch 1")])

    const addMultiStopwatch = () => {
        const arr = [...multiStopwatches];
        arr.push(new MultiStopwatch(`Stopwatch ${arr.length}`));
        setMultiStopwatches(arr);
    }

    const removeMultiStopwatch = () => {
        const arr = [...multiStopwatches];
        setMultiStopwatches(arr.slice(0, arr.length - 1));
    }

    const setMultiStopwatch = (multiStopwatch: MultiStopwatch, index: number) => {
        const arr = [...multiStopwatches];
        arr[index] = multiStopwatch;
        setMultiStopwatches(arr);
    }

    const exportData = () => {
        const arr = multiStopwatches.filter(ms => !ms.running && ms.hasStarted);

        const workbook = XLSX.utils.book_new();

        arr.forEach(ms => {
            const data: (string | number | undefined)[][] = [['Relay/Runner', 'Finish Time']];

            for (let i = 0; i < ms.getMaxSplitCount(); i++) {
                data[0].push(`Lap ${i + 1}`);
            }

            ms.stopwatches.forEach(sw => {
                const a = [sw.name, formatMilliseconds(sw.getElapsedTime())];
                const b: (string | number)[] = ['', '']

                sw.getSplits().forEach(split =>  {
                    a.push(formatMilliseconds(split.splitTime));
                    b.push(formatMilliseconds(split.lapTime));
                });

                data.push(a, b)
            });

            const worksheet = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, ms.name);
        });

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        downloadFile(`${sessionName}.xlsx`, blob);
    }

    return (
        <>
            <ManagedInput value={sessionName} valueSetter={setSessionName} />

            <div>
                <button onClick={addMultiStopwatch}>+</button>
                <button onClick={removeMultiStopwatch} disabled={multiStopwatches.length == 0}>-</button>
                <button onClick={exportData}>Export (.xlsx)</button>
            </div>

            {
                multiStopwatches.map((ms, i) =>
                    <MultiStopwatchComponent key={i} multiStopwatch={ms} setMultiStopwatch={(ms: MultiStopwatch) => setMultiStopwatch(ms, i)} />
                )
            }
        </>
    )
}

export default stopwatchSession;