PHP testing now

<?
	$url = "http://hosted2.ap.org/atom/APDEFAULT/3d281c11a96b4ad082fe88aa0db04305";
	
	function get_url_contents($url){
        $crl = curl_init();
        $timeout = 5;
        curl_setopt ($crl, CURLOPT_URL,$url);
        curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
        $ret = curl_exec($crl);
        curl_close($crl);
        return $ret;
	}
	
	echo get_url_contents($url);
?>