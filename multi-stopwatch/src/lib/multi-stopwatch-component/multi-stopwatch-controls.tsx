import Stopwatch from "../stopwatch";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import styles from "./multi-stopwatch-component.module.css";

const MultiStopwatchControls = (props: {
    onStartAll: () => void,
    disabled: boolean,
    onReset: () => void,
    onAddStopwatch: () => void,
    onRemoveStopwatch: () => void,
    stopwatches: Stopwatch[]
}) => {
    return <Row>
        <Col style={{maxWidth: "100px"}}>
            <Button variant={"success"} className={styles.startButton} onClick={props.onStartAll}
                    disabled={props.disabled}>Start All</Button>
        </Col>
        <Col>
            <Row>
                <Col>
                    <Button variant={"danger"} className={styles.resetButton} onClick={props.onReset}>Reset</Button>
                </Col>

            </Row>
            <Row>
                <Col>
                    <ButtonGroup>
                        <Button className={styles.addRemoveButton} onClick={props.onAddStopwatch}
                                disabled={props.disabled}>+</Button>
                        <Button className={styles.addRemoveButton} onClick={props.onRemoveStopwatch}
                                disabled={props.stopwatches.length == 0}>-</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Col>
    </Row>;
}

export default MultiStopwatchControls;