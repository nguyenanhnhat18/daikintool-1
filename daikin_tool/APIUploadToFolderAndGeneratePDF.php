<?php

    // $path     = $_SERVER["DOCUMENT_ROOT"];
$path     = $_SERVER["DOCUMENT_ROOT"] .'/files';
$quote_id = $_POST['quote_id'];
$folderName   = $path . '/' . $quote_id .'/';


if (!file_exists($folderName)) {
    mkdir($folderName, 0777, true);
    $img = $_POST['base64Img'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $folderName.$_POST['name'];
    $success = file_put_contents($file, $data);
    //send request to ocr
    print $success ? $file : 'Unable to save the file.';
} else {
    $img = $_POST['base64Img'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $folderName.$_POST['name'];
    $success = file_put_contents($file, $data);
    //send request to ocr
    print $success ? $file : 'Unable to save the file.';
}




?>