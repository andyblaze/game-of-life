<?php
// add-town.php

header("Content-Type: application/json");

// --- CONFIG ---
$townsFile = 'towns.svg';
$radius = 9;
$labelOffsetX = 0;
$labelOffsetY = 0;

// --- READ INPUT ---
$raw = file_get_contents($townsFile);
$data = $_POST;

if (!$data || !isset($data["x"], $data["y"], $data["placeName"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$x = (int)$data["x"];
$y = (int)$data["y"];
$name = trim($data["placeName"]);

// You said you'd handle sanitising → trusting you 🙂
$id = strtolower(str_replace(" ", "-", $name));

// --- LOAD SVG ---
$svg = file_get_contents($townsFile);
if ($svg === false) {
    http_response_code(500);
    echo json_encode(["error" => "Could not read towns.svg"]);
    exit;
}

// --- BUILD TOWN SVG ---
$townSvg = "<g class=\"town\" id=\"{$id}\" data-name=\"{$name}\">
\t<text x=\"{$x}\" y=\"{$y}\">{$name}</text>
</g>\n";



// --- INSERT BEFORE </svg> ---
if (strpos($svg, "</svg>") === false) {
    http_response_code(500);
    echo json_encode(["error" => "Invalid SVG file"]);
    exit;
}

$svg = str_replace("</svg>", $townSvg . "</svg>", $svg);

// --- WRITE BACK ---
if (file_put_contents($townsFile, $svg) === false) {
    http_response_code(500);
    echo json_encode(["error" => "Could not write towns.svg"]);
    exit;
}

// --- DONE ---
echo json_encode([
    "success" => true,
    "name" => $name,
    "x" => $x,
    "y" => $y
]);
