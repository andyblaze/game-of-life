<?php 
$data = json_decode(file_get_contents('php://input'), true);

$filename = strtolower(trim($data['fname']));
$action = $data['action'];

if ( $action === 'export' ) {
    $filename = 'presets/' . $filename  . '.json';
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
    if ( true === file_exists($filename) ) {
        $fe = true;
        $json = file_get_contents($filename);
        if ( $json === false ) $jsonok = false;
        
    }
    echo $json;
}