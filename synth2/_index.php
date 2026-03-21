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

function radioGroup() {

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
    meta("robots", "index, follow").
    '<link rel="canonical" href="' . BASE_URL .'">'. PHP_EOL .
    meta("author", "ARK Digital"),  

    'ogTags'            => meta_prop("og:title", "Spyrograrf - Interactive Spirograph Generator").
    meta_prop("og:description", "Play with sliders, load presets, and create evolving geometric patterns. A generative art toy in your browser.").
    meta_prop("og:type", "website").
    meta_prop("og:url", BASE_URL).
    meta_prop("og:image", url('spyrograrf-preview.png')),

    'twitterTags'       => meta("twitter:card", "summary_large_image").
    meta("twitter:title", "Spyrograrf - Generative Spirograph Tool").
    meta("twitter:description", "Create hypnotic curves with sliders and presets. No instructions—just explore.").
    meta("twitter:image", url('spyrograrf-preview.png')),

    'cssFile'           => link_tag('css/site.css'),
    'oscCtrl'           => slider('osc', 100, 700, 1, 100, 'int', 'osc', false)
    /*'rCtrl'             => slider('r', 1, 150, 1, 60, 'int', 'r', false),
    'ratioCtrl'         => slider('Ratio', 1, 20, 0.1, 1, 'float', 'ratio', false),
    'speedCtrl'         => slider('Speed', 0.01, 1, 0.01, 0.5, 'float', 'speed', false),
    'detuneCtrl'        => slider('Detune', 0, 10, 0.1, 0, 'float', 'detune', false),
    'cutoffCtrl'        => slider('Cutoff', 100, 5000, 10, 100, 'int', 'cutoff', false),
    'tremoloRateCtrl'   => slider('Tremolo rate', 0, 10, 0.1, 0, 'float', 'tremoloRate', false),
    'tremoloDepthCtrl'  => slider('Tremolo depth', 0, 1, 0.01, 0, 'float', 'tremoloDepth', false),
    'waveformCtrl'      => selectCtrl('waveform', ['sine', 'square', 'sawtooth', 'triangle'])
    'importSelectCtrl'  => presetsSelect('presets', glob('presets/*.json')),
    'presetItems'       => importItems(),
    'exportCtrls'       => exportCtrls()*/
];

echo render('view.html', $viewData);
