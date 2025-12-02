<?php 

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
file_put_contents($fname, $data);