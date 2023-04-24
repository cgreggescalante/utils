import styles from './multi-stopwatch.module.css';

/* eslint-disable-next-line */
export interface MultiStopwatchProps {}

export function MultiStopwatch(props: MultiStopwatchProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MultiStopwatch!</h1>
    </div>
  );
}

export default MultiStopwatch;
