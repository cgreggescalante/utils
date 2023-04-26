import styles from './pace-calculator.module.css';

/* eslint-disable-next-line */
export interface PaceCalculatorProps {}

export function PaceCalculator(props: PaceCalculatorProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PaceCalculator!</h1>
    </div>
  );
}

export default PaceCalculator;
