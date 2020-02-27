<?php

	header('Access-Control-Allow-Origin: *');
    ini_set('memory_limit', '-1');

	$tmpfsuitename = dirname(__FILE__).'/cookiesrealestate.txt';
	$address = "21 Canberra Rd, Toorak, VIC 3142";
	//$address = $_REQUEST['full_address'];
	$address = strtolower(str_replace(" ","-",str_replace(",","",$address)));
	
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, 'https://www.realestate.com.au/property/'.$address.'?source=property-search-p4ep');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	//curl_setopt($ch, CURLOPT_COOKIEJAR, $tmpfsuitename);
	curl_setopt($ch, CURLOPT_COOKIEFILE, $tmpfsuitename);
	curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,10); 
	curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE); 
	curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE); 
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
	$headers = array();
	$headers[] = 'Host: www.realestate.com.au';
	$headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0';
	$headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
	$headers[] = 'Accept-Language: en-US,en;q=0.5';
	$headers[] = 'Accept-Encoding: gzip, deflate, br';
	$headers[] = 'Connection: keep-alive';
	//$headers[] = 'Cookie: ak_bmscz=HuiUjnzsC1cyPa8ptuni5Q%3D%3D%3A%3AKU5ombhDhdEGYc4oMKb%2B1gi0Hs4ztMIpE1xHrHMYdtWmf4kgZkEenwzdVZwwYNkOOT97keFqtElmjoUibfG89HuGKAB4A4LkRy06YwAObeGOcGx16b3Em8XCOvB61bmi7zmYUFALLcfVh%2BavBfVmxt%2Fn1vuXQrzYdTl1h%2BYvxFFBQQTZRCT6abMcuR9SKSq2ZMLIGelI12tqdvR0oGKtSpWP8a47F%2B2%2Fl2CC1cgVaTaL7kVqKKEA5pyjlZXnY%2FQOSSQXnBKskb2PhZ5t5kj%2B6X1FFTbKgTejeoDHDgEwzNtrn7EyF3%2F%2BPgL4X2Xa45%2F3GgjJvrR4cwAYoSibFCZVQNPEmwR2JIUYxbyFL5fveKct78NfvCcBs1mqa3tEcBXc6QKdts7AI35h0mYBx93G0MtH%2B97A0pwWJlVcE5UN8NTMZgkqfDyppPfe6tVUOHsFTfuAhku3n3K8tu%2BDj3zDK3Hzlk7DWE9MBmC0PwuI%2Flw%3D; reauid=89eaab7122480000d0f3545efb000000cc130000; smartHide=true; smartHideRN=5528; optimizelyEndUserId=oeu1582625744614r0.6716807523157589; AMCV_341225BE55BBF7E17F000101%40AdobeOrg=-1891778711%7CMCIDTS%7C18320%7CMCMID%7C33986629169665474564617500573131697731%7CMCAID%7C2F2A79EA8515DEA8-4000084E83AD6E42%7CMCOPTOUT-1582780132s%7CNONE%7CMCAAMLH-1583230549%7C3%7CMCAAMB-1583377732%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CvVersion%7C2.4.0%7CMCSYNCSOP%7C411-18325; utag_main=v_id:01707bd86a2300009eb4adbbcff80104e006100d009dc$_sn:3$_ss:0$_st:1582774767143$ses_id:1582772932904%3Bexp-session$_pn:2%3Bexp-session; s_vi=[CS]v1|2F2A79EA8515DEA8-4000084E83AD6E42[CE]; s_ecid=MCMID%7C33986629169665474564617500573131697731; _sp_id.2fe7=21d67d7d-5b10-4ffe-92d0-e5f4a5678f25.1582625748.2.1582772972.1582626006.e8d96bef-19b8-44f4-9c08-30cec7b9c7d4; mid=17393391647093850029; s_nr=1582626002667; VT_LANG=language%3Den-US; _fbp=fb.2.1582625763040.1556790807; External=%2FAPPNEXUS%3D0%2FCASALE%3D0%2F_EXP%3D1614308951%2F_exp%3D1614308987; KP_UIDz=LoV0ImHM04LuMd9zpbN6Qw%3D%3D%3A%3AF3sWONjqr2LuMHAH%2FwNYq8j73W%2BRjUXnW9v%2FEwrXywcW5N9zYwqM2zgWyfp8dGnQDDWUx%2FUvtNIsfKH355DYhP6SrrWMeg3T%2BpPWyw54w3tOKCUJJxN0038EAaH8duiy7EDSBXdumfuVOpC4IHHzTUdyHW9bNZClu8ZDf4LqD7sOYYGPZvfPHtAkynsf1e3K9lcDIpXj%2BNrCD2%2BedW3%2FMbsCNA6sWckAYxcWjXzwUlxX%2Fig5tjra5nrsfkAoK26zmWTDylHEFCFS87IDKvn43CDMusFwmf7UHjwyhbPVOL3kXeymNsAZQZZioHejwlHyugCjF%2BQ7zPxum2RX8dUfLHI9ZxQBGLvYfvhkN0z4VfAI1v7MvR2LwwkrzFQEhICL7eNvPeJhtlDO3iJAn%2FjBqihrNRaZdtk6eKkY%2FwMWHA0KQwOjmJd0lmRaeP8IOt40BET35mj7VaKQJwPb9kkW9qppinpsmCxWkuEr78K8gSM%3D; contentCarousel=true; contentCarouselRN=5740; Country=VN; ak_bmcs=4c68c3af-c3a4-035c-e6e0-3888d36a0196; AMCVS_341225BE55BBF7E17F000101%40AdobeOrg=1; _stc=typedBookmarked; s_cc=true; Country=VN; _sp_ses.2fe7=*; Hint=i-0758e5017111e9974; QSI_SI_23iXQPqpOfMSBH7_intercept=true';

	$headers[] = 'Upgrade-Insecure-Requests: 1';
	$headers[] = 'Pragma: no-cache';
	$headers[] = 'Cache-Control: no-cache';
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$result = curl_exec($ch);
	curl_close($ch);

	$result_matches = preg_match('/REA.allImages = (.*?);/', $result, $output_array);
	$images_arr = [];
	if(count($output_array) > 1){
		$json_return = json_decode($output_array[1]);
		$i = 0;
		mkdir($address);
		foreach($json_return as $img){
			$images_arr[$i] = $img->server.'/600x800-resize,extend,r=33,g=40,b=46'.$img->uri;
			$a = explode("/",$img->uri);
			
			$a = copy($images_arr[$i], dirname(__FILE__).'/'.$address.'/'.$a[2]);
			$i++;
		}
		
		print_r($images_arr);die;
	}
?>