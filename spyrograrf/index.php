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

function render($view, $data = []) {
    $html = file_get_contents($view);
    foreach ($data as $key => $value) {
        $html = str_replace('{' . $key . '}', $value, $html);
    }
    return $html;
}

$viewData = [
    'outerRadiusCtrl' => slider('outerRadius', 120, 360, 1, 140, 'int', 'outerRadius'),
    'innerRadiusCtrl' => slider('innerRadius', 20, 100, 1, 60, 'int', 'innerRadius'),
    'penOffset'       => slider('penOffest', 2, 30, 1, 15, 'int', 'penOffset')  
];

echo render('view.html', $viewData);
