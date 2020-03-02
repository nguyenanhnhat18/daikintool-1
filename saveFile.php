<?php 

//VUT-BUTTON SAVE
$invoiceID = $_REQUEST['record_id'];
$data = $_REQUEST['photo'];
list($type, $data) = explode(';', $data);
list(,$data) = explode(',', $data);
$data = base64_decode($data);
if(!is_dir($invoiceID)) {
    mkdir($invoiceID);
}
list($type, $extImage) = explode('/', $type);
$newfilename = round(microtime(true)).'_daikintool.'.$extImage;
$destionation = dirname(__FILE__)."/".$invoiceID."/".$newfilename;
file_put_contents($destionation,$data);