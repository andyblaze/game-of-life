<?php

class Sensor {
    protected string $name;

    public function __construct(string $name) {
        $this->name = $name;
    }

    // Generates a new reading (to be overridden)
    public function read(): array {
        // Base version returns nothing meaningful
        return [
            'name' => $this->name,
            'value' => null,
            'timestamp' => time()
        ];
    }
}

class TemperatureSensor extends Sensor {

    public function read(): array {
        $temp = rand(-100, 350) / 10; // -10°C to 35°C
        return [
            'name' => $this->name,
            'value' => $temp,
            'unit' => 'C',
            'timestamp' => time()
        ];
    }
}

// Usage
$tempSensor = new TemperatureSensor('Temp1');

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
    $content = $tempSensor->read();
    $response = chr(129) . chr(strlen($content)) . $content;
    socket_write($client, $response);
}