<?php 

$map = file_get_contents('__aaa.svg');//map.svg');
$routes = file_get_contents('routes.svg');
$towns = file_get_contents('towns.svg');
$svgs = $map . $routes . $towns; 

$view = file_get_contents('wc.html');
$output = str_replace('{SVGS}', $svgs, $view);
echo $output;