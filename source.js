// initializing canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.height = 800;
canvas.width = 400;

// initializing time variables
let currentTime = Date.now();
let lastUpdate = currentTime;
const frameRate = 30;

// game variables
let gameOver = false;
let doneFalling = false;

// initializing board variable
const boardWidth = 10;
const boardHeight = 20;
const blockWidth = canvas.width / boardWidth;
let board;

// colors for blocks and background. order: background, I, S, J, T, L, Z, O
const colors = ["#000000", "#01f0f0", "#01f000", "#0000f0", "#a000f0", "#f0a000", "#f00000", "#f0f000"];
// block shapes
const IBlock = [[1, 1, 1, 1]];
const SBlock = [[0, 2, 2], [2, 2, 0]];
const JBlock = [[3, 0, 0], [3, 3, 3]];
const TBlock = [[0, 4, 0], [4, 4, 4]];
const LBlock = [[0, 0, 5], [5, 5, 5]];
const ZBlock = [[6, 6, 0], [0, 6, 6]];
const OBlock = [[7, 7], [7, 7]];
const blocks = [IBlock, SBlock, JBlock, TBlock, LBlock, ZBlock, OBlock];

function initBoard(){
    board  = new Array(boardWidth);
    for(let i = 0; i < boardHeight; i++){
        board[i] = new Array(boardWidth);
    }
    for(let i = 0; i < boardHeight; i++){
        for(let j = 0; j < boardWidth; j++){
            board[i][j] = 0;
        }
    }
}

function insertBlock(block){
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < boardWidth; j++){
            if(board[i][j] !== 0){
                gameOver = true;
                console.log("Game over");
                return;
            }
        }
    }
    for(let i = 0; i < blocks[block].length; i++){
        for(let j = 0; j < blocks[block][0].length; j++){
            board[i][j + 3] = blocks[block][i][j];
        }
    }
}

function insertRandomBlock(){
    let num = Math.floor(Math.random() * blocks.length);
    console.log("Hello", num);
    insertBlock(num);
}

function fall(){
    let canFall = true;
    doneFalling = false;
    for(let i = boardHeight - 1; i >= 0; i--){
        for(let j = 0; j < boardWidth; j++){
            if(board[i][j] > 0){ // if we're looking at a falling block
                if(!(i < boardHeight - 1)){ // if it's at the bottom
                    canFall = false;
                } else if(board[i + 1][j] < 0){ // if there is a solid block underneath
                    canFall = false;
                }
            }

        }
    }
    if(canFall){
        for(let i = boardHeight - 1; i >= 0; i--){
            for(let j = 0; j < boardWidth; j++){
                if(board[i][j] > 0){ // if we're looking at a falling block
                    board[i + 1][j] = board[i][j];
                    board[i][j] = 0;
                }
            }
        }
    } else{
        doneFalling = true;
        solidify();
    }
}

function solidify(){
    for(let i = 0; i < boardHeight; i++){
        for(let j = 0; j < boardWidth; j++){
            if(board[i][j] > 0)
            board[i][j] = -board[i][j];
        }
    }
}

function renderBlocks(){
    for(let i = 0; i < boardHeight; i++){
        for(let j = 0; j < boardWidth; j++){
            ctx.fillStyle = colors[Math.abs(board[i][j])]; // set colours depending on current block
            ctx.fillRect(j * blockWidth, i * blockWidth, blockWidth, blockWidth);
        }
    }
    drawLimitLine();
}

function drawLimitLine(){
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(0, blockWidth * 2);
    ctx.lineTo(canvas.width, blockWidth * 2);
    ctx.stroke();
}

function clock(){
    currentTime = Date.now();
    if((currentTime - lastUpdate) >= (1000 / frameRate)){
        lastUpdate = currentTime;
        update();
    }
    if(!gameOver){
        requestAnimationFrame(clock);
    }
}

function update(){
    renderBlocks();
    fall();
    if(doneFalling){
        insertRandomBlock();
    }
}

function start(){
    gameOver = false;
    initBoard();
    insertRandomBlock();
    clock();
}

// drawing the initial board
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 400, 800);
drawLimitLine();