interface FormattingProps {
  decimalDigits?: number // 0 - 3
}

const formatMilliseconds = (milliseconds: number, props?: FormattingProps) => {
  let decimalDigits = 3;

  if (props) {
    decimalDigits = props.decimalDigits ? props.decimalDigits : 3
  }


  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const ms = Math.floor(milliseconds % 1000 / Math.pow(10, 3 - decimalDigits)) * Math.pow(10, 3 - decimalDigits);

  let out = "";

  if (hours > 0) {
    out += hours + ":";
    out += minutes.toString().padStart(2, "0") + ":";
  } else if (minutes > 0) {
    out += minutes + ":";
  }

  out += hours > 0 || minutes > 0 ? seconds.toString().padStart(2, "0") : seconds

  out += "." + ms.toString().padStart(3, "0").slice(0, decimalDigits);

  return out;
}

const formatSeconds = (seconds: number) => formatMilliseconds(seconds * 1000);

export { formatMilliseconds, formatSeconds }