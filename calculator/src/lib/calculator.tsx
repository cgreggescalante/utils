import {useState} from "react";
import {ManagedInput} from "@utils/shared/ui";
import parseFormula from "./parse-formula";

/* eslint-disable-next-line */
export interface CalculatorProps {}

export function Calculator(props: CalculatorProps) {
    const [formula, setFormula] = useState("");
    const [output, setOutput] = useState(0);

    return (
        <>
            <ManagedInput value={formula} valueSetter={setFormula} />
            <button onClick={() => setOutput(parseFormula(formula).value())}>Parse</button>
            <div>
                { output }
            </div>
        </>
    );
}

export default Calculator;
