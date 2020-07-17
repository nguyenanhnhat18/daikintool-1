<?php

// Call to API 
$tmpfsuitename = dirname(__FILE__).'/cookiesuitecrm.txt';
$fields = array();
$fields['user_name'] = 'admin';
$fields['username_password'] = 'pureandtrue2020*';
$fields['module'] = 'Users';
$fields['action'] = 'Authenticate';

$url = 'http://new.suitecrm-pure.com/';
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
    // 'quote_id' => $_POST['quote_id'],
    // 'pre_install_photos_c' => $_POST['pre_install_photos_c'],
    'quote_id' => $_POST['quote_id'],
    'pre_install_photos_c' => 'cedf86b0-f013-478b-bcdd-23517df82b02',
);

$source = "http://new.suitecrm-pure.com/index.php?entryPoint=APIDownloadFilesFromSuiteToDaiKinDesignTool";

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
$listFile = json_decode($result, true);

if(count($listFile) > 0) {
    $url = 'http://new.suitecrm-pure.com/custom/include/SugarFields/Fields/Multiupload/server/php/files/cedf86b0-f013-478b-bcdd-23517df82b02/';
    $file_name = basename($url);
    $path = 'files/7aa738c7-2ddb-a29b-aedd-5e9fff3eec51/';
    $file_load = array();
    foreach($listFile as $file) {
        if (strpos($file, 'FloorPlan') !== false) {
            $file_name = basename($url.$file);
            if(file_put_contents( $path.$file_name,file_get_contents($url.$file))){
                $file_load[] = $path.$file_name;
            };
        }
    }
    echo json_encode($file_load);
} else {
    echo "éo có file nhé";
}

