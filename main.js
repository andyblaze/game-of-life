

$(document).ready(function() {

    (() => {
      const CELL_SIZE = 4;
      const COLS = 480;
      const ROWS = 270;

      const canvas = document.getElementById('gol');
      canvas.width = COLS * CELL_SIZE;
      canvas.height = ROWS * CELL_SIZE;
      const ctx = canvas.getContext('2d');

      // Create offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext('2d');

      // State arrays
      let current = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
      let next = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

      // Random seed
      function seedGrid() {
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            current[y][x] = Math.random() < 0.2 ? 1 : 0;
          }
        }
      }

      // Count neighbors with wraparound
      function countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (x + dx + COLS) % COLS;
            const ny = (y + dy + ROWS) % ROWS;
            count += current[ny][nx];
          }
        }
        return count;
      }

      // Game logic step
      function step() {
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            const neighbors = countNeighbors(x, y);
            const alive = current[y][x] === 1;
            next[y][x] = alive
              ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
              : (neighbors === 3 ? 1 : 0);
          }
        }
        [current, next] = [next, current];
      }

      // Drawing to offscreen canvas
function draw() {
  // Clear offscreen canvas
  offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

  // Draw current live cells to offscreen
  offCtx.fillStyle = '#0f0';
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (current[y][x] === 1) {
        offCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // Clear onscreen canvas (not strictly necessary, but safe)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Blit to visible canvas
  ctx.drawImage(offscreen, 0, 0);
}

      function loop() {
        step();
        draw();
        requestAnimationFrame(loop);
      }

      seedGrid();
      loop();
    })();

});
