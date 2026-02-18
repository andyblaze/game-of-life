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
function selectCtrl($name, $options, $type='str', $property='', $prefix='') {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    $opts = '';
    $sel = '';
    foreach ( $options as $id=>$opt ) {
        $val = $opt;
        $txt = ucfirst($opt);
        if ( $id === 0 ) $sel = $val;        
        $opts .= "<option value=\"{$val}\">{$txt}</option>";
    }
    return "<label>
      {$lbl}: <!--<span id=\"{$name}-lbl\">{$val}</span>-->
      <select id=\"{$name}-select\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\">{$opts}</select>
    </label>";
}
function colorPicker($name, $val, $type, $property, $prefix='color-') {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$val}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" value=\"{$val}\" />
        </label>";
}
function select($name, $options) { 
    $htm = "<select name=\"{$name}\" id=\"{$name}\">";
    foreach ( $options as $opt ) {
        $val = $opt;
        $txt = ucfirst(str_replace('.json', '', basename($val)));
        $htm .= "<option value=\"{$val}\">{$txt}</option>";
    }
    $htm .= '</select>';
    return $htm;
}
$controls = [
    'angleCtrl'         => slider('angle', 0, 359, 1, 180, 'int'),
    'sizeStartCtrl'     => slider('start', 0.5, 32, 0.5, 2, 'float', 'size_start', 'size-'),
    'sizeEndCtrl'       => slider('end', 0.5, 32, 0.5, 2, 'float', 'size_end', 'size-'),
    'speedVarianceXCtrl'=> slider('X', 0.01, 1, 0.01, 0.01, 'float', 'speed_varianceX', 'speed-variance-'),
    'speedVarianceYCtrl'=> slider('Y', 0.01, 1, 0.01, 0.01, 'float', 'speed_varianceY', 'speed-variance-'),
    'spreadCtrl'        => slider('spread', 0, 359, 1, 25, 'int'),
    'speedXCtrl'        => slider('x', 0.25, 16, 0.25, 1, 'float', 'speed_x', 'speed'),
    'speedYCtrl'        => slider('y', 0.25, 16, 0.25, 1, 'float', 'speed_y', 'speed'),
    'lifeCtrl'          => slider('life', 1, 256, 1, 256, 'int'),
    'lifeVarianceCtrl'  => slider('life-variance', 0.01, 1, 0.01, 0.01, 'float', 'life_variance'),
    'spawnOffsetXCtrl'  => slider('X', 0, 32, 1, 0, 'int', 'spawn_offsetX', 'spawn-offset-'),
    'spawnOffsetYCtrl'  => slider('Y', 0, 32, 1, 0, 'int', 'spawn_offsetY', 'spawn-offset-'),
    'colorStartCtrl'    => colorPicker('start', '#00ff00', 'hsla', 'color_start'),
    'colorEndCtrl'      => colorPicker('end', '#ff0000', 'hsla', 'color_end'),
    'alphaStartCtrl'    => slider('start', 0, 1, 0.01, 0.8, 'float', 'alpha_start', 'alpha-'),
    'alphaEndCtrl'      => slider('end', 0, 1, 0.01, 0.8, 'float', 'alpha_end', 'alpha-'),
    'densityCtrl'       => slider('density', 1, 12, 1, 1, 'int'),
    'bgOpacityCtrl'     => slider('bg-opacity', 0, 0.3, 0.001, 0.15, 'float', 'bg_opacity'),
    'perlinAmountCtrl'  => slider('perlinAmount', 0, 10, 0.01, 0, 'float', 'perlin_amount'),
    'perlinScaleCtrl'   => slider('perlinScale', 0, 2, 0.01, 0.01, 'float', 'perlin_scale'),
    'perlinSpeedCtrl'   => slider('perlinSpeed', 0, 2, 0.01, 0.01, 'float', 'perlin_speed'),
    'importSelect'      => select('presets', glob('presets/*.json')),
    'rendererCtrl'      => selectCtrl('renderer', ['solid', 'gradient'])
];
extract($controls);
include('view.php');
