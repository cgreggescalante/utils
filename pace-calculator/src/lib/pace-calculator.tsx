import styles from './pace-calculator.module.css';
import {useState} from "react";
import {ManagedInput, ManagedSelector} from "@utils/shared/ui";
import {formatSeconds} from "@utils/shared/tools";

const SplitDistances = [
    100,
    200,
    300,
    400,
    600,
    800,
    1000,
    1600,
    1609.34,
    5000,
    10000
]

export function PaceCalculator() {
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("5");
    const [seconds, setSeconds] = useState("0");

    const [distance, setDistance] = useState(1600);
    const [splitDistance, setSplitDistance] = useState(400);

    return (
        <div className={styles['container']}>
            <ManagedInput value={hours} valueSetter={setHours} />
            <ManagedInput value={minutes} valueSetter={setMinutes} />
            <ManagedInput value={seconds} valueSetter={setSeconds} />

            <ManagedSelector label={"Distance"} value={distance} valueSetter={setDistance} options={
                [
                    { value: 400, text: "400m" },
                    { value: 800, text: "800m" },
                    { value: 1500, text: "1500m" },
                    { value: 1600, text: "1600m" },
                    { value: 1609.34, text: "1 Mile" },
                    { value: 5000, text: "5000m" },
                    { value: 10000, text: "10000m" },
                    { value: 21097.5, text: "Half Marathon (21.1 km)" },
                    { value: 42195, text: "Marathon (42.2 km)" },
                ]
            } />

            <ManagedSelector label={"Split Distance"} value={splitDistance} valueSetter={setSplitDistance} options={
                SplitDistances.map(d => ({ value: d, text: d.toString() }))
            } />

            <table>
                {
                    SplitDistances
                        .filter(d => d <= distance)
                        .map(d =>
                            <tr>
                                <td>{ d }</td>
                                <td>{ formatSeconds((parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds)) / distance * d) }</td>
                            </tr>
                        )
                }
            </table>

            <br />

            <table>
                {
                    Array.from({ length: Math.floor(distance / splitDistance) })
                        .map((_, i) => (
                            <tr>
                                <td>{ splitDistance * (i + 1)}</td>
                                <td>{ formatSeconds((parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds)) / distance * splitDistance * (i + 1))}</td>
                            </tr>
                        ))
                }
            </table>
        </div>
    );
}

export default PaceCalculator;
