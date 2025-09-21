<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title><?=$page->data->page_title;?></title>
<meta name="description" content="<?=$page->data->description;?>" />
<meta name="keywords" content="<?=$page->data->keywords;?>" />
<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #000; /* parchment-like */
  }
  canvas { display: block; }
  #loadingScreen {
    position: fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.9);
    color: #FF861A;
    font-size: 8em;
    font-family:Arial,Helvetica,sans-serif,sans;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 2s linear;
  }
</style>
</head>
<body>
<div id="loadingScreen"></div>
<script type="text/javascript">
let countdown = 3;
const loadingDiv = document.getElementById('loadingScreen');
loadingDiv.textContent = countdown;
const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      loadingDiv.textContent = countdown;
    } else {
      clearInterval(interval);
      // start fade-out
      loadingDiv.style.opacity = 0;
      // remove from DOM after fade
      setTimeout(() => loadingDiv.style.display = 'none', 2000); // match 2000ms to style transition 2s
    }
  }, 1000);
</script>
<canvas id="onscreen"></canvas>
<script type="module" src="main.js">

</script>
</body>
</html>