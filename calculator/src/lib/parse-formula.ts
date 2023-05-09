enum Operation {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Exponent = "^"
}

const Operators = {
    add: {
        symbol: "+",
        order: 0
    },
    subtract: {
        symbol: "-",
        order: 0
    },
    multiply: {
        symbol: "*",
        order: 1
    },
    divide: {
        symbol: "/",
        order: 1
    },
    exponent: {
        symbol: "^",
        order: 2
    }
}

const OperatorList = ["+", "-", "*", "/", "^"];

interface ParseTree {
    operation?: Operation,
    value: () => number,
    left?: ParseTree | number,
    right?: ParseTree | number
}

const findOperator = (formula: string) => {
    let depth = 0;
    let seenParenthesis = false;
    let middleSplit = false;
    let operators = [];

    for (let i = 0; i < formula.length; i++) {
        if (formula.charAt(i) == '(') {
            seenParenthesis = true;
            depth++;
        }
        else if (formula.charAt(i) == ')') {
            depth--;
        }
        else if (OperatorList.includes(formula.charAt(i))) {
            operators.push({
                operator: formula.charAt(i),
                index: i,
                depth: depth
            });
        }

        if (depth == 0 && seenParenthesis) {
            middleSplit = true;
        }
    }

    // Remove leading and trailing parenthesis if they are connected
    if (!middleSplit && formula.startsWith('(')) {
        formula = formula.substring(1, formula.length - 2);
        operators = operators.map(o => ({ operator: o.operator, index: o.index - 1, depth: depth - 1 }))
    }

    let operation = null;
    let index = -1;

    operators
        .filter(o => o.depth == 0)
        .forEach(o => {

        })
}

const parseFormula = (formula: string): ParseTree => {
    // Remove extra parenthesis



    let splitIndex = formula.indexOf(Operation.Add);
    let operation = Operation.Add;
    const subtractIndex = formula.indexOf(Operation.Subtract);

    if (splitIndex == -1 || subtractIndex > -1 && subtractIndex > splitIndex) {
        splitIndex = subtractIndex;
        operation = Operation.Subtract;
    }

    if (splitIndex == -1) {
        splitIndex = formula.indexOf(Operation.Multiply);
        operation = splitIndex > -1 ? Operation.Multiply : operation;

        const divideIndex = formula.indexOf(Operation.Divide);

        if (splitIndex == -1 || divideIndex > -1 && divideIndex > splitIndex) {
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

    console.log(formula, value());

    return {
        operation: operation,
        value: value,
        left: a,
        right: b
    }
}

export default parseFormula;