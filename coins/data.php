<?php 
function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}
class CoinCap {
    private $histFile = 'history.json';
    private $coinsFile = 'coincap-data.json';
    private $wanted = [
        'id', 'rank', 'symbol', 'name',
        'supply', 'maxSupply', 'marketCapUsd',
        'volumeUsd24Hr', 'priceUsd',
        'changePercent24Hr', 'vwap24Hr'
    ];
    private $data = [];
    public function loadHistory() {
        if ( file_exists($this->histFile) ) {
            $this->data = json_decode(file_get_contents($this->histFile));
            return true;
        }
        return false;
    }
    public function initialise() {
        $ccdata = json_decode(file_get_contents($this->coinsFile)); 
        foreach ( $ccdata->data as $coin ) {
            $symbol = $coin->symbol;
            $filtered = [];

            foreach ($this->wanted as $key) {
                if ( isset($coin->{$key}) ) {
                    $filtered[$key] = $coin->{$key};
                }
            }
            $this->data[$symbol] = (object)$filtered;
        }
    }
    public function saveHistory() {
        file_put_contents($this->histFile, json_encode($this->data, JSON_PRETTY_PRINT));    
    }
    public function updateData() { 
        foreach ( $this->data as $symbol=>$coin ) {
            // tiny supply drift
            $coin->supply *= (1 + rand(-1, 1) / 1000000);
            // small price jitter
            $coin->priceUsd *= (1 + rand(-10, 10) / 1000);
            // recompute dependent fields
            $coin->marketCapUsd = $coin->priceUsd * $coin->supply;
            $coin->vwap24Hr = $coin->priceUsd * (1 + rand(-5, 5) / 1000);
            // realistic volume motion
            $coin->volumeUsd24Hr *= (1 + rand(-50, 50) / 1000);
            // expressive 24h change
            $coin->changePercent24Hr = rand(-1500, 1500) / 100;
            $this->data->{$symbol} = $coin;
        } 
    }
    public function sendData() {
        header('Content-Type: application/json');
        echo json_encode(['timestamp' => time(), 'data' => $this->data], JSON_PRETTY_PRINT);
    }
}
    
$coincap = new CoinCap();
if ( true === $coincap->loadHistory() ) {
    $coincap->updateData();    
}
else {
    $coincap->initialise();    
}
$coincap->saveHistory();
$coincap->sendData();