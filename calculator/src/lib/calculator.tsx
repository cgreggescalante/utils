import styles from './calculator.module.css';

/* eslint-disable-next-line */
export interface CalculatorProps {}

export function Calculator(props: CalculatorProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Calculator!</h1>
    </div>
  );
}

export default Calculator;
