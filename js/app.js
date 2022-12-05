'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/glue.png">'

const BALL_SOUND = new Audio('sound/ball.wav')
const GLUE_SOUND = new Audio('sound/glue.wav')
const WIN_SOUND = new Audio('sound/win.wav')

// Model:
var gBoard
var gGamerPos
var gIsGameOn
var gBallsOnBoard
var gBallsCollectedCounter
var gIntervalBall
var gBallsAround
var gIsGlue
var gIntervalGlue


function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)

    document.querySelector('.game-over-container').classList.add('hide')
    
    gIsGameOn = true 
    gIsGlue = false
    gBallsOnBoard = 2

    gBallsAround = 0
    document.querySelector('.balls-around span').innerText = gBallsAround

    gBallsCollectedCounter = 0
    document.querySelector('.collected-balls span').innerText = gBallsCollectedCounter

    gIntervalBall = setInterval(addBall, 4000)
    gIntervalGlue = setInterval(addGlue, 5000)
}


function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }

    board[0][Math.floor(board[0].length / 2)].type = FLOOR
	board[board.length - 1][Math.floor(board[0].length / 2)].type = FLOOR
	board[Math.floor(board.length / 2)][0].type = FLOOR
	board[Math.floor(board.length / 2)][board[0].length - 1].type = FLOOR

    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL 

    console.log(board)
    return board
}


// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            } else if (currCell.gameElement === GLUE) {
                strHTML += GLUE_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
}


// Move the player to a specific location
function moveTo(i, j) {

    if (!gIsGameOn || gIsGlue) return

    console.log(i, j)
    const targetCell = gBoard[i][j]

    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (iAbsDiff === gBoard.length - 1 || jAbsDiff === gBoard[0].length - 1)) {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
            BALL_SOUND.play()
            gBallsOnBoard--
            gBallsCollectedCounter++
			document.querySelector('.collected-balls span').innerText = gBallsCollectedCounter

            checkGameOver(gGamerPos)
        }

        else if (targetCell.gameElement === GLUE) {
			console.log('Glued!')
			GLUE_SOUND.play()
			gIsGlue = true
			setTimeout(() => gIsGlue = false, 3000)
		}

        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)
    }

    countBallsAround()
}


function checkGameOver(){

    if (gBallsOnBoard === 0){
        WIN_SOUND.play()
        gIsGameOn = false
        clearInterval(gIntervalBall)
        clearInterval(gIntervalGlue)

        var elGameOverContainer = document.querySelector('.game-over-container')
        elGameOverContainer.classList.remove('hide')
    }
}


// Move the player by keyboard arrows
function onHandleKey(event) {

    var i = gGamerPos.i
    var j = gGamerPos.j
    
	switch (event.key) {
        case 'ArrowLeft':
            if (j === 0) j = gBoard[0].length - 1
            else j--
            break

        case 'ArrowRight':
            if (j === gBoard[0].length - 1) j = 0
            else j++
            break

        case 'ArrowUp':
            if (i === 0) i = gBoard.length - 1
            else i--
            break

        case 'ArrowDown':
            if (i === gBoard.length - 1) i = 0
            else i++
            break
    }

    moveTo(i, j) 
}


function getEmptyCells(){
	var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length; j++) {
			
            if (gBoard[i][j].gameElement === null && gBoard[i][j].type === FLOOR){
                emptyCells.push({ i, j })
            }
        }
    }

    return emptyCells
}


function addElement(gameElement, value) {
	var emptyCells = getEmptyCells()
    var pos = emptyCells[getRandomIntInt(0, emptyCells.length - 1)]

	if (!pos) return
	
    gBoard[pos.i][pos.j].gameElement = gameElement
    renderCell(pos, value)

    setTimeout(() => {
		if (gBoard[pos.i][pos.j].gameElement === GLUE){
			gBoard[pos.i][pos.j].gameElement = null
			renderCell(pos, '')
			}
	}, 3000)
}


function addBall(){
    addElement(BALL, BALL_IMG)
    gBallsOnBoard++
    countBallsAround()
}


function addGlue(){
    addElement(GLUE, GLUE_IMG)
}


function countBallsAround() {
    var cellAround
    gBallsAround = 0

	for (var i = gGamerPos.i - 1; i <= gGamerPos.i + 1; i++) {

        for (var j = gGamerPos.j - 1; j <= gGamerPos.j + 1; j++) {
            if (i === gGamerPos.i && j === gGamerPos.j) continue
            if (j < 0 || j >= gBoard[0].length) continue
            if (i < 0 || i >= gBoard.length) continue

            cellAround = gBoard[i][j]

            if (cellAround.gameElement === BALL){
                gBallsAround++
            }
        }
    }
    
    document.querySelector('.balls-around span').innerText = gBallsAround
}