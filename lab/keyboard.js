const keyboard = document.querySelector('#keyboard-v1');
const asciCheckbox = document.querySelector('#add-ASCI-keyboard');

asciCheckbox.addEventListener("change", (event) => buildKeyboard(event.target.checked))

function buildKeyboard(withASCI) {
  const symbols = hexList.data;
  keyboard.innerHTML = null;
  const hexIdxLis = {"0": "0", "1": "1","2": "2","3": "3","4": "4","5": "5","6": "6","7": "7","8": "8","9": "9","a": "a","b": "b","c": "c","d": "d","e": "e","f": "f"};
  const tableData = Object.keys(symbols).reduce((prev, el) => {
    const text = fromHex(el);
    prev[el[0]] = {
      ...prev[el[0]],
      [el[1]]: buildOneKey(text, el, symbols[el].color, symbols[el].char)
    }
    return prev;
  }, {});

  function buildOneKey(text, hex, classNames, content) {
    const el = document.createElement("div");
    const subEl = document.createElement("div");
    subEl.className = `keyboard-key-symbol`;
    el.className = `keyboard-key ${classNames} flex-center`;
    subEl.innerHTML = text;
    withASCI && el.appendChild(subEl);
    el.innerHTML += content;
    el.addEventListener("click", () => {
      if (mode === 'ASCII') {
        inputStr += text;
      } else if (mode === 'HEX') {
        inputStr += hex;
      }
      inputElem.value = inputStr;
      encodeUserInput();
    });
    return el;
  }

  function tableCreate(parent, tableData) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '0');
    Object.keys(tableData).sort().forEach(key => {
      const row = tableData[key];
      const rowEl = document.createElement('tr');
      const colEl = document.createElement('td');
      colEl.innerHTML = key;
      rowEl.appendChild(colEl);
      Object.keys(row).forEach(key => {
        const col = row[key];
        const colChildEl = document.createElement('td');
        typeof col === "string"? colChildEl.innerHTML = col: colChildEl.appendChild(col);
        rowEl.appendChild(colChildEl);
      })
      table.appendChild(rowEl);
    })
    parent.appendChild(table)
  }

  function toHex(str){
    try {
      return unescape(encodeURIComponent(str))
        .split('')
        .map((v) => v.charCodeAt(0).toString(16))
        .join('');
    } catch(e){
      return str;
    }
  }

  function fromHex(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
  }

  console.log(tableData);
  tableData["*"] = hexIdxLis;
  tableCreate(keyboard, tableData);
}


  // Object.keys(symbols)
  //   .forEach(key => {
  //     const text = fromHex(key);
  //     keyboard.appendChild(buildOneKey(text, symbols[key].color, symbols[key].char));
  //   })