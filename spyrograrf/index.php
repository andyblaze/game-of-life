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
    'metaTags'          => meta("viewport", "width=device-width, initial-scale=1.0").
    meta("description", "A spirograph toy with sliders. Load a preset, move things around, and see what happens. Some combinations are better than others.").
    meta("keywords", "spirograph, generative art, math art, procedural graphics, canvas, creative coding, interactive art").
    meta("theme-color", "#000000").
    meta("author", "ARK Digital"),  

    'ogTags'            => meta_prop("og:title", "Spyrograrf – Interactive Spirograph Generator").
    meta_prop("og:description", "Play with sliders, load presets, and create evolving geometric patterns. A generative art toy in your browser.").
    meta_prop("og:type", "website").
    meta_prop("og:url", BASE_URL).
    meta_prop("og:image", url('spyrograrf-preview.png')),

    'twitterTags'       => meta("twitter:card", "summary_large_image").
    meta("twitter:title", "Spyrograrf - Generative Spirograph Tool").
    meta("twitter:description", "Create hypnotic curves with sliders and presets. No instructions—just explore.").
    meta("twitter:image", url('spyrograrf-preview.png')),

    'cssFile'           => link_tag('css/sys.css'),
    'outerRadiusXCtrl'  => slider('Outer radius X', 1, 360, 1, 140, 'int', 'outerRadiusX'),
    'outerRadiusYCtrl'  => slider('Outer radius Y', 1, 360, 1, 140, 'int', 'outerRadiusY'),
    'rotationCtrl'      => slider('Rotation', 0, 359, 1, 0, 'int', 'rotation'),
    'innerRadiusCtrl'   => slider('Inner radius', 1, 360, 1, 60, 'int', 'innerRadius'),
    'penOffsetCtrl'     => slider('Pen offset', 1, 360, 1, 15, 'int', 'penOffset'),
    'speedCtrl'         => slider('speed', 0.01, 1, 0.01, 1, 'float', 'speed', false),
    'colorStartCtrl'    => colorPicker('start', '#00ff00', 'hsla', 'color_start', false),
    'colorEndCtrl'      => colorPicker('end', '#ff0000', 'hsla', 'color_end', false),
    'alphaCtrl'         => slider('alpha', 0, 1, 0.01, 1, 'float', 'alpha', false),
    'rotationForceCtrl' => slider('Arm multiplier', 0, 1, 0.1, 0, 'float', 'rotation_force'),
    'pinchForceCtrl'    => slider('Zoom out', 0, 50, 1, 0, 'int', 'pinch_force'),
    'bendForceCtrl'     => slider('Bending', -30, 30, 1, 0, 'int', 'bend_force'),
    'twistForceCtrl'    => slider('Twisting', -30, 30, 1, 0, 'int', 'twist_force'),
    'shearForceCtrl'    => slider('Shearing', -1, 1, 0.1, 0, 'float', 'shear_force'),
    'spiralForceCtrl'   => slider('Spiraling', -30, 30, 1, 0, 'int', 'spiral_force'),
    'cameraCtrl'        => slider('Camera Off / On', 0, 1, 0, 0, 'int', 'camera'),
    'importSelectCtrl'  => presetsSelect('presets', glob('presets/*.json')),
    'presetItems'       => importItems(),
    'exportCtrls'       => exportCtrls()
];

echo render('view.html', $viewData);
