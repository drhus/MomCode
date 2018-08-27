'use strict';

const bs58check = require('bs58check');

// function is global to be accessible in main script
window.encodeBitcoinAddress = function(address) {
 return bs58check.decode(address).toString('hex').slice(2);
}
