<?php

class Sensor {
    public function __construct() {}
    // Generates a new reading (to be overridden)
    public function read(): int {
        // Base version returns nothing meaningful
        return 0;
    }
}

class TemperatureSensor extends Sensor {
    public function read(): int {
        return mt_rand(-10, 30);
    }
}

class WindspeedSensor extends Sensor {
    public function read(): int {
        return round(mt_rand(1, 30) / 0.44704);
    }
}

class SensorArray {
    private $sensors = [];
    public function __construct(array $sensors) {
        $this->sensors = $sensors;
    }
    public function read():string {
        $result = [];
        foreach ( $this->sensors as $label=>$s ) {
            $result[$label] = $s->read(); 
        }
        return json_encode($result);
    }
}

// Usage
$sensors = new SensorArray([
    'temp'=>new TemperatureSensor(),
    'wind'=>new WindspeedSensor()
]);

$address = '127.0.0.1';
$port = 8080;

// Create WebSocket. 

$server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($server, $address, $port);
socket_listen($server);
$client = socket_accept($server);

// Send WebSocket handshake headers.
$request = socket_read($client, 5000);
preg_match('#Sec-WebSocket-Key: (.*)\r\n#', $request, $matches);
$key = base64_encode(pack(
    'H*',
    sha1($matches[1] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
));
$headers = "HTTP/1.1 101 Switching Protocols\r\n";
$headers .= "Upgrade: websocket\r\n";
$headers .= "Connection: Upgrade\r\n";
$headers .= "Sec-WebSocket-Version: 13\r\n";
$headers .= "Sec-WebSocket-Accept: $key\r\n\r\n";
socket_write($client, $headers, strlen($headers));

// Send messages into WebSocket in a loop.
while (true) {
    sleep(1);
    $content = $sensors->read();
    $response = chr(129) . chr(strlen($content)) . $content;
    socket_write($client, $response);
}