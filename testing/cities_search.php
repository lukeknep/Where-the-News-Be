<?
define('DB_NAME', 'db418777284');
define('DB_USER', 'dbo418777284');
define('DB_PASSWORD', 'SocialMedia');
define('DB_HOST', 'db418777284.db.1and1.com');

mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_select_db(DB_NAME);

function getJSONfromQuery($query, $id_string) {
	$arr = array();
	while($row = mysql_fetch_array($query)) {
		$arr[$row[$id_string]] = $row;
	}
	
	return json_encode($arr);
}


$str = mysql_escape_string($_POST['text']);
$result = mysql_query("SELECT * FROM cities WHERE cityname = '$str'");

echo getJSONfromQuery($result, "id");

?>