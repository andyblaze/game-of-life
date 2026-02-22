<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Particle Workspace</title>
<link rel="stylesheet" href="sys.css">
</head>
<body>
 <!-- UI panel --> 
<form id="ui-panel">
    <div class="col-2">
        <h4>Position</h4>
        <?=$spawnXCtrl;?>
        <?=$spawnYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Direction</h4>
        <?=$angleCtrl;?>
        <?=$spreadCtrl;?>
    </div>
    <div class="col-2">
        <h4>Size</h4>
        <?=$sizeStartCtrl;?>
        <?=$sizeEndCtrl;?>
    </div>    
    <div class="col-2">
        <h4>Speed</h4>
        <?=$speedXCtrl;?>
        <?=$speedYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Speed variance</h4>
        <?=$speedVarianceXCtrl;?>
        <?=$speedVarianceYCtrl;?>
    </div>
    <?=$lifeCtrl;?>
    <?=$lifeVarianceCtrl;?>
    <div class="col-2">
        <h4>Spawn Offset</h4>
        <?=$spawnOffsetXCtrl;?>
        <?=$spawnOffsetYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Alpha</h4>
        <?=$alphaStartCtrl;?>
        <?=$alphaEndCtrl;?>
    </div>
    <div class="col-2">
        <h4>Color</h4>
        <?=$colorStartCtrl;?>
        <?=$colorEndCtrl;?>
    </div>
    <?=$densityCtrl;?>
    <div class="col-4">
        <?=$bgOpacityCtrl;?>
        <?=$perlinAmountCtrl;?>
        <?=$perlinScaleCtrl;?>
        <?=$perlinSpeedCtrl;?>
    </div>
    <?=$rendererCtrl;?>
    <div class="col-2 inlined">
        <label for="repulsor">Repulsor: <input type="checkbox" class="force-ticker" id="repulsor" data-force="repulsor" data-type="bool" value="1" /></label>
        <label for="vortex">Vortex: <input type="checkbox" class="force-ticker" id="vortex" data-force="vortex" data-type="bool" value="1" /></label>
    </div>
</form>
<!-- Workspace canvas -->
<div id="workspace">
    <div id="fps">FPS: <span id="fps-report">60</span></div>
    <div class="import-export"><?=$importSelect;?> <button id="import" type="button">Import</button></div>
    <div><canvas id="effect" width="720" height="720"></canvas></div>
    <div class="import-export"><button id="export" type="button">Export</button> <label for="fname">Type:</label><input type="text" id="fname" /></div>
    <div id="export-result"></div>
</div>
<script src="main.js" type="module"></script>
</body>
</html>