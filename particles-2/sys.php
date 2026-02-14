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
$controls = [
    'angleCtrl'         => slider('angle', 0, 359, 1, 180, 'int'),
    'sizeStartCtrl'     => slider('start', 0.5, 32, 0.5, 2, 'float', 'size_start', 'size-'),
    'sizeEndCtrl'       => slider('end', 0.5, 32, 0.5, 2, 'float', 'size_end', 'size-'),
    'spreadCtrl'        => slider('spread', 0, 359, 1, 25, 'int'),
    'speedXCtrl'        => slider('x', 0.5, 32, 0.5, 1, 'float', 'speed_x', 'speed'),
    'speedYCtrl'        => slider('y', 0.5, 32, 0.5, 1, 'float', 'speed_y', 'speed'),
    'lifeCtrl'          => slider('life', 1, 256, 1, 256, 'int'),
    'lifeVarianceCtrl'  => slider('life-variance', 0.01, 1, 0.01, 0.01, 'float', 'life_variance'),
    'spawnOffsetXCtrl'  => slider('X', 0, 32, 1, 0, 'int', 'spawn_offsetX', 'spawn-offset-'),
    'spawnOffsetYCtrl'  => slider('Y', 0, 32, 1, 0, 'int', 'spawn_offsetY', 'spawn-offset-'),
    'colorStartCtrl'    => colorPicker('start', '#00ff00', 'hsla', 'color_start'),
    'colorEndCtrl'      => colorPicker('end', '#ff0000', 'hsla', 'color_end'),
    'alphaCtrl'         => slider('alpha', 0, 1, 0.01, 0.8),
    'densityCtrl'       => slider('density', 1, 12, 1, 1, 'int')
];
extract($controls);
include('view.php');
