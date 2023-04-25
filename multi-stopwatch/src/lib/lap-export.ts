import {StopwatchSave} from "./stopwatch-save";

export enum LapExportFormat {
    CSV,
    JSON
}

export const exportLaps = (save: StopwatchSave[], format: LapExportFormat) => {
    switch (format) {
        case LapExportFormat.CSV:
            return exportCSV(save);
        case LapExportFormat.JSON:
            return exportJSON(save);
    }
}

const exportCSV = (save: StopwatchSave[]) => {
    let header = 'Stopwatch Name,Finish Time,,'
    const maxSplitCount = save
        .map(s => s.splits ? s.splits.length : 0)
        .reduce((max, current) => current > max ? current : max, 0);

    let body = "";

    if (maxSplitCount > 0) {
        header += Array.from({ length: maxSplitCount }).map((_, index) => `Lap ${(index + 1)}`).join()
        body = save.map(s =>
            `${s.saveName},${s.elapsedTime},Split,` + s.splits?.map(split => split.splitTime).join(",") +
            `\n,,Lap,` + s.splits?.map(split => split.lapTime).join(",")
        ).join("\n")
    } else {
        body = save.map(s =>
            `${s.saveName},${s.elapsedTime}\n`
        ).join()
    }

    return header + "\n" + body
}

const exportJSON = (save: StopwatchSave[]) => JSON.stringify(save);