const qrCodeEls = document.getElementsByClassName('qrcode-square');
const qrIdenticonEl = document.querySelector('#identicon-square');
const qrIdenticonEl2 = document.querySelector('#identicon-square2');
const qrIdenticonEl3 = document.querySelector('#identicon-square3');
const qrIdenticonEl4 = document.querySelector('#identicon-square4');
const qrIdenticonEl5 = document.querySelector('#identicon-square5');
const qrIdenticonEl6 = document.querySelector('#identicon-square6');
const qrIdenticonEl7 = document.querySelector('#identicon-square7');
const qrIdenticonEl8 = document.querySelector('#identicon-square8');
const qrIdenticonEl9 = document.querySelector('#identicon-square9');

const qrIdenticonCi = document.querySelector('#identicon-circle');
const qrIdenticonCi2 = document.querySelector('#identicon-circle2');
const qrIdenticonCi3 = document.querySelector('#identicon-circle3');
const qrIdenticonCi4 = document.querySelector('#identicon-circle4');
const qrIdenticonCi5 = document.querySelector('#identicon-circle5');
const qrIdenticonCi6 = document.querySelector('#identicon-circle6');
const qrIdenticonCi7 = document.querySelector('#identicon-circle7');
const qrIdenticonCi8 = document.querySelector('#identicon-circle8');
const qrIdenticonCi9 = document.querySelector('#identicon-circle9');

const stretchSlider = document.querySelector('#icons-stretch-slider');
const strokeWidth = document.querySelector('#icon-stroke-width');
const bgOpacity = document.querySelector('#bg-opactiy-slider');
const hPosSlider = document.querySelector('#h-pos-slider');
const vPosSlider = document.querySelector('#v-pos-slider');
const wSlider = document.querySelector('#w-slider');
const hSlider = document.querySelector('#h-slider');
const strokeColor = document.querySelector('#icon-stroke-color');
const bgColor = document.querySelector('#bg-color-input');

const betaBorderWidthSlider = document.querySelector('#beta-bw-slider');
const betaIconStretchSlider = document.querySelector('#beta-icons-stretch-slider');
const betaBgColor = document.querySelector('#beta-bg-color-input');
const betaBgOpacity = document.querySelector('#beta-bg-opactiy-slider');

// const [ stretchSlider, strokeWidth, bgOpacity, hPosSlider, vPosSlider, wSlider, hSlider, strokeColor, bgColor ] = document.querySelector('.injection-controls').getElementsByTagName("input");

const qrs = [...qrCodeEls].map(el => new QRCode(el, {
  width: 500,
  height: 500,
  correctLevel : QRCode.CorrectLevel.H
}));

stretchSlider.onchange = event => {
  momCodeSqareInjected.classList.remove("stretch-0", "stretch-1", "stretch-2", "stretch-3", "stretch-4", "stretch-5", "stretch-6");
  momCodeSqareInjected.classList.add(`stretch-${event.target.value}`);
}

strokeWidth.onchange = event => {
  //const currentValue = momCodeSqareInjected.style.textShadow || 'rgb(255, 255, 255) 0px 0px 0px';
  const currentValue = momCodeSqareInjected.style.textShadow || 'rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) -1px 1px 0px, rgb(255, 255, 255) 1px 1px 0px';
  momCodeSqareInjected.style.textShadow = currentValue.replace(/\d{0,2}px$/, `${event.target.value}px`);
  // momCodeSqareInjected.style.WebkitTextStrokeWidth = `${event.target.value}px`
}

strokeColor.onchange = event => {
  const currentValue = momCodeSqareInjected.style.textShadow || 'rgb(255, 255, 255) 0px 0px 0px';
  momCodeSqareInjected.style.textShadow = currentValue.replace(/rgb\([\d, ]+\)/, event.target.value);
  // momCodeSqareInjected.style.WebkitTextStrokeColor = event.target.value
}

hPosSlider.onchange = event => {
  momCodeSqareInjected.style.left = `${event.target.value}%`
}

vPosSlider.onchange = event => {
  momCodeSqareInjected.style.top = `${event.target.value}%`
}

wSlider.onchange = event => {
  momCodeSqareInjected.style.width = `${event.target.value}%`
}

hSlider.onchange = event => {
  momCodeSqareInjected.style.height = `${event.target.value}%`
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

betaBorderWidthSlider.onchange = event => {
  $('.h-border').css('height', event.target.value + 'px').css('width', 250 + +event.target.value  + 'px');
  $('.v-border').css('width', event.target.value + 'px').css('height', 250 + +event.target.value + 'px');
  $('.version-b').css('width', 250 + 2*event.target.value + 'px').css('height', 250 + 2*event.target.value + 'px');
}

betaIconStretchSlider.onchange = event => {
  setQrBordersWithMomCode(null, event.target.value)
}

betaBgOpacity.onchange = event => {
  const currentColor = $('.momcode-border').css('backgroundColor') || 'rgba(255,255,255,0.7)';
  $('.momcode-border').css('backgroundColor', currentColor.replace(/[\d\.]+\)/, `${event.target.value})`));
}

betaBgColor.onchange = event => {
  const currentColor = $('.momcode-border').css('backgroundColor') || 'rgba(255,255,255,0.7)';
  $('.momcode-border').css('backgroundColor', hexToRgba(event.target.value, currentColor.match(/[\d\.]+\)/)));
}

function saveQRSquare(selector) {
  const el = document.querySelector(selector);
  html2canvas(el, {
    scale: 3,
    logging: true
  })
    .then(canvas => {
      const image = canvas.toDataURL("image/png");
      const aLink = document.createElement('a');
      aLink.setAttribute('download', 'momcode_square.png');
      aLink.setAttribute('href', image.replace("image/png", "image/octet-stream"));
      aLink.click();
    });
}

function saveIdenticonSquare(y) {
  html2canvas(y,  {
    scale: 1,
    logging: true
  })
    .then(canvas => {
      const image = canvas.toDataURL("image/png");
      const aLink = document.createElement('a');
      const dateNow = new Date().toISOString();
      aLink.setAttribute('download', 'Momcode-Identicon_' + dateNow + '.png');
      aLink.setAttribute('href', image.replace("image/png", "image/octet-stream"));
      aLink.click();
    });
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
