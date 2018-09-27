'use strict';

function encodeHexString(hexString) {
  const hexValues = hexString.match(/../g);
//  n(); l(hexValues);

  const symbols = hexValues.map(hexValue => hexList.data[hexValue]);
//  l(symbols);

  const symbolsInText = [];
  const symbolsInHtml = [];

  for (const symbol of symbols) {
    if (symbol === undefined) {
      symbolsInText.push(ABSENT_SYMBOL_TEXT);
      symbolsInHtml.push(ABSENT_SYMBOL_HTML);
    }
    else {
//      symbolsInText.push('{' + symbol.join() + '}');
      symbolsInText.push('{' + symbolToString(symbol) + '}');

      symbolsInHtml.push(symbolToHtml(symbol));
    }
  }

//  l(symbolsInText);
//  l(symbolsInHtml);
  return { hexValues, symbolsInText, symbolsInHtml };
}




function encodeHexListToUrlString(callback) {
  let hexNum;
  let symbol;
  let char;
  let color;
  let styles;
  let symbolStr;
  const stringParts = [];
  const hexListData = hexList.data;
  for (let n = 0x00; n <= 0xff; ++n) {
    hexNum = numToHex(n);
    symbol = hexListData[hexNum];
    if (symbol === undefined) {
      symbolStr = `${ABSENT_SYMBOL_CHAR.padStart(2)}${ABSENT_SYMBOL_COLOR}`;
    }
    else {
      char = symbol.char.padStart(2); // ensure char is always 2 bytes

      color = symbol.color;
      if (color === undefined) {
        color = ABSENT_SYMBOL_COLOR;
      }
      else {
        color = HEXLIST_URL_ENCODE_COLOR_MAP[color] || color[0];
      }

      styles = symbol.styles;
      if (styles === undefined) {
        styles = [];
      }
      else {
        styles = styles.map(style => HEXLIST_URL_ENCODE_STYLE_MAP[style] || style[0]);
      }
      
//      symbolStr = [char, color, styles.join(SYMBOL_STYLE_DELIMITER)].join(HEXLIST_URL_SYMBOL_PARTS_DELIMITER);
      symbolStr = char + color + styles.join(SYMBOL_STYLE_DELIMITER);
    }
    stringParts.push(symbolStr);
  }
  const rawString = stringParts.concat(hexList.name, hexList.author, hexList.comment, hexList.number).join(HEXLIST_URL_SYMBOL_DELIMITER);
  l(rawString);
  l(rawString.length);

  LZMA.compress(rawString, 1, function(compressedArray, error) {
    l('LZMA.compress()', compressedArray, error);

    const compressedString = String.fromCharCode(...compressedArray);
    l(compressedString);
    l(compressedString.length);

    const encodedString = Base64.encode(compressedString, true);
    l(encodedString);
    l(encodedString.length);
    callback(encodedString);
  });
}
