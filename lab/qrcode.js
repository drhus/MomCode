const qrCodeEl = document.querySelector('#qrcode-square');
const qr = new QRCode(qrCodeEl, {
  width: 500,
  height: 500,
  correctLevel : QRCode.CorrectLevel.H
});