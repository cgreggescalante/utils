enum Operation {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Exponent = "^"
}

interface ParseTree {
    operation?: Operation,
    value: () => number,
    left?: ParseTree | number,
    right?: ParseTree | number
}

const parseFormula = (formula: string): ParseTree => {
    let splitIndex = formula.indexOf(Operation.Add);
    let operation = Operation.Add;
    const subtractIndex = formula.indexOf(Operation.Subtract);

    if (splitIndex == -1 || subtractIndex > -1 && subtractIndex < splitIndex) {
        splitIndex = subtractIndex;
        operation = Operation.Subtract;
    }

    if (splitIndex == -1) {
        splitIndex = formula.indexOf(Operation.Multiply);
        operation = splitIndex > -1 ? Operation.Multiply : operation;

        const divideIndex = formula.indexOf(Operation.Divide);

        if (splitIndex == -1 || divideIndex > -1 && divideIndex < splitIndex) {
            operation = Operation.Divide
            splitIndex = divideIndex;
        }
    }

    if (splitIndex == -1) {
        splitIndex = formula.indexOf(Operation.Exponent);
        operation = splitIndex > -1 ? Operation.Exponent : operation;
    }

    if (splitIndex == -1) {
        return { value: () => parseFloat(formula) }
    }

    const a = parseFormula(formula.substring(0, splitIndex));
    const b = parseFormula(formula.substring(splitIndex + 1));

    let value;

    switch (operation) {
        case Operation.Add:
            value = () => a.value() + b.value();
            break
        case Operation.Subtract:
            value = () => a.value() - b.value();
            break
        case Operation.Multiply:
            value = () => a.value() * b.value();
            break
        case Operation.Divide:
            value = () => a.value() / b.value();
            break
        case Operation.Exponent:
            value = () => Math.pow(a.value(), b.value());
    }

    return {
        operation: operation,
        value: value,
        left: a,
        right: b
    }
}

export default parseFormula;