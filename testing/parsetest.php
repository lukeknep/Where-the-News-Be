<?
define('DB_NAME', 'db418777284');
define('DB_USER', 'dbo418777284');
define('DB_PASSWORD', 'SocialMedia');
define('DB_HOST', 'db418777284.db.1and1.com');

mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_select_db(DB_NAME);
?>

<?
	
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
	
	function substring($contents, $start_flag, $end_flag) {
		$index = strpos($contents, $start_flag);
		$endex = strpos($contents, $end_flag, $index);
		if($index && $endex) 
			$piece = substr($contents, $index + strlen($start_flag), $endex - $index - strlen($start_flag));
		else
			$piece = "";
		
		return $piece;
	}
	
	function parse_to_array($contents, $start_flag, $end_flag, $parse_elements) {
		$index = strpos($contents, $start_flag);
		$answer = array();
		
		while($index) {
			$piece = substring($contents, $start_flag, $end_flag);
			$elements = array();
			
			foreach($parse_elements as $key => $value) {
				$elements[$key] = substring($piece, $value[0], $value[1]);
			}
			
			array_push($answer, $elements);
			
			$contents = substr($contents, $index + 1);
			$index = strpos($contents, $start_flag);
		}
		
		return $answer;
	}
	
	$ap_parse_structure = array(
							"location" => array('<summary type="text">', ' (AP)'),
							"title" => array('<title type="text">', '</title>'),
							"summary" => array('<summary type="text">', '</summary>'),
							"time" => array('<published>', '</published>'),
							"link" => array('<link rel="alternate" type="text/html" title="AP Article" href="', '" />')
						  );  
	$ap_parse_flags = array('<entry>', '</entry>');
	
	$nyt_parse_structure = array(
						   	"location" => array('<category domain="http://www.nytimes.com/namespaces/keywords/nyt_geo">', '</category>'),
							"title" => array('<title>', '</title>'),
							"summary" => array('<description>', '&lt;'),
							"time" => array('<pubDate>', '</pubDate>'),
							"link" => array('<link>', '</link>')
						  );
	$nyt_parse_flags = array('<item>', '</item>');					   
	
	
	// The part that runs //
	$myFile = "../feeds.txt";
	$fh = fopen($myFile, 'r');
	
	$all_feeds = array();
	
	while($line = fgets($fh)) {
		if(strlen($line) > 0 && substr($line, 0, 1) != "#") {
			$pattern = "/([^\|]*)\|([^\|]*)\|(.*)/";
			preg_match($pattern, $line, $matches);
			$category = $matches[1];
			$source = $matches[2];
			$url = $matches[3];
			
			$feed = get_url_contents($url);
			
			$headlines = array();
			if($source == "AP News") {
				$headlines = parse_to_array($feed, $ap_parse_flags[0], $ap_parse_flags[1], $ap_parse_structure);
			} else if($source == "New York Times") {
				$headlines = parse_to_array($feed, $nyt_parse_flags[0], $nyt_parse_flags[1], $nyt_parse_structure);
			} else {
				// TODO bad source
			}
			
			foreach($headlines as $key => $article) {
				// find lat / long
				$city = $article["location"];
				if(strpos($city, ",")) {
					$city = substr($city, 0, strpos($city, ","));
				}
				
				$query = mysql_query('SELECT * FROM meta_location WHERE local_name LIKE "'.$city.'"');
				if(mysql_num_rows($query) > 0) {
					// found some
					$arr = array();
					if(mysql_num_rows($query) == 1) {
						// all good
						$arr = mysql_fetch_array($query);
					} else {
						// need to pick one
						// TODO improve
						$arr = mysql_fetch_array($query);
					}
					
					$headlines[$key]["latitude"] = $arr["geo_lat"];
					$headlines[$key]["longitude"] = $arr["geo_lng"];
				} else {
					// none found
					// TODO improve
					unset($headlines[$key]);
				}
				
				// add category
				$headlines[$key]["category"] = $category;
				$headlines[$key]["source"] = $source;
			}
			
			foreach($headlines as $headline) {
				array_push($all_feeds, $headline);
			}
		}
	}
	
	//print_r($all_feeds);
	echo json_encode($all_feeds);
?>