import React, {ChangeEvent, useEffect, useRef, useState} from "react";

/* eslint-disable-next-line */
export interface GrowingInputProps {
    label?: string | undefined,
    value: string | number | undefined,
    onChange: (v: any) => void
}

export function GrowingInput({label, value, onChange}: GrowingInputProps) {
    const [content, setContent] = useState(value);
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => setWidth(span && span.current ? span.current.offsetWidth : 0), [content]);

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
        onChange(e.target.value);
    }

    return (
        <>
            <span style={{ position: "absolute", opacity: 0, zIndex: -100, whiteSpace: "pre" }} ref={span}>{ content }</span>
            <input type="text" value={content} style={{ minWidth: "1px", padding: 0, width: width + 5 }} onChange={changeHandler} />
        </>
    )
}

export default GrowingInput;
