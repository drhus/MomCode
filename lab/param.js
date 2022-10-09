'use strict';

const HEXLIST_DIRECTORY = 'hexlist';

const HEXLIST_NAMES = [
  'Momcode-209',
  'Momcode-210',
  'Momcode-211',
  'Momcode-220',
  'Momcode-220A (Font Awesome)',
  'Momcode-225A (Font Awesome)',
  'Momcode-225B (Colorblind-friendly + FA)',
  'Momcode-230A (Font Awesome)',
  'Momcode-301 (ASCII + Frequency)',
  'Momcode-230B (Font Awesome - Invert)',
  '4Fun - PGP word list (Even Words)',
  '4Fun - PGP word list (Odd Words)',
  '4Fun - IdentiAddress I',
  '4Fun - IdentiAddress II',
  '4Fun - IdentiAddress III',
  '4Fun - Emoji-Random',
  'ShapeAddress FA Colorblind',
];

const HEXLIST_ADDITIONAL_PROPS = ['name', 'author', 'comment', 'number'];

const FONT_FAMILY_LIST = [
  'Lato', // to using something as initital value better to set it in first position of array, and it'll be default automatically :)
  'Oswald',
  'Roboto'
];

const APP_DEFAULT_MODE = 'HEX';
const APP_DEFAULT_LIST = 'Momcode-230A (Font Awesome)';


const ABSENT_SYMBOL_CHAR = '\u2639';
const ABSENT_SYMBOL_TEXT = '{' + ABSENT_SYMBOL_CHAR + '}';
const ABSENT_SYMBOL_HTML = '<strong>' + ABSENT_SYMBOL_CHAR + '</strong>';

const ABSENT_SYMBOL_COLOR = 'x';


const NUMBER_OF_RANDOM_BYTES_TO_GENERATE = 20;


const SYMBOL_STYLE_DELIMITER = '-';


const HEXLIST_URL_SYMBOL_DELIMITER = '\x00';


const HEXLIST_URL_ENCODE_COLOR_MAP = {
  'gray': 'z',
  'red': 'r',
  'orange': 'o',
  'yellow': 'y',
  'green': 'g',
  'blue': 'b',
  'purple': 'p',
  'white': 'w',
  'black': 'k',
  'bg-red': '1',
  'bg-orange': '2',
  'bg-yellow': '3',
  'bg-green': '4',
  'bg-blue': '5',
  'bg-purple': '6',
  'bg-white': '7',
  'bg-black': '8',
  'bg-gray': '9',
};

const HEXLIST_URL_DECODE_COLOR_MAP = {
  'z': 'gray',
  'r': 'red',
  'o': 'orange',
  'y': 'yellow',
  'g': 'green',
  'b': 'blue',
  'p': 'purple',
  'w': 'white',
  'k': 'black',
  '1': 'bg-red',
  '2': 'bg-orange',
  '3': 'bg-yellow',
  '4': 'bg-green',
  '5': 'bg-blue',
  '6': 'bg-purple',
  '7': 'bg-white',
  '8': 'bg-black',
  '9': 'bg-gray',
};


const HEXLIST_URL_ENCODE_STYLE_MAP = {
  'special': 'p',
  'small': 'm',
  'bold': 'l',
  'underline': 'u',
  'strikethrough': 's',
  'overline': 'q',
  'italic': 'i',
  'tiny': 't',
};

const HEXLIST_URL_DECODE_STYLE_MAP = {
  'p': 'special',
  'm': 'small',
  'l': 'bold',
  'u': 'underline',
  's': 'strikethrough',
  'q': 'overline',
  'i': 'italic',
  'tiny': 't',
};
