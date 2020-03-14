const WIDTH = 10;
const HEIGHT = 20;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37
const KEY_RIGHT = 39;

const KEY_CTRL = 17; // for Rotate Right
const KEY_SHIFT = 16; // for Rotate Left
const KEY_ENTER = 13;
const KEY_SPACE = 32;

const TETROMINO_I = [ [ 1, 1, 1, 1 ] ];
const TETROMINO_O = [ [ 2, 2 ], [2, 2] ];
const TETROMINO_T = [ [ 0, 3, 0 ], [ 3, 3, 3] ];
const TETROMINO_J = [ [ 4, 0, 0 ], [ 4, 4, 4] ];
const TETROMINO_L = [ [ 0, 0, 5 ], [ 5, 5, 5] ];
const TETROMINO_S = [ [ 0, 6, 6 ], [ 6, 6, 0] ];
const TETROMINO_Z = [ [ 7, 7, 0 ], [ 0, 7, 7] ];

const COLORS = [ "none", "lightblue", "yellow", "purple", "blue", "orange", "green", "red", "mono" ]
const TETROMINOS = [undefined, TETROMINO_I, TETROMINO_O, TETROMINO_T, TETROMINO_J, TETROMINO_L, TETROMINO_S, TETROMINO_Z];