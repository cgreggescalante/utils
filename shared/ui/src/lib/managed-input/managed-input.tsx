import styles from './managed-input.module.css';

/* eslint-disable-next-line */
export interface ManagedInputProps {
    label?: string,
    value: string | number | undefined,
    valueSetter: (v: any) => void
}

export function ManagedInput({label, value, valueSetter}: ManagedInputProps) {
  return label === undefined ?
      <input type="text" value={value} onChange={(e) => valueSetter(e.target.value)} />
        : <label>{ label }<input type="text" value={value} onChange={(e) => valueSetter(e.target.value)} /></label>
}

export default ManagedInput;
