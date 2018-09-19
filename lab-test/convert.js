'use strict';

function symbolToHtml(symbol) {
  const elemClasses = [];
  if (symbol.color !== undefined) {
    elemClasses.push(symbol.color);
  }
  const symbolClasses = symbol.styles;
//  if (!(additionalClasses === undefined || additionalClasses === '')) {
  if (symbolClasses !== undefined) {
//    elemClasses.push(...symbolClasses.split(SYMBOL_STYLE_DELIMITER));
    elemClasses.push(...symbolClasses);
//    elemClasses.concat(symbolClasses);
  }

  return `<span  style="float:left;" class="w-25 ${elemClasses.join(' ')}">${symbol.char}</span>`;
}




function symbolToString(symbol) {
  const parts = [symbol.char, symbol.color];
//  parts.push(symbol.color || '');

  const styles = symbol.styles;
  if (styles === undefined) {
    parts.push('');
  }
  else {
    parts.push(styles.join(SYMBOL_STYLE_DELIMITER));
  }

  return parts.join();
}




function arraySymbolToObjSymbol(arraySymbol) {
  const objSymbol = {
    char: arraySymbol[0],
  };

  const color = arraySymbol[1];
  if (!(color === '' || color === undefined)) {
    objSymbol.color = color;
  }

  const styles = arraySymbol[2];
  if (!(styles === '' || styles === undefined)) {
    objSymbol.styles = styles.split(SYMBOL_STYLE_DELIMITER);
  }

  return objSymbol;
}




function urlSymbolToObjSymbol(urlSymbol) {
  const objSymbol = {
//    char: String(urlSymbol[0] + urlSymbol[1]).trimLeft(),
    char: urlSymbol.slice(0, 2).trimLeft(),
  };

  const color = urlSymbol[2];
  if (color !== ABSENT_SYMBOL_COLOR) {
    objSymbol.color = HEXLIST_URL_DECODE_COLOR_MAP[color] || color;
  }

  const styles = urlSymbol.slice(3);
  if (styles !== '') {
    objSymbol.styles = styles.split(SYMBOL_STYLE_DELIMITER);
    objSymbol.styles = objSymbol.styles.map(style => HEXLIST_URL_DECODE_STYLE_MAP[style] || style);
  }

  return objSymbol;
}




function strToHexStr(str) {
  return str.split('').map(char => char.charCodeAt().toString(16)).join('');
}




function numToHex(n) {
  return n.toString(16).padStart(2, '0');
}
