<?php 
$data = json_decode(file_get_contents('php://input'), true);

$path = '../';
$filename = strtolower(trim($data['fname']));
$action = $data['action'];

if ( $action === 'export' ) {
    $filename = str_replace(' ', '-', $filename);
    $filename = $path . 'presets/' . $filename  . '.json';
    $json = $data['json'];
    $ok = true;
    if ( false === file_exists($filename) ) $ok = $ok && touch($filename);
    $ok = $ok && file_put_contents($filename, json_encode($json));
    echo json_encode(['status'=>$ok]);
}

if ( $action === 'import' ) {
    $ok = true;
    $fe = false;
    $jsonok = true;
    if ( true === file_exists($path . $filename) ) {
        $fe = true;
        $json = file_get_contents($path . $filename);
        if ( $json === false ) $jsonok = false;
        
    } else die($path . $filename);
    echo $json;
}