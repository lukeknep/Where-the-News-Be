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
	$myFile = "feeds.txt";
	$fh = fopen($myFile, 'r');
	
	$all_feeds = array();
	
	while($line = fgets($fh)) {
		if(strlen($line) > 0 && substr($line, 0, 1) != "#") {
			$pattern = "/([^\|]*)\|([^\|]*)\|(.*)/";
			preg_match($pattern, $line, $matches);
			$category = $matches[1];
			$source = $matches[2];
			$url = $matches[3];
			
			echo "<a href='http://www.google.ca/reader/atom/feed/$url?n=2000'>$category $source</a><br />";
			
		}
	}
	
	//print_r($all_feeds);
?>