

$(document).ready(function() {

    (() => {
      const canvas = document.getElementById('gol');
      const ctx = canvas.getContext('2d');

      // Grid config
      const CELL_SIZE = 4;  // pixels per cell
      const COLS = 480;
      const ROWS = 270;

      canvas.width = COLS * CELL_SIZE;
      canvas.height = ROWS * CELL_SIZE;

      // Grids: current state and next state
      let currentGrid = new Array(ROWS);
      let nextGrid = new Array(ROWS);

      for (let y = 0; y < ROWS; y++) {
        currentGrid[y] = new Array(COLS).fill(0);
        nextGrid[y] = new Array(COLS).fill(0);
      }

      // Initialize with random live cells (~20% alive)
      function randomizeGrid() {
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            currentGrid[y][x] = Math.random() < 0.2 ? 1 : 0;
          }
        }
      }

      // Helper: get neighbor count with wraparound
      function countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (x + dx + COLS) % COLS;
            const ny = (y + dy + ROWS) % ROWS;
            count += currentGrid[ny][nx];
          }
        }
        return count;
      }

      // Compute next generation
      function step() {
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            const neighbors = countNeighbors(x, y);
            const alive = currentGrid[y][x] === 1;
            if (alive) {
              nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
              nextGrid[y][x] = (neighbors === 3) ? 1 : 0;
            }
          }
        }
        // Swap grids
        [currentGrid, nextGrid] = [nextGrid, currentGrid];
      }

      // Draw the grid
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';  // bright green live cells

        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (currentGrid[y][x] === 1) {
              ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
          }
        }
      }

      // Main loop
      function loop() {
        step();
        draw();
        requestAnimationFrame(loop);
      }

      // Kickoff
      randomizeGrid();
      loop();
    })();

});
