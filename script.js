const ROWS = 20;
const COLS = 20;
let grid = [];
let startSelected = false;
let endSelected = false;
let isPlacingWall = false;
let startNode = null;
let endNode = null;

// Initialize the grid
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.style.gridTemplateRows = `repeat(${ROWS}, 30px)`;
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            cell.addEventListener('click', () => handleCellClick(cell));
            gridContainer.appendChild(cell);
            row.push({ element: cell, isWall: false, visited: false });
        }
        grid.push(row);
    }
}

// Handle clicking on a grid cell
function handleCellClick(cell) {
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');

    if (startSelected && !startNode) {
        cell.classList.add('start');
        startNode = { row: parseInt(row), col: parseInt(col) };
        startSelected = false;
    } else if (endSelected && !endNode) {
        cell.classList.add('end');
        endNode = { row: parseInt(row), col: parseInt(col) };
        endSelected = false;
    } else if (isPlacingWall) {
        cell.classList.add('wall');
        grid[row][col].isWall = true;
    }
}

// Dijkstra's Algorithm Visualization
function dijkstra() {
    if (!startNode || !endNode) return;

    let queue = [];
    let distances = {};
    let previous = {};
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            distances[`${r},${c}`] = Infinity;
            previous[`${r},${c}`] = null;
        }
    }
    distances[`${startNode.row},${startNode.col}`] = 0;
    queue.push(startNode);

    while (queue.length > 0) {
        queue.sort((a, b) => distances[`${a.row},${a.col}`] - distances[`${b.row},${b.col}`]);
        let current = queue.shift();
        let { row, col } = current;

        if (row === endNode.row && col === endNode.col) break;

        let neighbors = getNeighbors(row, col);
        for (let neighbor of neighbors) {
            if (!grid[neighbor.row][neighbor.col].isWall && !grid[neighbor.row][neighbor.col].visited) {
                let alt = distances[`${row},${col}`] + 1;
                if (alt < distances[`${neighbor.row},${neighbor.col}`]) {
                    distances[`${neighbor.row},${neighbor.col}`] = alt;
                    previous[`${neighbor.row},${neighbor.col}`] = current;
                    queue.push(neighbor);
                }
            }
        }
        grid[row][col].visited = true;
        grid[row][col].element.classList.add('visited');
    }
    drawPath(previous);
}

// Get neighboring cells
function getNeighbors(row, col) {
    let neighbors = [];
    if (row > 0) neighbors.push({ row: row - 1, col });
    if (row < ROWS - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });
    if (col < COLS - 1) neighbors.push({ row, col: col + 1 });
    return neighbors;
}

// Draw the path
function drawPath(previous) {
    let current = endNode;
    while (current) {
        const { row, col } = current;
        if (grid[row][col].element.classList.contains('start')) break;
        grid[row][col].element.classList.add('path');
        current = previous[`${row},${col}`];
    }
}

// Event Listeners
document.getElementById('start').addEventListener('click', () => {
    startSelected = true;
});

document.getElementById('end').addEventListener('click', () => {
    endSelected = true;
});

document.getElementById('wall').addEventListener('click', () => {
    isPlacingWall = true;
});

document.getElementById('visualize').addEventListener('click', () => {
    dijkstra();
});

// Initialize grid on page load
createGrid();
