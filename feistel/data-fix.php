<?php 

function replace($from, $to, $d) {
    return str_replace($from, $to, $d);
}
$fname = 'view-data.json';
$changes = [
    ['{"encrypt":[', "{\"encrypt\":[\n"],
    ['{"decrypt":[', "{\"decrypt\":[\n"],
    [',{"time', ",\n{\"time"],
    ['","data"', "\",\n\"data\""],
    ['data":{"string', "data\":{\n\t\"string"],
    ['","array', "\",\n\t\"array"],
    ['data":{"left', "data\":{\n\t\"left"],
    [',"right":', ",\n\t\"right\":"]
];
$data = file_get_contents($fname);
foreach ( $changes as $change) {
    list($from, $to) = $change;
    $data = str_replace($from, $to, $data);
}

/*$data = rep('{"encrypt":[', "{\"encrypt\":[\n", $data);
$data = rep('{"decrypt":[', "{\"decrypt\":[\n", $data);

$data = rep(',{"time', ",\n{\"time", $data);

$data = rep('","data"', "\",\n\"data\"", $data);

$data = rep('data":{"string', "data\":{\n\t\"string", $data);

$data = rep('","array', "\",\n\t\"array", $data);

$data = rep('data":{"left', "data\":{\n\t\"left", $data);
$data = rep(',"right":', ",\n\t\"right\":", $data);*/

file_put_contents($fname, $data);