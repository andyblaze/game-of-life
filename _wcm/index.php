<?php 

$f = file_get_contents('wc.svg');
$t = file_get_contents('towns.svg');
$svgs = str_replace('<!--towns-->', $t, $f);

$view = file_get_contents('wc.html');
$output = str_replace('{SVGS}', $svgs, $view);
echo $output;