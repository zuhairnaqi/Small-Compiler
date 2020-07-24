// Constants of Javascript
const keywordList = ['var', 'const', 'let', 'if', 'else', 'new', 'for', 'while', 'switch', 'case'];
const openingBrackets = ['(', '{' , '['];
const closingBrackets = [')', '}', ']'];
const doubleQuote = '"';
const singleQuote = "'";
const specialSymbols = ['=', ';'];
let code; // to record the keyword, symbol, identifiers etc.
let bp = null, fp = null;

function compileCode() {
    resetSettings();
    const text = document.getElementById('code-editor').value;
    const areBracketsComplete = checkBracketsCompletion(text);
    if (!areBracketsComplete) {
        alert('Compilation error bracket or string is not closed');
        return;
    }
    code = {
        keywords: [],
        values: [],
        symbols: [],
        identifiers: [],
    }
    for (let i = 0; i < text.length; i++) {
        let errorMessage;
        if (text[i] === ' '  && bp !== null && !isQuotes(text[bp])) {
            fp = i;
            let token = text.substring(bp, fp);
            errorMessage = checkToken(token);
        } else if (isBracket(text[i])) {
            if (bp !== null) {
                fp = i;
                let token = text.substring(bp, fp);
                errorMessage = checkToken(token);
            }
        } else if (specialSymbols.includes(text[i])) {
            if(bp !== null) {
                fp = i;
                let token = text.substring(bp, fp);
                errorMessage = checkToken(token);
            }
            bp = i;
            fp = i + 1;
            let token = text.substring(bp, fp);
            checkToken(token);
        } else if (bp === null && text[i] !== ' ' && text[i] !== '\n') {
            bp = i
        }
        if (errorMessage) {
            alert(errorMessage);
            break;
        }
    }
    const { keywords, values, symbols, identifiers } = code;
    let tableLength = Math.max(keywords.length, values.length, symbols.length, identifiers.length);
    document.getElementsByClassName('table')[0].style.display = 'block';
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    for (let i = 0; i < tableLength; i++) {
        tbody.innerHTML += `<tr>
            <th scope="row">${i + 1}</th>
            <td>${keywords[i] ? keywords[i] : ''}</td>
            <td>${values[i] ? values[i] : ''}</td>
            <td>${symbols[i] ? symbols[i] : ''}</td>
            <td>${identifiers[i] ? identifiers[i] : ''}</td>
          </tr>
        `;
    }
    console.log('code', code);
}

function checkToken(token) {
    console.log(`bp = ${bp}, fp = ${fp}`);
    console.log('token', token);
    if (keywordList.includes(token)) {
        code.keywords.push(token);
    } else if (specialSymbols.includes(token)) {
        code.symbols.push(token);
    } else if(token[0] === doubleQuote || token[0] === singleQuote){
        if(token[0] !== token[token.length - 1]) {
            return 'Error occur in closing quotes';
        }
        let newToken = token.slice(1, token.length - 1);
        code.values.push(newToken);
    } else {
        code.identifiers.push(token);
    }
    bp = null;
    fp = null;
}

// TO CHECK IF BRACKETS ARE NOT CLOSED
function checkBracketsCompletion(text) {
    let openBrackets = [];
    let closeBrackets = [];
    for(const letter of text) {
        if (openingBrackets.includes(letter)) {
            openBrackets.push(letter);
        } else if(closingBrackets.includes(letter)) {
            const closingBracketIndex = closingBrackets.indexOf(letter);
            const openBracket = openingBrackets[closingBracketIndex];
            if (openBrackets[openBrackets.length - 1] !== openBracket) {
                return false;
            }
            openBrackets.pop();
        }
    }
    if (openBrackets.length > 0) {
        return false;
    }
    return true;
}

// to Check text is inverted commas is or not
function isQuotes(text)  {
    return text === singleQuote || text === doubleQuote;
}

function isBracket(text)  {
    return openingBrackets.includes(text) || closingBrackets.includes(text);
}

function resetSettings() {
    code = null;
    bp = null;
    fb = null;
}
