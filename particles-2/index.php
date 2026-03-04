<?php 
include('php/utils.php');

function importItems() {
    $htm = "<script type=\"text/javascript\">
    const presets = {\n";
    foreach ( glob('presets/*.json') as $f ) {
        $name = basename($f, '.json'); // e.g. "anemone"
        $json = file_get_contents($f);
        $htm .= $name . ': ' . $json . ",\n";
    }
    $htm = trim($htm, ",\n");
    $htm .= "\n}\n</script>\n";
    return $htm;
}

function exportCtrls() {
    return IN_PRODUCTION ? '' : '<button id="export" type="button">Export</button> 
        <label for="fname">Name:</label>
        <input type="text" id="fname" value="" autocomplete="false" />';
}

function saneItems($name, $property, $prefix) {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return [$lbl, $prop, $name];    
}
function slider($name, $min, $max, $step, $val, $type='float', $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
      {$lbl}: <span id=\"{$name}-lbl\">{$val}</span> 
      <input type=\"range\" id=\"{$name}-slider\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val}\" />
    </label>";
}
function selectCtrl($name, $options, $type='str', $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    $opts = '';
    $sel = '';
    foreach ( $options as $id=>$opt ) {
        $val = $opt;
        $txt = ucfirst($opt);
        if ( $id === 0 ) $sel = $val;        
        $opts .= "<option value=\"{$val}\">{$txt}</option>";
    }
    return "<label>
      {$lbl}: 
      <select id=\"{$name}-select\" data-property=\"{$prop}\" data-type=\"{$type}\">{$opts}</select>
    </label>";
}
function colorPicker($name, $val, $type, $property, $prefix='color-') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$val}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" value=\"{$val}\" />
        </label>";
}
function presetsSelect($name, $options) { 
    $htm = "<select name=\"{$name}\" id=\"{$name}\">";
    foreach ( $options as $opt ) {
        $val = str_replace('.json', '', basename($opt));
        $txt = ucfirst(str_replace(['-', '_'], ' ', $val));
        $htm .= "<option value=\"{$val}\">{$txt}</option>";
    }
    $htm .= '</select>';
    return $htm;
}
$viewData = [
    'spawnXCtrl'        => slider('X', 0, 820, 1, 410, 'int', 'spawn_x', 'spawn-pos-'),
    'spawnYCtrl'        => slider('Y', 0, 820, 1, 410, 'int', 'spawn_y', 'spawn-pos-'),    
    'angleCtrl'         => slider('angle', 0, 359, 1, 180, 'int'),
    'sizeStartCtrl'     => slider('start', 0.5, 320, 0.5, 2, 'float', 'size_start', 'size-'),
    'sizeEndCtrl'       => slider('end', 0.5, 320, 0.5, 2, 'float', 'size_end', 'size-'),
    'speedVarianceXCtrl'=> slider('X', 0.01, 1, 0.01, 0.01, 'float', 'speed_varianceX', 'speed-variance-'),
    'speedVarianceYCtrl'=> slider('Y', 0.01, 1, 0.01, 0.01, 'float', 'speed_varianceY', 'speed-variance-'),
    'spreadCtrl'        => slider('spread', 0, 359, 1, 25, 'int'),
    'speedXCtrl'        => slider('x', 0, 8, 0.25, 1, 'float', 'speed_x', 'speed'),
    'speedYCtrl'        => slider('y', 0, 8, 0.25, 1, 'float', 'speed_y', 'speed'),
    'lifeCtrl'          => slider('life', 1, 512, 1, 256, 'int'),
    'lifeVarianceCtrl'  => slider('life-variance', 0.01, 1, 0.01, 0.01, 'float', 'life_variance'),
    'spawnOffsetXCtrl'  => slider('X', 0, 64, 1, 0, 'int', 'spawn_offsetX', 'spawn-offset-'),
    'spawnOffsetYCtrl'  => slider('Y', 0, 64, 1, 0, 'int', 'spawn_offsetY', 'spawn-offset-'),
    'colorStartCtrl'    => colorPicker('start', '#00ff00', 'hsla', 'color_start'),
    'colorEndCtrl'      => colorPicker('end', '#ff0000', 'hsla', 'color_end'),
    'alphaStartCtrl'    => slider('start', 0, 1, 0.01, 0.8, 'float', 'alpha_start', 'alpha-'),
    'alphaEndCtrl'      => slider('end', 0, 1, 0.01, 0, 'float', 'alpha_end', 'alpha-'),
    'densityCtrl'       => slider('density', 1, 6, 1, 1, 'int'),
    'bgOpacityCtrl'     => slider('bg-opacity', 0, 0.3, 0.001, 0.15, 'float', 'bg_opacity'),
    'perlinAmountCtrl'  => slider('perlinAmount', 0, 10, 0.01, 0, 'float', 'perlin_amount'),
    'perlinScaleCtrl'   => slider('perlinScale', 0, 2, 0.01, 0.01, 'float', 'perlin_scale'),
    'perlinSpeedCtrl'   => slider('perlinSpeed', 0, 2, 0.01, 0.01, 'float', 'perlin_speed'),
    'importSelect'      => presetsSelect('presets', glob('presets/*.json')),
    'rendererCtrl'      => selectCtrl('renderer', ['solid', 'gradient', 'velocity_line', 'arc', 'triangle', 'ellipse', 'radial_burst', 'connections', 'line', 'petal']),
    'repulsorCtrl'      => slider('repulsor', 0, 2, 0.1, 0, 'float', 'repulsor', 'force'), 
    'attractorCtrl'     => slider('attractor', 0, 2, 0.1, 0, 'float', 'attractor', 'force'), 
    'vortexCtrl'        => slider('vortex', -5, 5, 0.1, 0, 'float', 'vortex', 'force'), 
    'gravityCtrl'       => slider('gravity', -1, 1, 0.1, 0, 'float', 'gravity', 'force'),
    'boidsCtrl'         => slider('boids', 0, 2, 0.1, 0, 'float', 'boids', 'force'),
    'exportCtrls'       => exportCtrls(),
    'presetItems'       => importItems(),
    'baseUrl'           => BASE_URL
];
extract($viewData);
include('php/view.php');
