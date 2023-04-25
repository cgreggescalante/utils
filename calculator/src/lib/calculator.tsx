import {useState} from "react";
import {ManagedInput} from "@utils/shared/ui";
import parseFormula from "./parse-formula";

/* eslint-disable-next-line */
export interface CalculatorProps {}

export function Calculator(props: CalculatorProps) {
    const [formula, setFormula] = useState("");


    return (
        <>
            <ManagedInput value={formula} valueSetter={setFormula} />
            <button onClick={() => console.log(parseFormula(formula).value())}>Parse</button>
        </>
    );
}

export default Calculator;
