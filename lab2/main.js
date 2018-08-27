'use strict';

const l = console.log;

const MODES = [ 'HEX', 'ASCII', 'BITCOIN' ];
const hexLists = {};
let hexList; // selected hexlist
let inputStr = '0x';
let inputStrToEncode;
let mode = DEFAULT_MODE;


const hexListTableBody = document.querySelector('table').tBodies[0];
const hexListSelect = document.querySelector('select');

const inputElem = document.querySelector('fieldset input');
const msgOutput = document.querySelector('#msg');

const hexValuesOutput = document.querySelector('#hexValues');
const symbolsInTextOutput = document.querySelector('#symbolsInText');
const symbolsInHtmlOutput = document.querySelector('#symbolsInHtml');




// load hexlists from files
for (const hexListName of HEXLIST_NAMES) {
  const scriptElem = document.createElement('script');
  scriptElem.src = HEXLIST_DIRECTORY + '/' + hexListName + '.js';
  scriptElem.dataset.name = hexListName;
  document.head.append(scriptElem);
}




// check for values in URL
{
const url = new URL(location.href);
let urlMode = url.searchParams.get('mode');
if (urlMode !== null) {
  urlMode = urlMode.toUpperCase();
  if (MODES.includes(urlMode)) {
    mode = urlMode;
    selectMode();
  }
  else {
    mode = DEFAULT_MODE;
  }
}

const urlInput = url.searchParams.get('input');
if (urlInput !== null) {
  inputStr = urlInput;
  inputElem.value = inputStr;
}

l(urlMode, urlInput);
}




hexListSelect.addEventListener('change', function() {
  hexList = hexLists[this.value];
  showHexListInTable();

  document.querySelector('fieldset').disabled = false;
  inputElem.value = inputStr;
  inputElem.focus();
  encodeUserInput();
});




document.querySelector('fieldset div').addEventListener('input', processModeChange);

function processModeChange() {
  mode = document.querySelector('input[type=radio]:checked').dataset.mode;
  encodeUserInput();
}




inputElem.addEventListener('input', function() {
  inputStr = inputElem.value;

  // auto change to HEX mode
  if (inputStr.startsWith('0x')) {
    mode = 'HEX';
    selectMode();
  }

  encodeUserInput();
});




function encodeUserInput() {
  switch(mode) {
    case 'HEX':
      inputStrToEncode = inputStr.toLowerCase();

      // 0x is not mandatory
      if (inputStr.startsWith('0x')) {
        inputStrToEncode = inputStrToEncode.slice(2);
      }

      if (inputStrToEncode.length === 0) {
        showMsg('empty string');
        clearResults();
        return;
      }

      if (inputStrToEncode.length % 2 !== 0) {
        showMsg('string length must be even');
        clearResults();
        return;
      }

      if (/[^\dabcdef]+/i.test(inputStrToEncode)) {
        showMsg('not a hex symbol in string');
        clearResults();
        return;
      }
    break;

    
    case 'ASCII':
      if (inputStr.length === 0) {
        showMsg('empty string');
        clearResults();
        return;
      }

      inputStrToEncode = strToHexStr(inputStr);
    break;

    
    case 'BITCOIN':
      if (inputStr.length === 0) {
        showMsg('empty string');
        clearResults();
        return;
      }

      try {
        inputStrToEncode = window.encodeBitcoinAddress(inputStr);
      }
      catch(err) {
        showMsg(err.message.toLowerCase());
        clearResults();
        return;
      }
    break;
  }

  clearMsg();
  l('inputStrToEncode', inputStrToEncode);
  const { hexValues, symbolsInText, symbolsInHtml } = encodeHexString(inputStrToEncode);
  hexValuesOutput.value = hexValues.join(' ');
  symbolsInTextOutput.value = symbolsInText.join(',');
  symbolsInHtmlOutput.innerHTML = symbolsInHtml.join('');
}




// add hexlist to hexlist storage and to <select>
function addHexList(hexList) {
  const hexListName = document.currentScript.dataset.name;

  // convert hexlist numbers to lowercase
  const lowerCasedHexList = {};
  for (const num in hexList) {
    lowerCasedHexList[num.toLowerCase()] = hexList[num];
  }
  hexLists[hexListName] = lowerCasedHexList;

  const option = document.createElement('option');
  option.textContent = hexListName;
  hexListSelect.options.add(option);
  hexListSelect.selectedIndex = -1;
}




function showHexListInTable() {
  let rowElem;
  let symbol;
  for (let row = 0; row <= 15; ++row) {
    rowElem = hexListTableBody.rows[row + 1];
    for (let col = 0; col <= 15; ++col) {
      symbol = hexList[numToHex(row * 16 + col)];
      rowElem.cells[col + 1].innerHTML = (symbol === undefined) ? '' : getHtmlForSymbol(symbol);
    }
  }
  hexListTableBody.classList.remove('empty');
}




function clearResults() {
  hexValuesOutput.value = '';
  symbolsInTextOutput.value = '';
  symbolsInHtmlOutput.innerHTML = '';
}




function showMsg(msg) {
  msgOutput.value = msg;
}




function clearMsg() {
  msgOutput.value = '';
}




function selectMode() {
  document.querySelector(`input[data-mode=${mode}]`).checked = true;
}




// editing
hexListTableBody.addEventListener('click', function({ target: elem }) {
  // nothing to edit
  if (hexListTableBody.classList.contains('empty')) {
    return;
  }

  // headers are not editable
  if (elem.nodeName === 'TH') {
    return;
  }

  if (elem.nodeName === 'SPAN') {
    elem = elem.parentElement;
  }

  const cellHexNum = numToHex((elem.parentElement.rowIndex - 1) * 16 + (elem.cellIndex - 1));

  let symbolInText = prompt('Symbol data:', hexList[cellHexNum]);
  if (symbolInText === null || symbolInText.trim().length === 0) {
    return;
  }

  l(symbolInText);
  const symbol = symbolInText.split(',');
  l(symbol);
  if (symbol.length < 2) {
    alert('Char and color are required.');
    return;
  }

  if (symbol.length === 3 && symbol[2] === '') {
    symbol.splice(-1);
  }

  // todo more checks

  hexList[cellHexNum] = symbol;
  elem.innerHTML = getHtmlForSymbol(symbol);
  encodeUserInput();
});




// export
document.querySelector('#exportHexList').addEventListener('click', function() {
  const lines = [
    `// exported at ${new Date().toLocaleString()}`,
    "'use strict';",
    '',
    'addHexList({',
  ];
  let hexNum;
  let symbol;
  let stylesPart;

  for (let n = 0x00; n <= 0xff; ++n) {
    hexNum = numToHex(n);
    symbol = hexList[hexNum];
    if (symbol === undefined) {
      continue;
    }

    stylesPart = (symbol[2] === undefined) ? '' : `, '${symbol[2]}'`;
    lines.push(`  '${hexNum}': [ '${symbol[0]}', '${symbol[1]}'${stylesPart} ],`);
  }

  lines.push('});');

  // download file
  const a = document.createElement('a')
  a.download = hexListSelect.value + '-modified.js';
  a.href = URL.createObjectURL(new Blob([ lines.join('\n') ]));
  a.click();
  URL.revokeObjectURL(a.href);
});




// dev
Object.defineProperty(window, 's', {
  get : function() {
    console.group('curr state');
    l('hexLists', hexLists);
    l('hexList', hexList);
    l('inputStr', inputStr);
    l('inputStrToEncode', inputStrToEncode);
    l('mode', mode);
    console.groupEnd();
  },
});
