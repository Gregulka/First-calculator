const resultDisplay = document.querySelector('.result-display'),
    clearButton = document.querySelector('.clear-button'),
    buttons = document.querySelectorAll('.button-key'),
    resultButton = document.querySelector('.result-button'),
    plusMinusButton = document.querySelector('.plus-minus-button'),
    operationButtons = document.querySelectorAll('.operation-button'),
    percentButton = document.querySelector('.percent-button'),
    isNumberAllow = /[0-9]/,
    isSymbolAllow = /[\+\-\×\÷]/;
let expression = '';

clearButton.addEventListener('click', () => {
    resultDisplay.value = '';
    expression = '';
});

plusMinusButton.addEventListener('click', () => {
    changeSign();
});

percentButton.addEventListener('click', () => {
    const result = calculatePercent(resultDisplay.value);
    resultDisplay.value = result;
    expression = resultDisplay.value;
});

resultButton.addEventListener('click', () => {
    resultDisplay.value = calculate(expression);
    expression = resultDisplay.value;
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const displayValue = getDisplaySymbol(button.value);
        resultDisplay.value += displayValue;
        expression = resultDisplay.value;
    });
});

operationButtons.forEach(opButton => {
    opButton.addEventListener('click', () => {
        const displayValue = getDisplaySymbol(opButton.value);
        const currentValue = resultDisplay.value;

        if (currentValue === '') return;

        const lastChar = currentValue[currentValue.length - 1];

        if (isOperationSymbol(lastChar)) {
            resultDisplay.value = currentValue.slice(0, -1) + displayValue;
        } else {
            resultDisplay.value += displayValue;
        }
        expression = resultDisplay.value;
    });
});

document.addEventListener('keydown', e => {
    if (e.code.startsWith('F') && e.code.length <= 3) {
        e.preventDefault();
        return;
    }
    switch (e.key) {
        case 'Enter':
        case '=':
            e.preventDefault();
            resultDisplay.value = calculate(expression);
            expression = resultDisplay.value;
            break;

        case 'Delete':
            e.preventDefault();
            resultDisplay.value = '';
            expression = '';
            break;

        case 'Backspace':
            e.preventDefault();
            resultDisplay.value = resultDisplay.value.slice(0, -1);
            expression = resultDisplay.value;
            break;

        default:
            if (isSymbolAllow.test(e.key) || isNumberAllow.test(e.key) || e.key === '.' || e.key === '*' || e.key === '/') {
                e.preventDefault();

                const displaySymbol = getDisplaySymbol(e.key);
                const currentValue = resultDisplay.value;

                if (currentValue === '') {
                    if (isNumberAllow.test(e.key) || e.key === '.' || e.key === '-') {
                        resultDisplay.value += displaySymbol;
                        expression = resultDisplay.value;
                    }
                    return;
                }

                const lastChar = currentValue[currentValue.length - 1];

                if ((isSymbolAllow.test(e.key) || e.key === '*' || e.key === '/') && isOperationSymbol(lastChar)) {
                    resultDisplay.value = currentValue.slice(0, -1) + displaySymbol;
                } else {
                    resultDisplay.value += displaySymbol;
                }

                expression = resultDisplay.value;
            }
    }
});

function changeSign() {
    let currentValue = resultDisplay.value;

    if (!currentValue || currentValue === '0') return;

    if (currentValue.startsWith('-')) {
        resultDisplay.value = currentValue.substring(1);
    } else {
        resultDisplay.value = '-' + currentValue;
    }
    expression = resultDisplay.value;
}

function calculatePercent(value) {
    if (!value || value === '0') return;

    const tokens = value.match(isSymbolAllow) || [],
        lastToken = tokens[tokens.length - 1];
    console.log(tokens)

    let number = parseFloat(lastToken) / 100;
    tokens[tokens.length - 1] = number.toString();
    return tokens.join('');
}

function calculate(expr) {
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    const result = new Function('return ' + expr)();

    if (typeof result !== 'number' || !isFinite(result)) {
        return 'Ошибка';
    }
    return result.toString();
}

function getDisplaySymbol(symbol) {
    if (symbol === '*') return '×';
    if (symbol === '/') return '÷';
    return symbol;
}

function isOperationSymbol(symbol) {
    return isSymbolAllow.test(symbol);
}