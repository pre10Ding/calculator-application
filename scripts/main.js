const calculator = {
    num1: 0,
    num2: 0,
    ans: NaN,
    op: "",
    chain: 0, //if this isnt the first operation since refresh/AC
    equalsFlag: 0,

    allClear: function () {
        console.log('clearing');
        this.num1 = 0;
        this.num2 = 0;
        this.op = "";
        this.chain = 0;
        this.equalsFlag = 0;
        return 1;
    }

}

let defaultColor = 'white';

//wait for num input.
//display this

let numKeys = document.querySelectorAll('.num-keys');
let opKeys = document.querySelectorAll('.op-keys');

let operateKey = document.querySelector('.operate-key');
let acKey = document.querySelector('#all-clear');
let clearKey = document.querySelector('#clear');
let backspaceKey = document.querySelector('#backspace');
let answerKey = document.querySelector('.ans-key');
let decimalKey = document.querySelector('.dec-key');

numKeys.forEach(key => {
    key.addEventListener("click", handleNum)
});

opKeys.forEach(key => {
    key.addEventListener("click", handleOp)
});

operateKey.addEventListener("click", handleOperate)

acKey.addEventListener("click", function () {
    allClear();
    setDisplayText(calculator.num2);
});

acKey.addEventListener("click", function () {
    calculator.num2 = 0;
    setDisplayText(calculator.num2);
});

backspaceKey.addEventListener("click", handleBackspace);

answerKey.addEventListener("click", function () {
    //if there is an answer to draw from, change the cur num to it, else do nothing
    if (calculator.ans) {
        calculator.num2 = calculator.ans;
        setDisplayText(calculator.num2);
    }
});

decimalKey.addEventListener("click", handleDecimal);

/***************************** listener callbacks *****************************/

//when another number is entered, num = num*10+newNum.
function handleNum(e) {
    console.log(e);

    //handle user typing numbers in directly after using the = sign
    if (calculator.equalsFlag) {
        calculator.equalsFlag = 0;
        allClear();
    }

    let newNum = parseInt(e.target.getAttribute("data-key"));
    calculator.num2 = calculator.num2 * 10 + newNum;
    setDisplayText(calculator.num2);
}

//when operator pressed, put num2 into num1, reset num2; chain=1; op=input;
function handleOp(e) {
    console.log(e);

    //if an operator was pressed instead of =, do =, then do op
    if (calculator.chain) {
        handleOperate(); //do the operation
        handleOp(e); //add the op sign again
    }

    else {
        //normal case (shift num2 to num1)
        //if an operator was NOT pressed immediately after =
        if (!calculator.equalsFlag) {
            calculator.num1 = calculator.num2;
        }
        calculator.num2 = 0;
        calculator.equalsFlag = 0;
        calculator.chain = 1;
        calculator.op = e.target.getAttribute("data-key");

        setDisplayColor(calculator.op);
    }
}

function handleOperate() {
    if (calculator.op != "") {
        calculator.ans = operate(calculator.num1, calculator.num2, calculator.op);
        setDisplayText(calculator.ans);

        //setup for next round of calculations
        calculator.equalsFlag = 1;
        calculator.num1 = calculator.ans;
        calculator.chain = 0;

        setDisplayColor('=');
    }

}

function handleBackspace() {
    let numToArr = convertToArray(calculator.num2);
    numToArr.pop();
    calculator.num2 = parseFloat(numToArr.join(''));
    if (!calculator.num2) {
        console.log("NaN FOUND");
        calculator.num2 = 0;
    }

    setDisplayText(calculator.num2);
}

function handleDecimal() {
    let numToArr = convertToArray(calculator.num2);
    //if decimal already exist, do nothing
    if (numToArr.indexOf('.')===-1) {
        numToArr.push('.');
        calculator.num2 = parseFloat(numToArr.join(''));
        setDisplayText(calculator.num2+".");
    }
}


/************************************** UI ***************************************/
function setDisplayText(num) {
    let display = document.querySelector("#calculator-display");
    display.textContent = num;
}

function setDisplayColor(op) {
    let display = document.querySelector("#calculator-display");
    let color;
    switch (op) {
        case '+':
            color = 'green';
            break;

        case '-':
            color = 'yellow';
            break;

        case '*':
            color = 'blue';
            break;

        case '/':
            color = 'red';
            break;
        case '=':
            color = defaultColor;
            break;
        default:
            console.log(op);
            return '???';
            break;
    }
    display.style.backgroundColor = color;
}


/********************************** functional ********************************/
function convertToArray(num) {
    return ((num) + "").split('');
}

function allClear() {
    calculator.allClear();
    setDisplayColor('=');
}

function operate(a, b, op) {
    console.log(`${a} ${op} ${b} = `)
    let result;
    switch (op) {
        case '+':
            result = add(a, b);
            break;

        case '-':
            result = subtract(a, b);
            break;

        case '*':
            result = multiply(a, b);
            break;

        case '/':
            result = divide(a, b);
            break;
        default:
            console.log(op);
            return '???';
            break;
    }
    console.log(result);
    return result;
}


/********************************** arithmetic ********************************/
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}