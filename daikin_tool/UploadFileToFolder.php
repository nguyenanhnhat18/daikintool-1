<?php

// $path     = $_SERVER["DOCUMENT_ROOT"];
$path     = $_SERVER["DOCUMENT_ROOT"] .'/files';
$quote_id = $_POST['quote_id'];
$folderName   = $path . '/' . $quote_id .'/';


if (!file_exists($folderName)) {
    mkdir($folderName, 0777, true);
    if(count($_FILES['floor_image']['tmp_name']) > 0) {
        for($i = 0; $i < count($_FILES['floor_image']['tmp_name']); $i++) {
            if($_FILES['floor_image']['name'][$i] != ""){
                $varImage = generateRandomString();
                $file_type = basename('PlanFloor_'.$varImage.'_'.$i.'.'.pathinfo($_FILES['floor_image']['name'][$i], PATHINFO_EXTENSION));
                copy($_FILES['floor_image']['tmp_name'][$i], $folderName.$file_type);
            };
        }
    };
} else {
    if(count($_FILES['floor_image']['tmp_name']) > 0) {
        for($i = 0; $i < count($_FILES['floor_image']['tmp_name']); $i++) {
            if($_FILES['floor_image']['name'][$i] != ""){
                $varImage = generateRandomString();
                $file_type = basename('PlanFloor_'.$varImage.'_'.$i.'.'.pathinfo($_FILES['floor_image']['name'][$i], PATHINFO_EXTENSION));
                copy($_FILES['floor_image']['tmp_name'][$i], $folderName.$file_type);
            };
        }
    };
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}