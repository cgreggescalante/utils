import styles from './managed-input.module.css';

/* eslint-disable-next-line */
export interface ManagedInputProps {
    label: string | undefined,
    value: string | number,
    handleChange: (v: any) => void
}

export function ManagedInput({label, value, handleChange}: ManagedInputProps) {
  return label === undefined ?
      <input type="text" value={value} onChange={handleChange} />
        : <label>{ label }<input type="text" value={value} onChange={handleChange} /></label>
}

export default ManagedInput;
