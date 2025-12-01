<?php 

function rep($from, $to, $d) {
    return str_replace($from, $to, $d);
}

$data = file_get_contents('view-data.json');

$data = rep(',{"time', ",\n{\"time", $data);

$data = rep('","data"', "\",\n\"data\"", $data);

$data = rep('data":{"string', "data\":{\n\t\"string", $data);

$data = rep('","array', "\",\n\t\"array", $data);

$data = rep('data":{"left', "data\":{\n\t\"left", $data);
$data = rep(',"right":', ",\n\t\"right\":", $data);

file_put_contents('view-data.json', $data);