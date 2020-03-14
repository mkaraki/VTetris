function setColor(cell, colorid)
{
    cell.setAttribute("class", "board-cells board-cell-color-" + COLORS[colorid]);
}

function getColor(cell)
{
    var toret = 0;
    var classes = cell.getAttribute("class").split(' ');
    classes.forEach(v => {
        if (v == "board-cells") return;
        switch (v)
        {
            case "board-cell-color-none": toret = 0; break;
            case "board-cell-color-lightblue": toret = 1; break;
            case "board-cell-color-yellow": toret = 2; break;
            case "board-cell-color-purple": toret = 3; break;
            case "board-cell-color-blue": toret = 4; break;
            case "board-cell-color-orange": toret = 5; break;
            case "board-cell-color-green": toret = 6; break;
            case "board-cell-color-red": toret = 7; break;
        }
    });
    return toret;
}

function cell(x, y)
{
    var line = document.getElementsByClassName("board-line")[y];
    var cell = line.getElementsByClassName("board-cells")[x];
    return cell;
}

function line(line)
{
    return document.getElementsByClassName("board-line")[line];
}

// Check line erasable and erase
function checkEraseLine()
{
    while (true)
    {
        var erased = false;
        for (var y = 19; y >= 0; y--)
        {
            if (checkLineErasable(y))
            {
                eraseLine(y);
                erased = true;
            }
        }
        if (erased == false) break;
    }

}

function checkLineErasable(y)
{
    var nonecount = 0;
    for (var x = 0; x < WIDTH; x++)
    {
        var checkcell = cell(x, y);
        var checkcell_classes = checkcell.getAttribute("class").split(' ');
        if (checkcell_classes.includes("board-cell-color-none")) nonecount++;
    }
    return nonecount == 0;
}

function eraseLine(l)
{
    line(l).remove();
    document.getElementById("board").insertBefore(createLine(), line(0));
}

function createLine()
{
    var line = document.createElement("div");
    line.setAttribute("class", "board-line");
    for (var x = 0; x < WIDTH; x++)
    {
        var cell = document.createElement("div");
        cell.setAttribute("class","board-cells board-cell-color-none");
        line.appendChild(cell);
    }
    return line;
}

window.onload = function() {
    var board = document.getElementById("board");

    for (var y = 0; y < HEIGHT; y++)
    {
        board.appendChild(createLine());
    }

    goNext();
}

function fillCells(ccode)
{
    for (var x = 0; x < WIDTH; x++)
        for (var y = 0; y < HEIGHT; y++)
            setColor(cell(x, y), ccode);
}

// Keydown
document.onkeydown = function(event) {
    if (event.isComposing) return;

    if (event.keyCode == KEY_DOWN)
        goDownB();
    else if (event.keyCode == KEY_LEFT)
        goLeft();
    else if (event.keyCode == KEY_RIGHT)
        goRight();
    else if (event.keyCode == KEY_CTRL)
        rotateBlockCB();
    else if (event.keyCode == KEY_SHIFT)
        rotateBlockCCB();
    else if (event.keyCode == KEY_SPACE)
        goMostDown();
    else if (event.keyCode == KEY_ENTER)
        goMostDown();   
};

var downTimer = null;

var blockPositionX;
var blockPositionY;
// block is 2D array
// [y][x] (relative)
var block;

function goMostDown()
{
    resetTimer();

    var res;
    do {
        res = goDown();
    } while(res);
    decideBlock();
}

function goDownB()
{
    resetTimer();

    if (!goDown())
        decideBlock();
}

function goDown()
{
    resetTimer();
    
    if (blockPositionY + block.length + 1 > HEIGHT)
        return false;
    
    var toclean = [];

    for (var x = 0; x < block[0].length; x++)
    {
        for (var y = 0; y < block.length; y++)
        {
            if (block[y][x] == 0)
                continue;
            toclean.push([getBlockAbsoluteX(x), getBlockAbsoluteY(y)]);
        }

        for (var y = block.length - 1;y >= 0; y--)
        {
            if (block[y][x] == 0) continue;
            if (getColor(cell(getBlockAbsoluteX(x), getBlockAbsoluteY(y + 1))) != 0)
                return false;
            else
                break;
        }
    }

    blockPositionY++;
    
    cleanCellsPos(toclean);
    applyDisplay();
    return true;
}

function goLeft()
{
    resetTimer();
    
    if (blockPositionX < 1)
        return;
    
    var toclean = [];

    for (var y = 0; y < block.length; y++)
    {
        for (var x = 0; x < block[y].length; x++)
        {
            if (block[y][x] == 0)
                continue;
            toclean.push([getBlockAbsoluteX(x), getBlockAbsoluteY(y)]);
        }

        for (var x = 0; x < block[y].length; x++)
        {
            if (block[y][x] == 0) continue;
            if (getColor(cell(getBlockAbsoluteX(x - 1), getBlockAbsoluteY(y))) != 0)
                return;
            else
                break;
        }
    }

    blockPositionX--;

    cleanCellsPos(toclean);
    applyDisplay();
}

function goRight()
{
    resetTimer();
    
    if (blockPositionX + block[0].length > WIDTH)
        return;

    var toclean = [];

    for (var y = 0; y < block.length; y++)
    {
        for (var x = 0; x < block[y].length; x++)
        {
            if (block[y][x] == 0)
                continue;
            toclean.push([getBlockAbsoluteX(x), getBlockAbsoluteY(y)]);
        }

        for (var x = block[y].length - 1; x >= 0; x--)
        {
            if (block[y][x] == 0) continue;
            if (getColor(cell(getBlockAbsoluteX(x + 1), getBlockAbsoluteY(y))) != 0)
                return;
            else
                break;
        }
    }

    blockPositionX++;

    cleanCellsPos(toclean);
    applyDisplay();
}

function decideBlock()
{
    modTimer(false);
    
    checkEraseLine();
    goNext();
}

function rotateBlockCB()
{
    resetTimer();

    var toclean = [];

    for (var y = 0; y < block.length; y++)
    {
        for (var x = 0; x < block[y].length; x++)
        {
            if (block[y][x] == 0)
                continue;
            toclean.push([getBlockAbsoluteX(x), getBlockAbsoluteY(y)]);
        }
    }

    cleanCellsPos(toclean);

    block = rotateBlock(block, 1);
    applyDisplay();
}

function rotateBlockCCB()
{
    resetTimer();

    var toclean = [];

    for (var y = 0; y < block.length; y++)
    {
        for (var x = 0; x < block[y].length; x++)
        {
            if (block[y][x] == 0)
                continue;
            toclean.push([getBlockAbsoluteX(x), getBlockAbsoluteY(y)]);
        }
    }

    cleanCellsPos(toclean);

    block = rotateBlock(block, -1);
    applyDisplay();
}

function goNext()
{
    resetTimer();

    blockPositionX = 3;
    blockPositionY = 0;
    block = getNext();
    applyDisplay();
}

function resetTimer()
{
    modTimer(false);
    modTimer(true);
}

function modTimer(enable)
{
    if (enable)
    {
        if (downTimer != null) clearInterval(downTimer);
        downTimer = setInterval(goDownB, 1000);
    }
    else
    {
        if (downTimer == null) return;
        clearInterval(downTimer);
        downTimer = null;
    }
}

function getBlockAbsoluteX(x)
{
    return x + blockPositionX;
}

function getBlockAbsoluteY(y)
{
    return y + blockPositionY;
}

function applyDisplay()
{
    for (var y = 0; y < block.length; y++)
    {
        for (var x = 0; x < block[0].length; x++)
        {
            if (block[y][x] == 0) continue;
            setColor(cell(getBlockAbsoluteX(x), getBlockAbsoluteY(y)), block[y][x]);
        }
    }
}

function cleanCellsPos(cellPoints)
{
    cellPoints.forEach(point => {
        if (point.length != 2) return;

        setColor(cell(point[0], point[1]), 0);
    });
}

// Rotate Block
// -1: un Clockwize
//  1: Clockwize
function rotateBlock(block, direction)
{
    var o = block;
    var t = [];
    var n = [];

    cm = o.length;
    rm = o[0].length;

    for (var oy = 0; oy < o.length; oy++)
    {
        t = o[oy];

        t = t.reverse();

        for (var nx = 0; nx < t.length; nx++)
        {
            if (n[nx] == undefined) n[nx] = [];

            n[nx][oy] = t[nx];
        }
    }

    if (direction = 1)
    {
        n = n.reverse();
        for (var i = 0; i < n.length; i++)
            n[i] = n[i].reverse();
    }

    return n;
}

// Next : Block
function getNext()
{
    var rnd = Math.floor(Math.random() * (TETROMINOS.length - 1)) + 1;

    return TETROMINOS[rnd];
}