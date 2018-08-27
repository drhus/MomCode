'use strict';

function getHtmlForSymbol(symbol) {
  const classes = [symbol[1]];
  let additionalClasses = symbol[2];
  if (!(additionalClasses === undefined || additionalClasses === '')) {
    classes.push(...additionalClasses.split('-'));
  }

  return `<span class="${classes.join(' ')}">${symbol[0]}</span>`;
}




function encodeHexString(hexString) {
  const hexValues = hexString.match(/../g);
//  n(); l(hexValues);

  const symbols = hexValues.map(hexValue => hexList[hexValue]);
//  l(symbols);

  const symbolsInText = [];
  const symbolsInHtml = [];

  for (const symbol of symbols) {
    if (symbol === undefined) {
      symbolsInText.push(ABSENT_SYMBOL_TEXT);
      symbolsInHtml.push(ABSENT_SYMBOL_HTML);
    }
    else {
      symbolsInText.push('{' + symbol.join() + '}');
      symbolsInHtml.push(getHtmlForSymbol(symbol));
    }
  }

//  l(symbolsInText);
//  l(symbolsInHtml);
  return { hexValues, symbolsInText, symbolsInHtml };
}




function strToHexStr(str) {
  return str.split('').map(char => char.charCodeAt().toString(16)).join('');
}




function numToHex(n) {
  return n.toString(16).padStart(2, '0');
}
