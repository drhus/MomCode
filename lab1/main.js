'use strict';

const l = console.log;
//const bs58check = require('bs58check')


const hexLists = {};
let hexList; // selected hexlist
let inputStr = '0x';
let inputStrToEncode;
//let editingCell = null;
//let isCellEdited;
//let isChangeEventFired;
let mode = 'HEX';


const hexListTable = document.querySelector('table').tBodies[0];
const hexListSelect = document.querySelector('select');

const inputElem = document.querySelector('input');
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

/*
{
// generate styles for auto colors
const styles = [];
for (const color of AUTO_COLORS) {
  styles.push(`
    .${color} {
      color: ${color};
    }
  `);
}
const styleElem = document.createElement('style');
styleElem.textContent = styles.join('');
document.head.append(styleElem);
}
*/


hexListSelect.addEventListener('change', function() {
  hexList = hexLists[this.value];
  showHexListInTable();

  document.querySelector('fieldset').disabled = false;
  inputElem.value = inputStr;
  inputElem.focus();
//  processModeChange();
  processInputStringChange();
});




document.querySelector('fieldset div').addEventListener('input', processModeChange);

function processModeChange() {
  mode = document.querySelector('input[type=radio]:checked').dataset.mode;
  processInputStringChange();
}




inputElem.addEventListener('input', function() {
  inputStr = inputElem.value;

  // auto change to HEX mode
  if (inputStr.startsWith('0x')) {
    mode = 'HEX';
    document.querySelector('input[data-mode=HEX]').checked = true;
  }

  processInputStringChange();
});


// todo move all possible future autositching logic to function above and rename this to something like encodeUserInput()
function processInputStringChange() {
  switch(mode) {
    case 'HEX':
    /*
      if (!inputStr.startsWith('0x')) {
        showMsg('string must start from 0x');
        clearOutputs();
        return;
      }
    */
      inputStrToEncode = inputStr.toLowerCase();

      // 0x is not mandatory
      if (inputStr.startsWith('0x')) {
        inputStrToEncode = inputStrToEncode.slice(2);
      }

      if (inputStrToEncode.length === 0) {
        showMsg('empty string');
        clearOutputs();
        return;
      }

      if (inputStrToEncode.length % 2 !== 0) {
        showMsg('string length must be even');
        clearOutputs();
        return;
      }

      if (/[^\dabcdef]+/i.test(inputStrToEncode)) {
        showMsg('not a hex symbol in string');
        clearOutputs();
        return;
      }
    break;

    
    case 'ASCII':
      if (inputStr.length === 0) {
        showMsg('empty string');
        clearOutputs();
        return;
      }

      inputStrToEncode = strToHexStr(inputStr);
    break;

    
    case 'BITCOIN':
      if (inputStr.length === 0) {
        showMsg('empty string');
        clearOutputs();
        return;
      }

//      n();
      try {
        inputStrToEncode = encodeBitcoinAddress(inputStr);
      }
      catch(err) {
        showMsg(err.message.toLowerCase());
        clearOutputs();
        return;
      }

//      l(inputStrToEncode);
//      inputStrToEncode = inputStrToEncode.toString('hex');
//      console.log(inputStrToEncode);

//      inputStrToEncode = inputStrToEncode.slice(2, -8);
//      l('_' + inputStrToEncode + '_');
    break;
  }

//  showMsg(inputStrToEncode);
  clearMsg();

  l('inputStrToEncode', inputStrToEncode);
  const { hexValues, symbolsInText, symbolsInHtml } = encodeHexString(inputStrToEncode);
  hexValuesOutput.value = hexValues.join(' ');
  symbolsInTextOutput.value = symbolsInText.join(',');
  symbolsInHtmlOutput.innerHTML = symbolsInHtml.join('');
}




// function is global, else hexlist scripts can't find it after browserify
// add hexlist to hexlist storage and to <select>
//window.addHexList = function(hexList) {
function addHexList(hexList) {
  const hexListName = document.currentScript.dataset.name;

  // convert hexlist numbers to lowercase
  const lowerCasedHexList = {};
  for (const num in hexList) {
    lowerCasedHexList[num.toLowerCase()] = hexList[num];
  }

  hexLists[hexListName] = lowerCasedHexList;
//  l(hexList)
//  l(JSON.parse(JSON.stringify(hexList).toLowerCase()))


  const option = document.createElement('option');
  option.textContent = hexListName;
  hexListSelect.options.add(option);
  hexListSelect.selectedIndex = -1;
}





function showHexListInTable() {
  const htmls = [];

  let hexNum;
  let symbol;
//  let styles;
  for (let n = 0x00; n <= 0xff; ++n) {

    hexNum = numToHex(n);//n.toString(16).padStart(2, '0');
    symbol = hexList[hexNum];

    // todo
    if (symbol === undefined) {
      htmls.push(`
        <tr class="empty" data-num="${hexNum}">
          <td></td>
          <td>
            ${hexNum}
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `);
    }
    else {
//      styles = currSymbol[2] || '';
  //    if (currChar.length === 3) {
  //      styles = currChar
  //    }
      htmls.push(`
        <tr data-num="${hexNum}">
          <td>
            ${getHtmlForSymbol(symbol)}
          </td>
          <td>
            ${hexNum}
          </td>
          <td>
            ${symbol[0]}
          </td>
          <td>
            ${symbol[1]}
          </td>
          <td>
            ${symbol[2] || ''}
          </td>
        </tr>
      `);



    }


  }

  hexListTable.innerHTML = htmls.join('');
}







function clearOutputs() {
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
//    l('editingCell', editingCell);
//    l('isCellEdited', isCellEdited);
    console.groupEnd();
  },
});
