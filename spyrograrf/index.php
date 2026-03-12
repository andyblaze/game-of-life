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
function slider($name, $min, $max, $step, $val, $type='float', $property='', $isGeo=true, $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    $cssClass = (true === $isGeo ? ' class="geometry"' : '');
    return "<label>
      {$lbl}: <span id=\"{$name}-lbl\">{$val}</span> 
      <input type=\"range\" id=\"{$name}-slider\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val}\"$cssClass />
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

function render($view, $data = []) {
    $html = file_get_contents($view);
    foreach ($data as $key => $value) {
        $html = str_replace("{{$key}}", $value, $html);
    }
    return $html;
}

$viewData = [
    'outerRadiusXCtrl'  => slider('outerRadiusX', 1, 360, 1, 140, 'int', 'outerRadiusX'),
    'outerRadiusYCtrl'  => slider('outerRadiusY', 1, 360, 1, 140, 'int', 'outerRadiusY'),
    'rotationCtrl'      => slider('rotation', 0, 359, 1, 0, 'int', 'rotation'),
    'innerRadiusCtrl'   => slider('innerRadius', 1, 360, 1, 60, 'int', 'innerRadius'),
    'penOffsetCtrl'     => slider('penOffest', 1, 360, 1, 15, 'int', 'penOffset'),
    'speedCtrl'         => slider('speed', 0.01, 1, 0.01, 1, 'float', 'speed', false),
    'colorStartCtrl'    => colorPicker('start', '#00ff00', 'hsla', 'color_start', false),
    'colorEndCtrl'      => colorPicker('end', '#ff0000', 'hsla', 'color_end', false),
    'alphaCtrl'         => slider('alpha', 0, 1, 0.01, 1, 'float', 'alpha', false),
    'rotationForceCtrl' => slider('rotationForce', 0, 1, 0.1, 0, 'float', 'rotation_force'),
    'pinchForceCtrl'    => slider('pinchForce', 0, 50, 1, 0, 'int', 'pinch_force'),
    'bendForceCtrl'     => slider('bendForce', -30, 30, 1, 0, 'int', 'bend_force'),
    'twistForceCtrl'    => slider('twistForce', -30, 30, 1, 0, 'int', 'twist_force'),
    'shearForceCtrl'    => slider('shearForce', -1, 1, 0.1, 0, 'float', 'shear_force'),
    'spiralForceCtrl'   => slider('spiralForce', -30, 30, 1, 0, 'int', 'spiral_force'),
    'depthFactorCtrl'   => slider('depthFactor', 0, 0.02, 0.02, 0, 'float', 'depthFactor'),
    'focalLengthCtrl'   => slider('focalLength', 0, 300, 300, 0, 'int', 'focalLength'),
    'importSelectCtrl'  => presetsSelect('presets', glob('presets/*.json')),
    'presetItems'       => importItems(),
    'exportCtrls'       => exportCtrls()
];

echo render('view.html', $viewData);
