'use strict';

const l = console.log;

const MODES = ['HEX', 'ASCII', 'BITCOIN'];
const hexLists = {};
let hexList; // selected hexlist
let inputStr = '0x';
let inputStrToEncode;
let mode = APP_DEFAULT_MODE;


const hexListTableBody = document.querySelector('table').tBodies[0];
const hexListSelect = document.querySelector('.dictionary-list-selector');

//const fontFamilySelect = document.querySelector('.font-family-selector');
const fontSizeSlider = document.querySelector('#fontSizeSlider'); // #fontSizeSlider change to jquer https://jsfiddle.net/drhus/9j4crfew/
const fontSizeDisplayOutput = document.querySelector('#fontSizeDisplay');

const inputElem = document.querySelector('#inputText');
const msgOutput = document.querySelector('#msg');

const hexValuesOutput = document.querySelector('#hexValues');
const symbolsInTextOutput = document.querySelector('#symbolsInText');
const symbolsInHtmlOutput = document.querySelector('#symbolsInHtml');


const momCodeSqare = document.querySelector('.momcode-square-separate');
const momCodeSqare2 = document.querySelector('.momcode-square-separate2');
const momCodeSqare3 = document.querySelector('.momcode-square-separate3');
const momCodeSqare4 = document.querySelector('.momcode-square-separate4');
const momCodeSqare5 = document.querySelector('.momcode-square-separate5');
const momCodeSqare6 = document.querySelector('.momcode-square-separate6');
const momCodeSqare7 = document.querySelector('.momcode-square-separate7');
const momCodeSqare8 = document.querySelector('.momcode-square-separate8');
const momCodeSqare9 = document.querySelector('.momcode-square-separate9');

const momCodeCircle = document.querySelector('.momcode-circle-separate');
const momCodeCircle2 = document.querySelector('.momcode-circle-separate2');
const momCodeCircle3 = document.querySelector('.momcode-circle-separate3');
const momCodeCircle4 = document.querySelector('.momcode-circle-separate4');
const momCodeCircle5 = document.querySelector('.momcode-circle-separate5');
const momCodeCircle6 = document.querySelector('.momcode-circle-separate6');
const momCodeCircle7 = document.querySelector('.momcode-circle-separate7');
const momCodeCircle8 = document.querySelector('.momcode-circle-separate8');
const momCodeCircle9 = document.querySelector('.momcode-circle-separate9');

const momCodeSqareInjected = document.querySelector('.momcode-square-injected');
const qrMomCodeBorders = document.querySelectorAll('.momcode-border');

// load hexlists from files
for (const hexListName of HEXLIST_NAMES) {
  const scriptElem = document.createElement('script');
  scriptElem.src = HEXLIST_DIRECTORY + '/' + hexListName + '.js';
  scriptElem.dataset.name = hexListName;
  document.head.append(scriptElem);
}




// get values from URL
{
  const url = new URL(location.href);
  let urlMode = url.searchParams.get('mode');
  if (urlMode !== null) {
    l(urlMode);
    urlMode = urlMode.toUpperCase();
    if (MODES.includes(urlMode)) {
      mode = urlMode;
      selectMode();
    } else {
      mode = APP_DEFAULT_MODE;
    }
  }

  const urlInput = url.searchParams.get('input');
  if (urlInput !== null) {
    l(urlInput);
    inputStr = urlInput;
    inputElem.value = inputStr;
  }

  const urlList = url.searchParams.get('list');
  if (urlList !== null) {
    l(urlList);
    forceSetList(urlList);
  } else {
    forceSetList(APP_DEFAULT_LIST);
  }

  let urlHexList = url.searchParams.get('hexListV2');
  if (urlHexList !== null) {
    l(urlHexList, urlHexList.length);

    urlHexList = Base64.decode(urlHexList);
    l(urlHexList);
    l(urlHexList.length);

    const decompressedBytes = Int8Array.from(urlHexList, c => c.charCodeAt());
    l(decompressedBytes);
    l(decompressedBytes.length);

    LZMA.decompress(decompressedBytes, function (decompressedString, error) {
      l('LZMA.decompress()', decompressedString, error);

      const urlSymbols = decompressedString.split(HEXLIST_URL_SYMBOL_DELIMITER);
      l(urlSymbols, urlSymbols.length);

      const hexListFromUrl = {
        data: {},
      };
      //  for (let n = 0x00; n <= 0xff; ++n) {
      //    hexListFromUrl[numToHex(n)] = urlSymbolToObjSymbol(urlSymbol[n]);
      //  }
      const additionalProps = urlSymbols.splice(-4);
      l(additionalProps);
      urlSymbols.forEach((urlSymbol, i) =>
        hexListFromUrl.data[numToHex(i)] = urlSymbolToObjSymbol(urlSymbol));
      l(hexListFromUrl);

      // parse additional props
      for (const [index, propName] of HEXLIST_ADDITIONAL_PROPS.entries()) {
        hexListFromUrl[propName] = additionalProps[index];
      };
      addHexList(hexListFromUrl, additionalProps.name === undefined ? 'from URL' : `${additionalProps.name} (from URL)`);

      // select this hexlist
      hexListSelect.selectedIndex = hexListSelect.length - 1;
      processHexListChange();
    });
  }

}

function forceSetList(listName, delay = 1000) {
  setTimeout(() => {
    if (hexListSelect.value === "from URL") {
      return false;
    }
    let optIdx = 0;
    const reg = /[-_ \+\(\)]/g;
    [...hexListSelect].find((el, i) => {
      optIdx = i;
      return el.value.replace(reg, "_").toLowerCase() === listName.toLowerCase().replace(reg, "_")
    });
    hexListSelect.selectedIndex = optIdx;
    processHexListChange(hexListSelect[optIdx].value);
  }, delay);
}

//forceSetList(APP_DEFAULT_LIST, 1000);
hexListSelect.addEventListener('change', () => processHexListChange());

function processHexListChange(forceSet) {
  hexList = hexLists[forceSet || hexListSelect.value];
  showHexList();
  buildKeyboard();

  document.querySelectorAll('fieldset').forEach(fs => fs.disabled = false);

  // inputElem.value = inputStr;
  inputElem.focus();
  encodeUserInput();
}

function setFontFamiliesToSelector(arrayOfFonts, selectorEl) {
  selectorEl.innerHTML = null;
  selectorEl.onclick = (event) => {
    console.log("New font-family selected ", event.target.value);
    /**
     * here do something with fonts
     * at the moment decided to not implement anithing here,
     * because using in one time Font Awesome for icons and this feature
     * for selecting custom fonts haven't any sense
     */
  }
  arrayOfFonts.forEach(fontName => {
    const optionEl = document.createElement("option");
    optionEl.value = fontName;
    optionEl.innerHTML = fontName;
    selectorEl.append(optionEl);
  })
}


/*
setFontFamiliesToSelector(FONT_FAMILY_LIST, fontFamilySelect);
*/
/*
fontSizeSlider.onchange = event => {
  symbolsInHtmlOutput.style.fontSize = `${event.target.value || 20}px`;
  momCodeSqare.style.fontSize = `${event.target.value*2.618 || 20}px`;
  momCodeSqare2.style.fontSize = `${event.target.value*1.618 || 20}px`;
  momCodeSqare3.style.fontSize = `${event.target.value || 20}px`;
  momCodeSqare4.style.fontSize = `${event.target.value || 20}px`;
  momCodeSqare5.style.fontSize = `${event.target.value || 20}px`;
  momCodeSqare6.style.fontSize = `${event.target.value || 20}px`;

  momCodeCircle.style.fontSize = `${event.target.value*2.618 || 20}px`;
  momCodeCircle2.style.fontSize = `${event.target.value*1.618 || 20}px`;
  momCodeCircle3.style.fontSize = `${event.target.value || 20}px`;
  momCodeCircle4.style.fontSize = `${event.target.value || 20}px`;
  momCodeCircle5.style.fontSize = `${event.target.value || 20}px`;
  momCodeCircle6.style.fontSize = `${event.target.value || 20}px`;

  momCodeSqareInjected.style.fontSize = `${event.target.value*0.618 || 20}px`;
  fontSizeDisplayOutput.innerHTML = `${event.target.value || 20}px`;
}
*/

// General Display Changer
// .momCodeOut :for all momcode output in html

function dynamicDisplayChange(elem, target, id) {
  switch (target){
      case 'widthHeight':
      //  $(id).css('width', elem.value + 'px').css('height', elem.value + 'px');
        $('.momcode-square-separate').css('width', elem.value + 'px').css('height', elem.value + 'px');
        $('.momcode-square-separate2').css('width', elem.value*2 + 'px').css('height', elem.value*2 + 'px');
        $('.momcode-square-separate3').css('width', elem.value*4 + 'px').css('height', elem.value*4 + 'px');
        $('.momcode-square-separate4').css('width', elem.value + 'px').css('height', elem.value + 'px');
        $('.momcode-square-separate5').css('width', elem.value*2 + 'px').css('height', elem.value*2 + 'px');
        $('.momcode-square-separate6').css('width', elem.value*4 + 'px').css('height', elem.value*4 + 'px');
        $('.momcode-circle-separate').css('width', elem.value + 'px').css('height', elem.value + 'px');
        $('.momcode-circle-separate2').css('width', elem.value*2 + 'px').css('height', elem.value*2 + 'px');
        $('.momcode-circle-separate3').css('width', elem.value*4 + 'px').css('height', elem.value*4 + 'px');
        $('.momcode-circle-separate4').css('width', elem.value + 'px').css('height', elem.value + 'px');
        $('.momcode-circle-separate5').css('width', elem.value*2 + 'px').css('height', elem.value*2 + 'px');
        $('.momcode-circle-separate6').css('width', elem.value*4 + 'px').css('height', elem.value*4 + 'px');
        imageSizeDisplay.innerHTML = (elem.value + 'px');
        break;

      case 'fontSize':
        $(id).css('font-size', elem.value + 'px'); // .identiconOut .momCodeOut
        $('.momcode-square-separate').css('font-size', elem.value*1 + 'px');
        $('.momcode-square-separate2').css('font-size', elem.value*1.5 + 'px');
        $('.momcode-square-separate3').css('font-size', elem.value*2.5 + 'px');
        $('.momcode-square-separate4').css('font-size', elem.value*1.5 + 'px');
        $('.momcode-square-separate5').css('font-size', elem.value*2.2 + 'px');
        $('.momcode-square-separate6').css('font-size', elem.value*4.2 + 'px');
        $('.momcode-circle-separate').css('font-size', elem.value + 'px');
        $('.momcode-circle-separate2').css('font-size', elem.value*1.5 + 'px');
        $('.momcode-circle-separate3').css('font-size', elem.value*2.5 + 'px');
        $('.momcode-circle-separate4').css('font-size', elem.value*1.5 + 'px');
        $('.momcode-circle-separate5').css('font-size', elem.value*2.2 + 'px');
        $('.momcode-circle-separate6').css('font-size', elem.value*4.2 + 'px');
        $('.version-b').css('font-size', elem.value + 'px');
        fontSizeDisplay.innerHTML = (elem.value + 'px');
        break;
    }
}


if (navigator.userAgent.includes('Edge')) {
  document.querySelectorAll('#mode input').forEach(inp => inp.addEventListener('change', processModeChange));

  // Edge does not select default mode after page refresh
  selectMode();
} else {
  // Edge can't do this
  document.querySelector('#mode').addEventListener('input', processModeChange);
}

function processModeChange(event) {
  mode = event.target.dataset.mode;
  encodeUserInput();
}




inputElem.addEventListener('input', function () {
  inputStr = inputElem.value;

  // auto change to HEX mode
  if (inputStr.startsWith('0x')) {
    mode = 'HEX';
    selectMode();
  }

  encodeUserInput();
});




function encodeUserInput() {
  switch (mode) {
    case 'HEX':
      inputStrToEncode = inputStr.toLowerCase();

      // 0x is not mandatory
      if (inputStr.startsWith('0x')) {
        inputStrToEncode = inputStrToEncode.slice(2);
      }

      if (inputStrToEncode.length === 0) {
        showMsg('empty string! please input an identifier (Ethereum wallet address, hash or Hex string)');
        clearResults();
        return;
      }

      if (inputStrToEncode.length % 2 !== 0) {
        showMsg('hexadecimal string length must be even');
        clearResults();
        return;
      }

      if (/[^\dabcdef]+/i.test(inputStrToEncode)) {
        showMsg('not a valid hexadecimal digit(s), try with ASCII mode');
        clearResults();
        return;
      }
      break;


    case 'ASCII':
      if (inputStr.length === 0) {
        showMsg('empty string! please input an identifier (username, ticket record locator or text');
        clearResults();
        return;
      }

      inputStrToEncode = strToHexStr(inputStr);
      break;


    case 'BITCOIN':
      if (inputStr.length === 0) {
        showMsg('empty string! please input a Bitcoin wallet address');
        clearResults();
        return;
      }

      try {
        inputStrToEncode = window.encodeBitcoinAddress(inputStr);
      } catch (err) {
        showMsg(err.message.toLowerCase());
        clearResults();
        return;
      }
      break;
  }

  clearMsg();
  l('inputStrToEncode', inputStrToEncode);
  const {
    hexValues,
    symbolsInText,
    symbolsInHtml
  } = encodeHexString(inputStrToEncode);
  hexValuesOutput.value = hexValues.join(' ');
  symbolsInTextOutput.value = symbolsInText.join(',');
  symbolsInHtmlOutput.innerHTML = symbolsInHtml.join('');
  momCodeSqare.innerHTML = symbolsInHtml.join('');
  momCodeSqare2.innerHTML = symbolsInHtml.join('');
  momCodeSqare3.innerHTML = symbolsInHtml.join('');
  momCodeSqare4.innerHTML = symbolsInHtml.join('');
  momCodeSqare5.innerHTML = symbolsInHtml.join('');
  momCodeSqare6.innerHTML = symbolsInHtml.join('');
  momCodeSqare7.innerHTML = symbolsInHtml.join('');
  momCodeSqare8.innerHTML = symbolsInHtml.join('');
  momCodeSqare9.innerHTML = symbolsInHtml.join('');
  momCodeCircle.innerHTML = symbolsInHtml.join('');
  momCodeCircle2.innerHTML = symbolsInHtml.join('');
  momCodeCircle3.innerHTML = symbolsInHtml.join('');
  momCodeCircle4.innerHTML = symbolsInHtml.join('');
  momCodeCircle5.innerHTML = symbolsInHtml.join('');
  momCodeCircle6.innerHTML = symbolsInHtml.join('');
  momCodeCircle7.innerHTML = symbolsInHtml.join('');
  momCodeCircle8.innerHTML = symbolsInHtml.join('');
  momCodeCircle9.innerHTML = symbolsInHtml.join('');
  momCodeSqareInjected.innerHTML = symbolsInHtml.join('');

  setQrBordersWithMomCode(symbolsInHtml, 3);
  qrs.forEach(qr => qr.makeCode(inputStr));
}

function setQrBordersWithMomCode(symbols, ipb = 3) {
  symbols = symbols || encodeHexString(inputStr.toLowerCase()).symbolsInHtml;
  const elArr = [...qrMomCodeBorders];
  elArr[0].innerHTML = symbols.slice(0, ipb).join("");
  elArr[1].innerHTML = symbols.slice(ipb, ipb * 2).join("");
  elArr[2].innerHTML = symbols.slice(ipb * 2, ipb * 3).join("");
  elArr[3].innerHTML = symbols.slice(ipb * 3, ipb * 4).join("");
}


// add hexlist from array to hexlist storage and to <select>
function addArrayHexList(arrayHexList) {
  //  const hexListName = document.currentScript.dataset.name;

  // convert hexlist to more usable form
  const objHexList = {
    data: {},
  };
  for (const propName of HEXLIST_ADDITIONAL_PROPS) {
    //    const propVal = arrayHexList[propName];
    //    if (propVal !== undefined) {
    objHexList[propName] = arrayHexList[propName] || ''; //propVal;
    //    }
  };
  //  let arraySymbol;
  //  let tmp;
  for (const hexNum in arrayHexList.data) {
    //    arraySymbol = hexList[num];

    //    const objSymbol = arraySymbolToObjSymbol(arraySymbol);
    /*
        const objSymbol = {
          char: symbol[0],
        }

        tmp = symbol[1];
        if (!(tmp === '' || tmp === undefined)) {
          objSymbol.color = tmp;
        }

        tmp = symbol[2];
        if (!(tmp === '' || tmp === undefined)) {
          objSymbol.styles = tmp.split(SYMBOL_STYLE_DELIMITER);
        }*/

    // remove empty color and styles
    //    symbol = symbol.map(el => el === '' ? undefined : el);

    objHexList.data[hexNum.toLowerCase()] = arraySymbolToObjSymbol(arrayHexList.data[hexNum]);
  }

  addHexList(objHexList, document.currentScript.dataset.name);

  /*
    hexLists[hexListName] = normalizedHexList;

    const option = document.createElement('option');
    option.textContent = hexListName;
    hexListSelect.options.add(option);
    hexListSelect.selectedIndex = -1;
  */
}




function addHexList(hexList, hexListName) {
  hexLists[hexListName] = hexList;

  const option = document.createElement('option');
  option.textContent = hexListName;
  // adding changes selectedIndex, so we store it before adding
  const selInd = hexListSelect.selectedIndex;
  hexListSelect.options.add(option);
  if (selInd === -1) {
    // if nothing was selected before adding, nothing should be selected after adding
    hexListSelect.selectedIndex = selInd;
  }
}




function showHexList() {
  let rowElem;
  let symbol;
  const hexListData = hexList.data;
  for (let row = 0; row <= 15; ++row) {
    rowElem = hexListTableBody.rows[row + 1];
    for (let col = 0; col <= 15; ++col) {
      symbol = hexListData[numToHex(row * 16 + col)];
      rowElem.cells[col + 1].innerHTML = symbol === undefined ? '' : symbolToHtml(symbol);
    }
  }
  hexListTableBody.classList.remove('empty');

  // show additional props
  for (const propName of HEXLIST_ADDITIONAL_PROPS) {
    document.querySelector(`${propName != 'comment' ? 'input' : 'textarea'}[data-prop-name=${propName}]`).value = hexList[propName] || '';
  };
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
hexListTableBody.addEventListener('click', function ({
  target: elem
}) {
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

  const oldSymbol = hexList.data[cellHexNum] || {};
  l(oldSymbol);
  const symbolInString = prompt('Symbol data:', symbolToString(oldSymbol));
  if (symbolInString === null || symbolInString.trim().length === 0) {
    return;
  }

  l(symbolInString);
  const arraySymbol = symbolInString.split(',');
  l(arraySymbol);
  const newSymbol = arraySymbolToObjSymbol(arraySymbol);
  l(newSymbol);

  if (newSymbol.char === '') {
    alert('Char is required!');
    return;
  }

  //  if (symbol.length === 3 && symbol[2] === '') {
  //    symbol.splice(-1);
  //  }

  hexList.data[cellHexNum] = newSymbol;
  elem.innerHTML = symbolToHtml(newSymbol);
  encodeUserInput();
});




// export hexlist
document.querySelector('#exportHexList').addEventListener('click', function () {
  const lines = [
    `// exported at ${new Date().toLocaleString()}`,
    "'use strict';",
    '',
    'addArrayHexList({',
  ];

  for (const propName of HEXLIST_ADDITIONAL_PROPS) {
    if (hexList[propName] !== '') {
      lines.push(`  ${propName}: '${hexList[propName]}',`);
    }
  };

  lines.push('  data: {');

  let hexNum;
  let symbol;
  let colorPart;
  let stylesPart;
  const hexListData = hexList.data;
  for (let n = 0x00; n <= 0xff; ++n) {
    hexNum = numToHex(n);
    symbol = hexListData[hexNum];
    if (symbol === undefined) {
      continue;
    }

    // todo make more beautiful
    colorPart = (symbol.color === undefined) ? '' : "'" + symbol.color + "'";
    stylesPart = (symbol.styles === undefined) ? '' : "'" + symbol.styles.join(SYMBOL_STYLE_DELIMITER) + "' ";
    lines.push(`    '${hexNum}': [ '${symbol.char}', ${colorPart}, ${stylesPart}],`);
  }

  lines.push('  },');
  lines.push('});');

  // download file
  const dateNow = new Date().toISOString();
  const a = document.createElement('a')
  a.download = hexListSelect.value + '-modified-' + dateNow + '.js';
  a.href = URL.createObjectURL(new Blob([lines.join('\n')]));
  a.click();
  URL.revokeObjectURL(a.href);
});




// changing hexlist props
document.querySelector('#hexListProps').addEventListener('change', function (event) {
  const inputElem = event.target;
  hexList[inputElem.dataset.propName] = inputElem.value;
});

/**
 * Shows an URL at the show instructions section
 * @param {string} url - The generated URL
 **/
async function showGenerateURL(url) {

  document.querySelector('#show-GenerateURL').innerHTML = `
  <textarea style="font-size: 8pt" class="form-control form-control-sm" rows="5" id="textarea-GenerateURL" readonly>${url}</textarea>
  <div class="btn-group btn-group-toggle">
  <a class="btn-sm" id="copy-GenerateURL" href="#" onclick="IDClick(id);event.preventDefault();"><span class="fa fa-copy"></span></a>
  <a class="btn-sm" id="open-GenerateURL" href="${url}" target="_blank"><span class="fa fa-external-link-alt"></span></a></div>`;
  document.querySelector('#copy-GenerateURL').addEventListener('click', function () {
    navigator.clipboard.writeText(url).then(function () {
      console.log('Copying URL to clipboard was successful!');
    }, function (err) {
      console.error('Could not copy URL: ', err);
    });
  });
}

document.querySelector('#generateTableURL').addEventListener('click', function () {
  const urlObj = new URL(location.href);
  urlObj.searchParams.delete('mode');
  urlObj.searchParams.delete('input');
  urlObj.searchParams.delete('list');
  encodeHexListToUrlString(function (urlString) {
    urlObj.searchParams.set('hexListV2', urlString);
    //window.open(urlObj.href);
    showGenerateURL(urlObj);
  });
});

document.querySelector('#generateViewURL').addEventListener('click', function () {
  const urlObj = new URL(location.href);
  urlObj.searchParams.set('mode', mode);
  urlObj.searchParams.set('input', inputStr);
  urlObj.searchParams.delete('list');
  encodeHexListToUrlString(function (urlString) {
    urlObj.searchParams.set('hexListV2', urlString);
    //window.open(urlObj.href);
    showGenerateURL(urlObj);
  });
});




document.querySelector('#generateRandomText').addEventListener('click', function () {
  const randomBytes = [];
  for (let n = 0; n < NUMBER_OF_RANDOM_BYTES_TO_GENERATE; ++n) {
    randomBytes.push(Math.floor(Math.random() * 255));
  }

  inputStr = randomBytes.map(num => num.toString(16).padStart(2, '0')).join('');
  inputElem.value = '0x' + inputStr; // 0x prefix + autoselct Hex mode
  {
    mode = 'HEX';
    selectMode();
  }
  encodeUserInput();
});


document.querySelector('#myEthAddress').addEventListener('click', function () {
  // Load WEB3
  // Check wether it's already injected by something else (like Metamask or Parity Chrome plugin)
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    // Or connect to a node
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  // Check the connection
  if (!web3.isConnected()) {
    console.error("Not connected");
  }
  var account = web3.eth.accounts[0];

  //const account = new web3.eth.accounts[0];
  inputStr = account;
  inputElem.value = account; //
  {
    mode = 'HEX';
    selectMode();
  }
  encodeUserInput();
});



// dev
Object.defineProperty(window, 's', {
  get: function () {
    console.group('curr state');
    l('hexLists', hexLists);
    l('hexList', hexList);
    l('inputStr', inputStr);
    l('inputStrToEncode', inputStrToEncode);
    l('mode', mode);
    console.groupEnd();
  },
});
