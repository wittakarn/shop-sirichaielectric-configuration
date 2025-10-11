<?php

function generateQuotNo($year, $sequence) {
    return $year . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
}