import { backend } from 'declarations/backend';

let currentValue = '0';
let operator = null;
let waitingForSecondOperand = false;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const loadingIndicator = document.getElementById('loading');

buttons.forEach(button => {
    if (button !== equalsButton && button !== clearButton) {
        button.addEventListener('click', () => inputDigit(button.dataset.value));
    }
});

equalsButton.addEventListener('click', performCalculation);
clearButton.addEventListener('click', resetCalculator);

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentValue = digit;
        waitingForSecondOperand = false;
    } else {
        currentValue = currentValue === '0' ? digit : currentValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!currentValue.includes('.')) {
        currentValue += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (operator === null) {
        operator = nextOperator;
        waitingForSecondOperand = true;
        return;
    }

    performCalculation();
    operator = nextOperator;
    waitingForSecondOperand = true;
}

async function performCalculation() {
    const inputValue = parseFloat(currentValue);

    if (operator === null || waitingForSecondOperand) return;

    loadingIndicator.style.display = 'block';

    try {
        let result;
        switch (operator) {
            case '+':
                result = await backend.add(parseFloat(currentValue), inputValue);
                break;
            case '-':
                result = await backend.subtract(parseFloat(currentValue), inputValue);
                break;
            case '*':
                result = await backend.multiply(parseFloat(currentValue), inputValue);
                break;
            case '/':
                result = await backend.divide(parseFloat(currentValue), inputValue);
                break;
        }

        currentValue = result.toString();
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    } catch (error) {
        console.error('Calculation error:', error);
        currentValue = 'Error';
        updateDisplay();
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function resetCalculator() {
    currentValue = '0';
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentValue;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const { value } = button.dataset;
        if (value === '.') {
            inputDecimal();
        } else if ('+-*/'.includes(value)) {
            handleOperator(value);
        } else {
            inputDigit(value);
        }
    });
});
