const qrCodeEl = document.querySelector('#qrcode-square');
const [ stretchSlider, strokeWidth, bgOpacity, hPosSlider, vPosSlider, strokeColor, bgColor ] = document.querySelector('.injection-controls').getElementsByTagName("input");

const qr = new QRCode(qrCodeEl, {
  width: 500,
  height: 500,
  correctLevel : QRCode.CorrectLevel.H
});


stretchSlider.onchange = event => {
  momCodeSqareInjected.classList.remove("stretch-0", "stretch-1", "stretch-2");
  momCodeSqareInjected.classList.add(`stretch-${event.target.value}`);
}

strokeWidth.onchange = event => {
  momCodeSqareInjected.style.WebkitTextStrokeWidth = `${event.target.value}px`
}

strokeColor.onchange = event => {
  momCodeSqareInjected.style.WebkitTextStrokeColor = event.target.value
}

hPosSlider.onchange = event => {
  momCodeSqareInjected.style.left = `${event.target.value}%`
}

vPosSlider.onchange = event => {
  momCodeSqareInjected.style.top = `${event.target.value}%`
}

bgOpacity.onchange = event => {
  const currentColor = momCodeSqareInjected.style.backgroundColor || 'rgba(255,255,255,0.7)';
  momCodeSqareInjected.style.backgroundColor = currentColor.replace(/[\d\.]+\)/, `${event.target.value})`);
}

bgColor.onchange = event => {
  const currentColor = momCodeSqareInjected.style.backgroundColor || 'rgba(255,255,255,0.7)';
  const newColor = hexToRgba(event.target.value, currentColor.match(/[\d\.]+\)/));
  momCodeSqareInjected.style.backgroundColor = newColor;
}

function hexToRgba(hexVal, a) {
  hexVal = hexVal.replace('#', '');
  if ( hexVal.length === 3 ) {
    hexVal = hexVal[0] + hexVal[0] + hexVal[1] + hexVal[1] + hexVal[2] + hexVal[2];
  };
  const red = hexVal.substr(0,2),
      green = hexVal.substr(2,2),
      blue = hexVal.substr(4,2);
  const red10 = parseInt(red,16),
      green10 = parseInt(green,16),
      blue10 = parseInt(blue,16);
  return `rgba(${red10},${green10},${blue10},${a || '1)'}`;
}