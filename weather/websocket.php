<?php 

class WebSocket {
    private $server = null;
    private $client = null;
    public function create($address, $port) {
        $this->server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_set_option($this->server, SOL_SOCKET, SO_REUSEADDR, 1);
        socket_bind($this->server, $address, $port);
        socket_listen($this->server);
        $this->client = socket_accept($this->server);
    }
    public function handshake() {
        // Send WebSocket handshake headers.
        $request = socket_read($this->client, 5000);
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
        socket_write($this->client, $headers, strlen($headers));
    }
    public function write($data) {
        $response = chr(129) . chr(strlen($data)) . $data;
        socket_write($this->client, $response);
    }
}