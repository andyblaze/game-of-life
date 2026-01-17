<?php

function clamp(float $value, float $min, float $max): float {
    return max($min, min($max, $value));
}