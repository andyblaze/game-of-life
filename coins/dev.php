<?php 
function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}
$wanted = [
    'id', 'rank', 'symbol', 'name',
    'supply', 'maxSupply', 'marketCapUsd',
    'volumeUsd24Hr', 'priceUsd',
    'changePercent24Hr', 'vwap24Hr'
];
$coins = [];
$ccdata = json_decode(file_get_contents('coincap-data.json'));
foreach ( $ccdata->data as $coin ) {
    $symbol = $coin->symbol;
    $filtered = [];

    foreach ($wanted as $key) {
        if ( isset($coin->{$key}) ) {
            $filtered[$key] = $coin->{$key};
        }
    }

    $coins[$symbol] = (object)$filtered;
}
pre($coins);