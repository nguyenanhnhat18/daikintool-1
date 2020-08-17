<?php
 define('UPLOAD_DIR', 'quotes/');
 // previously it was $img = $_POST['data']
 $img = $_POST['base64Img'];
 $img = str_replace('data:image/png;base64,', '', $img);
 $img = str_replace(' ', '+', $img);
 $data = base64_decode($img);
 $file = UPLOAD_DIR . $_POST['QuoteId'];
 $success = file_put_contents($file, $data);
 //send request to ocr
 print $success ? $file : 'Unable to save the file.';
?>