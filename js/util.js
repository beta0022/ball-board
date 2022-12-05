'use strict'

function createMat(ROWS, COLS) {
    const mat = []

    for (var i = 0; i < ROWS; i++) {
        const row = []

        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }

    return mat
}


// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
    
}


function getRandomIntInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}