<?php
header('Access-Control-Allow-Origin: *');
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
    // print $success ? $file : 'Unable to save the file.';
} else {
    $img = $_POST['base64Img'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $folderName.$_POST['name'];
    $success = file_put_contents($file, $data);
    //send request to ocr
    // print $success ? $file : 'Unable to save the file.';
}

// Call to API 
$tmpfsuitename = dirname(__FILE__).'/cookiesuitecrm.txt';
$fields = array();
$fields['user_name'] = 'admin';
$fields['username_password'] = 'pureandtrue2020*';
$fields['module'] = 'Users';
$fields['action'] = 'Authenticate';

$url = 'https://suitecrm.pure-electric.com.au/';
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_COOKIEJAR, $tmpfsuitename);
curl_setopt($curl, CURLOPT_POST, 1);//count($fields)
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($fields));
curl_setopt($curl, CURLOPT_COOKIEFILE, $tmpfsuitename);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_COOKIESESSION, TRUE);
curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.125 Safari/533.4");
$result = curl_exec($curl);
// 2 Calling CURL --- convert lead to quote
$request_data = array(
    'uid' => $_POST['quote_id'],
    'templateID' => "bedcbb3d-cf12-ba82-d861-5f61d2d16d54",
    'daikin_design' =>  'http://'.$_SERVER["HTTP_HOST"]."/files"."/".$_POST['quote_id']."/".$_POST['name'],
    'pre_install_photos_c' => $_POST['pre_install_photos_c'],
    'name_photo' => $_POST['name']
);

$source = "https://suitecrm.pure-electric.com.au/index.php?entryPoint=APIGeneratePDFDaikinTool";

curl_setopt($curl, CURLOPT_URL, $source);
curl_setopt($curl, CURLOPT_COOKIEJAR, $tmpfsuitename);
curl_setopt($curl, CURLOPT_POST, 1);//count($fields)
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($request_data));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl, CURLOPT_COOKIEFILE, $tmpfsuitename);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_COOKIESESSION, TRUE);
curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.125 Safari/533.4");
$result = curl_exec($curl);
curl_close($curl);

echo $result;

?>