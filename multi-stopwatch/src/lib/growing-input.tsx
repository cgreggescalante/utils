import React, {ChangeEvent, useEffect, useRef, useState} from "react";

const GrowingInput = ({ value, onChange }: { value: string | undefined, onChange: (v: any) => void }) => {
    const [content, setContent] = useState(value);
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setWidth(span && span.current ? span.current.offsetWidth : 0);
    }, [content]);

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
        onChange(e.target.value);
    };

    return (
        <>
            <span style={{
                position: "absolute", opacity: 0, zIndex: -100, whiteSpace: "pre"
            }} ref={span}>{content}</span>
            <input type="text" value={content} style={{ minWidth: "1px", padding: 0, width: width + 5 }} autoFocus onChange={changeHandler} />
        </>
    );
};

export default GrowingInput;