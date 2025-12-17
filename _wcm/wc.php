<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>West Cornwall Board</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0 /">
    <link href="css/site.css" rel="stylesheet" type="text/css" />
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
      <?php $f = file_get_contents('wc.svg');?>
      <?php $t = file_get_contents('towns.svg');?>
      <?=str_replace('<!--towns-->', $t, $f);?>
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
<script type="text/javascript">
    function byId(id) {
        return document.getElementById(id);
    }
    function addEvent(evt, handler) {
        window.addEventListener(evt, handler);
    }
    function resize() {
        checkOrientation();
        const g = byId("svg-map");
        g.width = window.innerWidth;
        g.height = window.innerHeight;
        g.style.width = window.innerWidth;
        g.style.height = window.innerHeight;
    }
    
  function checkOrientation() {
    const warning = byId("rotate-warning");
    if (window.innerHeight > window.innerWidth) {
      warning.style.display = "flex";
    } else {
      warning.style.display = "none";
    }
  }
  
function getSvgCoords(evt, svg) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

const svg = document.querySelector('#map svg');
const townsLayer = svg.querySelector('#towns');

svg.addEventListener('click', (e) => {
  // ignore clicks on existing towns
  if (e.target.closest('.town')) return;

  let { x, y } = getSvgCoords(e, svg);
  x = parseInt(x);
  y = parseInt(y);
  const name = prompt('Town name?');

  if (!name) return;



  console.log(`
<g class="town" id="${name.toLowerCase()}" data-name="${name}">
  <circle cx="${x}" cy="${y}" r="9" />
  <text x="${(x + 10)}" y="${(y + 4)}">${name}</text>
</g>
`);
});



  addEvent("load", resize);
  addEvent("resize", resize);
</script>

</body>
</html>
