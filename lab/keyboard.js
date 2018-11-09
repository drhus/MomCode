const keyboard = document.querySelector('#keyboard-v1');

function buildKeyboard() {
  const symbols = hexList.data;
  keyboard.innerHTML = null;
  Object.keys(symbols)
    .forEach(key => {
      const text = fromHex(key);
      keyboard.appendChild(buildOneKey(text, symbols[key].color, symbols[key].char));
    })

  function buildOneKey(text, classNames, content) {
    const el = document.createElement("div");
    const subEl = document.createElement("div");
    subEl.className = `keyboard-key-symbol`;
    el.className = `keyboard-key ${classNames} flex-center`;
    subEl.innerHTML = text;
    el.appendChild(subEl);
    el.innerHTML += content;
    el.addEventListener("click", () => {
      if (mode !== 'ASCII') {
        inputStr = "";
        mode = 'ASCII';
        selectMode();
      }
      inputStr += text;
      inputElem.value = inputStr;
      encodeUserInput();
    });
    return el;
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
}