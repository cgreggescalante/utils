import styles from './managed-input.module.css';

/* eslint-disable-next-line */
export interface ManagedInputProps {}

export function ManagedInput(props: ManagedInputProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ManagedInput!</h1>
    </div>
  );
}

export default ManagedInput;
