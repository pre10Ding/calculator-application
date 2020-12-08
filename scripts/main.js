//calculator logic object
const calculator = {
    num1: [],
    num2: [],
    ans: NaN,
    op: "",
    chain: 0, //if this isnt the first operation since refresh/AC
    equalsFlag: 0,

    allClear: function () {
        console.log('clearing');
        this.num1 = [];
        this.num2 = [];
        this.op = "";
        this.chain = 0;
        this.equalsFlag = 0;
        return 1;
    }

}

//nixie tube variables
const nixieB = 'images/nixieBG.png';
const nixieBOpacity = 0.08;
const nixieL = 'images/nixieL.png';
const nixieR = 'images/nixieR.png';
const nixieLROpacity = 0.3;
const nixieOn = 'images/nixieOn.png';
const nixieOnOpacity = 0.5;
const nixieOff = 'images/nixieOff.png';
const nixieOffOpacity = 0.2;
const nixieLayerSaturation = 2;
const displaySize = 13;

const defaultColor = '#010010';


let numKeys = document.querySelectorAll('.num-keys');
let opKeys = document.querySelectorAll('.op-keys');

let operateKey = document.querySelector('.operate-key');
let acKey = document.querySelector('#all-clear');
let clearKey = document.querySelector('#clear');
let backspaceKey = document.querySelector('#backspace');
let answerKey = document.querySelector('.ans-key');

//initialize nixie display
let nixieDisplay = document.querySelector('#nixie-display');
makeNixieDisplay();

//initialize listeners
numKeys.forEach(key => {
    key.addEventListener("click", handleNum)
});

opKeys.forEach(key => {
    key.addEventListener("click", handleOp)
});

operateKey.addEventListener("click", handleOperate)

acKey.addEventListener("click", handleAC);

clearKey.addEventListener("click", handleC);

backspaceKey.addEventListener("click", handleBackspace);

answerKey.addEventListener("click", handleAns);








/***************************** listener callbacks *****************************/

//when another number is entered, num = num*10+newNum.
function handleNum(e) {

    //handle user typing numbers in directly after using the = sign
    if (calculator.equalsFlag) {
        calculator.equalsFlag = 0;
        allClear(); //erase all data
    }

    let newNum = e.target.getAttribute("data-key");

    //check if a decimal already exist in the array; if so, do nothing
    if (calculator.num2.length < 12 && (newNum != "." || calculator.num2.indexOf(".") == -1)) {
        calculator.num2.push(newNum);
        displayInNixie(calculator.num2);

        setDisplayText(calculator.num2);
    }
}

//when operator pressed, put num2 into num1, reset num2; chain=1; op=input;
function handleOp(e) {
    console.log(e);



    //if an operator was pressed instead of =
    if (calculator.chain) {
        //if the user spams op buttons, swap it to the latest one
        if (calculator.num2.length === 0) {
            calculator.op = e.target.getAttribute("data-key");

            //this will probably get repurposed into the nixie tube displays...
            setDisplayColor(calculator.op);

        }

        //if legit chain, do =, then do op
        else {
            handleOperate(); //do the operation
            handleOp(e); //add the op sign again
        }
    }

    else {
        //normal case (shift num2 to num1)
        //if an operator was NOT pressed immediately after =
        if (!calculator.equalsFlag) {
            //in case the user pressed an OP without inputting a number
            if (calculator.num2.length === 0) {
                calculator.num2.push(0);
            }
            //swap nums to store num2 as operand
            calculator.num1 = calculator.num2;
        }
        //clear num2 to reuse as input storage
        calculator.num2 = [];
        //reset equals flag since its not the last key pressed anymore
        calculator.equalsFlag = 0;
        //raises chain flag in case the user presses an op key again without pressing =
        calculator.chain = 1;
        //set op
        calculator.op = e.target.getAttribute("data-key");

        //this will probably get repurposed into the nixie tube displays...
        setDisplayColor(calculator.op);
    }

    //change the left most nixie to show op entered

}

function handleOperate() {
    if (calculator.op != "" && calculator.num2.length !== 0) {
        calculator.ans = operate(calculator.num1, calculator.num2, calculator.op);
        setDisplayText(calculator.ans);
        displayInNixie(calculator.ans);

        //setup for next round of calculations in case user presses an op right away 
        calculator.equalsFlag = 1;
        calculator.num1 = calculator.ans;

        //resets chain ops
        calculator.chain = 0;

        //this will probably get repurposed into the nixie tube displays...
        setDisplayColor('=');
    }

}

function handleAC() {
    allClear();
    setDisplayText(calculator.num2);
    displayInNixie(calculator.num2);
}

function handleC() {
    calculator.num2 = [];
    setDisplayText(calculator.num2);
    displayInNixie(calculator.num2);

}


function handleBackspace() {
    if (calculator.equalsFlag === 0) {
        calculator.num2.pop();
        displayInNixie(calculator.num2);

        setDisplayText(calculator.num2);
    }
}

function handleAns() {
    //if there is an answer to draw from, change the cur num to it, else do nothing
    if (calculator.ans) {
        calculator.num2 = calculator.ans;
        setDisplayText(calculator.num2);
        displayInNixie(calculator.num2);

    }
}



/************************************** UI ***************************************/
//this may get refactored into displayInNixie(num)
function setDisplayText(num) {
    let display = document.querySelector("#calculator-display");
    console.log(num);
    if (num.length < 1) {
        display.textContent = 0;
        return 0;
    }
    display.textContent = num.join('');
    return 1;
}

//this may get refactored into just displayOps(op)
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

    displayOp(op);

}


/********************************** functional ********************************/
function convertToArray(num) {
    return ((num) + "").split('');
}

function allClear() {
    calculator.allClear();
    setDisplayColor('=');
}

function operate(num1, num2, op) {
    let a = parseFloat(num1.join(''));
    let b = parseFloat(num2.join(''));

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
    let resultArray = convertToArray(result);
    console.log(resultArray);
    if (resultArray.length > 12) {
        //if scientific notation in result, round to displaySize - 6 (since 1 is reserved for op)
        if (resultArray.indexOf('e' != -1)) {
            result = result.toPrecision(displaySize - 7);
            console.log(displaySize - 5);
        }
        //if no decimal in result, round to displaySize - 1 (since 1 is reserved for op)
        else if (resultArray.indexOf('.') == -1) {
            result = result.toPrecision(displaySize - 2);
            console.log(displaySize);

        }
        //if decimal in result, round to displaySize - 2 (since 1 is reserved for op)
        else {
            result = result.toPrecision(displaySize - 3);
            console.log(displaySize - 1);
        }
        console.log(result);
    }

    //if decimal in result, round to displaySize -1 
    return convertToArray(result);
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

/********************************** Nixie Tube *******************************/


function makeNixieOff(ele) {
    makeNixieLayer(ele, nixieB, nixieBOpacity);
    makeNixieLayer(ele, nixieOff, nixieOffOpacity);
}

function makeNixieOffR(ele) {
    makeNixieLayer(ele, nixieB, nixieBOpacity);
    makeNixieLayer(ele, nixieR, nixieLROpacity);
    makeNixieLayer(ele, nixieOff, nixieOffOpacity);
}

function makeNixieOffL(ele) {
    makeNixieLayer(ele, nixieB, nixieBOpacity);
    makeNixieLayer(ele, nixieL, nixieLROpacity);
    makeNixieLayer(ele, nixieOff, nixieOffOpacity);
}

function makeNixieOn(ele) {
    makeNixieLayer(ele, nixieB, nixieBOpacity);
    makeNixieLayer(ele, nixieL, nixieLROpacity);
    makeNixieLayer(ele, nixieR, nixieLROpacity);
    makeNixieLayer(ele, nixieOn, nixieOnOpacity);
}



function makeNixieLayer(ele, path, opacity) {
    let img1 = document.createElement("img");
    img1.setAttribute("src", path);
    img1.style.width = "100px";
    img1.style.position = 'absolute';
    img1.style.opacity = opacity; // ~GIMP value * 10 to 15
    img1.style.filter = `saturate(${nixieLayerSaturation})`; //2 seems about right
    ele.appendChild(img1);
}


function makeNixieDisplay() {


    for (let i = 0; i < displaySize; i++) {

        //make the nixie tube back drop
        let nixieDiv = document.createElement('div');
        nixieDiv.setAttribute("class", "nixie-tube");
        makeNixieOff(nixieDiv);

        //make a span to put the number in
        let nixieText = document.createElement('span');
        nixieText.setAttribute("class", "nixie-tube-num");
        nixieDiv.appendChild(nixieText);

        nixieDisplay.appendChild(nixieDiv);
    }
}

function eraseNixieDisplay() {
    nixieDisplay.querySelectorAll('*').forEach(n => n.remove());
}

//get these nixie-tube divs into an array
//somehow append numbers from the last digit to the last div until there is no more

function displayOp(op) {
    let nixieTubeNums = [...document.querySelectorAll(".nixie-tube-num")];

    switch (op) {
        case '*':
            op = 'x';
            break;

        case '/':
            op = '÷'
            break;
        default:
            break;
    }
    nixieTubeNums[0].textContent = op; //update the op symbol

    //if use is spamming ops, just update the nixie bg once
    if (!calculator.chain) {
        //test if num2 has max digits, if not turn on the 2nd nixie as well
        if (calculator.num2.length < displaySize-1) {
            let nixieParent = nixieTubeNums[1].parentNode;

            nixieParent.removeChild(nixieParent.childNodes[0]);
            nixieParent.removeChild(nixieParent.childNodes[0]);

            makeNixieOffL(nixieParent);
        }

        let nixieParent = nixieTubeNums[0].parentNode;

        nixieParent.removeChild(nixieParent.childNodes[0]);
        nixieParent.removeChild(nixieParent.childNodes[0]);

        makeNixieOn(nixieParent);
    }
}

function displayInNixie(numArray) {

    //erase all bg to nixieOff
    eraseNixieDisplay();
    makeNixieDisplay();

    let nixieTubeNums = [...document.querySelectorAll(".nixie-tube-num")];
    //reverse the list of elements so we can append from the tail end
    nixieTubeNums.reverse();
    let reversedNum = Array.from(numArray);
    reversedNum.reverse();

    let i = 0;
    for (i; i < reversedNum.length; i++) {
        nixieTubeNums[i].textContent = reversedNum[i];
        console.log(reversedNum[i]);
        //turn on all bg to nixieOn
        let nixieParent = nixieTubeNums[i].parentNode;

        nixieParent.removeChild(nixieParent.childNodes[0]);
        nixieParent.removeChild(nixieParent.childNodes[0]);

        makeNixieOn(nixieParent);

    }


    //turn the nixie left of the biggest digit to nixieOffR
    //create this reflection effect
    if (i !== 0 && i < displaySize) {
        let nixieParent = nixieTubeNums[i].parentNode;

        nixieParent.removeChild(nixieParent.childNodes[0]);
        nixieParent.removeChild(nixieParent.childNodes[0]);

        makeNixieOffR(nixieParent);
    }


}