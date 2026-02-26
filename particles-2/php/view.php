<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Particle Workspace</title>
<link rel="stylesheet" href="css/sys.css">
</head>
<body>
 <!-- UI panel --> 
<form id="ui-panel">
    <div class="col-2">
        <h4>Position <a class="help" data-help="Where the emitter spawns particles in the canvas.">?</a></h4>
        <?=$spawnXCtrl;?>
        <?=$spawnYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Direction <a class="help" data-help="Angle is direction. Spread is how much particles fan out.">?</a></h4>
        <?=$angleCtrl;?>
        <?=$spreadCtrl;?>
    </div>
    <div class="col-2">
        <h4>Size <a class="help" data-help="Starting and ending particle size.">?</a></h4>
        <?=$sizeStartCtrl;?>
        <?=$sizeEndCtrl;?>
    </div>    
    <div class="col-2">
        <h4>Speed <a class="help" data-help="Sets initial X/Y velocity.">?</a></h4>
        <?=$speedXCtrl;?>
        <?=$speedYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Speed variance <a class="help" data-help="Adds randomness to particle speed in X / Y directions.">?</a></h4>
        <?=$speedVarianceXCtrl;?>
        <?=$speedVarianceYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Lifetime <a class="help" data-help="How long particles live, with some variation.">?</a></h4>
        <?=$lifeCtrl;?>
        <?=$lifeVarianceCtrl;?>
    </div>
    <div class="col-2">
        <h4>Spawn Offset <a class="help" data-help="Expands the X/Y area where particles spawn.">?</a></h4>
        <?=$spawnOffsetXCtrl;?>
        <?=$spawnOffsetYCtrl;?>
    </div>
    <div class="col-4">
        <h4>Colour / Alpha (Opacity)</h4>
        <?=$colorStartCtrl;?>
        <?=$colorEndCtrl;?>
        <?=$alphaStartCtrl;?>
        <?=$alphaEndCtrl;?>
    </div>
    <div class="col-2">
        <h4>Density / Trails <a class="help" data-help="Particle count. Lower background opacity makes longer trails.">?</a></h4>
        <?=$densityCtrl;?>
        <?=$bgOpacityCtrl;?>
    </div>
    <div class="col-3">
        <h4>Perlin ( Wind ) <a class="help" data-help="Adds smooth directional drift. Not so smooth at high settings !">?</a></h4>        
        <?=$perlinAmountCtrl;?>
        <?=$perlinScaleCtrl;?>
        <?=$perlinSpeedCtrl;?>
    </div>
    <?=$rendererCtrl;?>
    <div class="col-3 inlined">
        <?=$repulsorCtrl;?>
        <?=$attractorCtrl;?>
        <?=$vortexCtrl;?>
        <?=$gravityCtrl;?>
    </div>
</form>
<!-- Workspace canvas -->
<div id="workspace">
    <div id="fps">FPS: <span id="fps-report">60</span></div>
    <div class="import-export">
        <?=$importSelect;?> 
        <button id="import" type="button">Import</button>
        <button id="export" type="button">Export</button> 
        <label for="fname">Type:</label>
        <input type="text" id="fname" />
    </div>
    <div><canvas id="effect" width="820" height="820"></canvas></div>
    <div id="export-result"></div>
</div>
<script src="js/main.js" type="module"></script>
</body>
</html>