<?php 
function slider($name, $min, $max, $step, $val, $type='float', $property='', $prefix='') {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return "<label>
      {$lbl}: <span id=\"{$name}-lbl\">{$val}</span>
      <input type=\"range\" id=\"{$name}-slider\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val}\" />
    </label>";
}
function colorPicker($name, $val, $type, $property, $prefix='color-') {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return "<label>
        Start: <span id=\"{$name}-lbl\">{$val}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" value=\"{$val}\" />
        </label>";
}
?>
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
    <h3>Particle Controls</h3>
    <?=slider('angle', 0, 359, 1, 180, 'int');?>
    <div class="col-2">
        <h4>Size</h4>
        <?=slider('start', 0.5, 32, 0.5, 2, 'float', 'size_start', 'size-');?>
        <?=slider('end', 0.5, 32, 0.5, 2, 'float', 'size_end', 'size-');?>
    </div>
    <?=slider('spread', 0, 360, 1, 22);?>
    <div class="col-2">
        <h4>Speed</h4>
        <?=slider('x', 0.5, 32, 0.5, 1, 'float', 'speed_x', 'speed');?>
        <?=slider('y', 0.5, 32, 0.5, 1, 'float', 'speed_y', 'speed');?>
    </div>
    <?=slider('life', 1, 256, 1, 256, 'int');?>
    <?=slider('life-variance', 0.01, 1, 0.01, 0.01, 'float', 'life_variance');?>
    <div class="col-2">
        <h4>Spawn Offset</h4>
        <?=slider('X', 0, 32, 1, 0, 'int', 'spawn_offsetX', 'spawn-offset-');?>
        <?=slider('Y', 0, 32, 1, 0, 'int', 'spawn_offsetY', 'spawn-offset-');?>
    </div>
    <?=slider('alpha', 0, 1, 0.01, 0.8);?>
    <div class="col-2">
        <h4>Color</h4>
        <?=colorPicker('start', '#00ff00', 'hsla', 'color_start');?>
        <?=colorPicker('end', '#ff0000', 'hsla', 'color_end');?>
    </div>
    <?=slider('density', 1, 12, 1, 1, 'int');?>
    <button id="export" type="button">Export</button>
    <div id="export-json"></div>
</form>
<!-- Workspace canvas -->
<div id="workspace">
    <canvas id="effect" width="720" height="720"></canvas>
</div>
<script src="main.js" type="module"></script>
</body>
</html>
