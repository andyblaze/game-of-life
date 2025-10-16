<?php 
function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}
class CoinCap {
    private $histFile = 'history.json';
    private $coinsFile = 'coins.json';
    private $rangeFile = 'ranges.json';
    private $data = [];
    public function loadHistory() {
        if ( file_exists($this->histFile) ) {
            $this->data = (array)json_decode(file_get_contents($this->histFile));
            return true;
        }
        return false;
    }
    public function initialise() {
        $coins = json_decode(file_get_contents($this->coinsFile)); 
        $ranges = json_decode(file_get_contents($this->rangeFile));
        foreach ( $coins as $id=>$coin ) {
            $pricerange = $ranges[$id]->pricerange;
            $this->data[$coin->symbol] = (object)[
                "id"=>$coin->id,
                "price"=>round(mt_rand($pricerange->min * 10000, $pricerange->max * 10000) / 10000, 4)
            ];
        }
        $this->saveHistory();
    }
    public function saveHistory() {
        file_put_contents($this->histFile, json_encode($this->data, JSON_PRETTY_PRINT));    
    }
    public function updateData() {
        foreach ( $this->data as $symbol=>$coin ) {
            $last = $coin->price;
            $delta = $last * (mt_rand(-100, 100) / 10000); // ±1%
            $coin->price = round($last + $delta, 4);
            $coin->changePercent24Hr = round(($delta / $last) * 100, 2);
            $this->data[$symbol] = $coin;
        }
    }
    public function sendData() {
        header('Content-Type: application/json');
        echo json_encode(['timestamp' => time(), 'data' => array_values($this->data)], JSON_PRETTY_PRINT);
    }
}
    
$coincap = new CoinCap();
if ( true === $coincap->loadHistory() ) {
    $coincap->updateData();    
    $coincap->saveHistory();
}
else {
    $coincap->initialise();
}
$coincap->sendData();