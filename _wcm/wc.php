<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>West Cornwall Board</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    :root {
      --sea-blue: #CFE9F6;
      --panel-bg: rgba(255, 255, 255, 0.85);
      --panel-border: rgba(0, 0, 0, 0.1);
      --panel-radius: 1rem;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: var(--sea-blue);
      overflow: hidden;
      font-family: system-ui, sans-serif;
    }

    #game {
      /*position: relative;
      width: 100vw;
      height: 100vh;*/
      padding: 0 0 2rem 2rem;
    }

    /* Map */
    #map {
      /*position: absolute;*/
      padding: 0 0 2rem 2rem;
      /*inset: 0;*/
      /*display: flex;
      align-items: center;
      justify-content: center;*/
      z-index: 1;
    }

    #map img {
      /*width: 100%;
      height: 98%;
      object-fit: contain;*/
    }
.town circle {
  fill: #e63946;
  cursor: pointer;
}

.town:hover circle {
  fill: #ff7a7a;
}

.town text {
  font-size: 0.7rem;
  pointer-events: none;
  fill: #333;
}
    /* UI panels */
    .ui-panel {
      position: absolute;
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: var(--panel-radius);
      padding: 1rem;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.08);
      z-index: 2;
    }

    #panel-top {
      top: 2rem;
      left: 5%;
      /*transform: translateX(-50%);*/
      width: min(32rem, 25vw);
      text-align: center;
    }

    #panel-bottom-left {
      bottom: 2rem;
      left: 5%;
      width: min(32rem, 25vw);
    }

    #panel-bottom-right {
      bottom: 2rem;
      right: 5%;
      width: min(32rem, 25vw);
    }

    .panel-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      opacity: 0.7;
    }

    .panel-content {
      font-size: 0.9rem;
    }
#rotate-warning {
  position: fixed;
  inset: 0;
  background: #cfe9f6;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

#rotate-warning .rotate-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.rotate-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.rotate-text {
  font-size: 1rem;
  line-height: 1.4;
}

  </style>
</head>
<body>
<div id="rotate-warning">
  <div class="rotate-box">
    <div class="rotate-icon">📱↻</div>
    <div class="rotate-text">
      Please rotate your device<br>
      <small>(This game works best in landscape)</small>
    </div>
  </div>
</div>

  <div id="game">

    <div id="map">
      <?php include 'wc.svg';?>
    </div>

    <div id="panel-top" class="ui-panel">
      <div class="panel-title">Events</div>
      <div class="panel-content">
        The sea is calm. Nothing terrible has happened yet.
      </div>
    </div>

    <div id="panel-bottom-left" class="ui-panel">
      <div class="panel-title">Actions</div>
      <div class="panel-content">
        Roll Dice<br>
        End Turn
      </div>
    </div>

    <div id="panel-bottom-right" class="ui-panel">
      <div class="panel-title">Player</div>
      <div class="panel-content">
        Money: £1500<br>
        Properties: 0
      </div>
    </div>

  </div>
<script>
  function checkOrientation() {
    const warning = document.getElementById('rotate-warning');
    if (window.innerHeight > window.innerWidth) {
      warning.style.display = 'flex';
    } else {
      warning.style.display = 'none';
    }
  }

  window.addEventListener('load', checkOrientation);
  window.addEventListener('resize', checkOrientation);
</script>

</body>
</html>
