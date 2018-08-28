'use strict';

addArrayHexList({
  name: 'test',
  author: 'user1',
  comment: 'dev',
  data: {
    '00': [ 'A', 'blue' ],
    '01': [ '♥', 'red', 'strikethrough' ],
    '02': [ '♥', 'red', 'strikethrough-bold' ],
    '03': [ 'B', '', 'underline' ],
    '04': [ 'C', ,'underline' ],
    '05': [ 'd' ],
    '06': [ 'e', 'lime', 'strikethrough-underline' ], // todo does not work
    '20': [ '$', 'orange', 'italic-overline' ],
  },
});
