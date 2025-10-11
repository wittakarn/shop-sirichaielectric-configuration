<?php
function removeAllFileInDirectory($path)
{
    $files = glob($path . '/*'); // get all file names
    foreach ($files as $file) { // iterate files
        if (is_file($file)) {
            unlink($file);
        }
        // delete file
    }
}

function writeFile($directory, $fileName, $file)
{
    $info = pathinfo($file['name']);
    $imagePath = $directory . $fileName;
    $uploadPath = $imagePath . '.' . $info['extension'];

    if (file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    move_uploaded_file($file['tmp_name'], $uploadPath);

    return $fileName . '.' . $info['extension'];
}

function writeFileWithoutMove($directory, $fileName, $file)
{
    $info = pathinfo($file['name']);
    $imagePath = $directory . $fileName;
    $uploadPath = $imagePath . '.' . $info['extension'];

    if (file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    copy($file['tmp_name'], $uploadPath);

    return $fileName . '.' . $info['extension'];
}

function deleteFile($fullPath)
{
    if (file_exists($fullPath)) {
        unlink($fullPath);
    }
}
