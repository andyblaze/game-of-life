<?php 
$data = json_decode(file_get_contents('php://input'), true);
echo json_encode($data); exit;

$filename = strtolower(trim($data->fname)) . '.json';
$json = $data->json;
$action = $data->action;

if ( $action === 'export' ) {
    $ok = true;
    if ( false === file_exists($filename) ) $ok = $ok && touch($filename);
    $ok = $ok && file_put_contents($filename, json_encode($json, JSON_PRETTY_PRINT));
    echo json_encode(['status'=>$ok]);
}