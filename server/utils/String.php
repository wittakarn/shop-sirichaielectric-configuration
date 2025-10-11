<?php
function convertObjectsToCamelCase($objects)
{
    if (is_bool($objects)) {
        return $objects;
    }
    foreach ($objects as $index => $row) {
        if (is_array($row)) {
            foreach ($row as $key => $value) {
                $results[$index][convertStringToCamelCase($key)] = is_array($value) ? convertObjectToCamelCase($value) : $value;
            }
        } else {
            $results[convertStringToCamelCase($index)] = $row;
        }
    }
    return isset($results) ? $results : $objects;
}

function convertObjectToCamelCase($objects)
{
    $results = null;
    if (sizeof($objects) > 0) {
        foreach ($objects as $key => $value) {
            $results[convertStringToCamelCase($key)] = is_array($value) ? convertObjectToCamelCase($value) : $value;
        }
    }
    return $results;
}

function convertStringToCamelCase($key)
{
    return lcfirst(implode('', array_map('ucfirst', explode('_', $key))));
}

function mapNameDisplay($name)
{
    $nameDisplay = trim(preg_replace("/\[.*?\]|\{.*?\}/", "", $name));

    return $nameDisplay;
}

function mapUrlName($name)
{
    $urlName = trim(preg_replace("/\[.*?\]|\{.*?\}/", "", $name));
    $urlName = preg_replace("/\"|'| |\+|\/|\\\|%/", "-", $urlName);
    $urlName = preg_replace("/\./", "-", $urlName);

    return $urlName;
}

function removeMultipleSpaceWithOneSpace($input)
{
    if ($input) {
        return preg_replace("/\s+/", " ", trim($input));
    }
    return $input;
}
