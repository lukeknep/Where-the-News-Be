<?
define('DB_NAME', 'db418777284');
define('DB_USER', 'dbo418777284');
define('DB_PASSWORD', 'SocialMedia');
define('DB_HOST', 'db418777284.db.1and1.com');

mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_select_db(DB_NAME);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>City Search Test</title>
</head>

<body>

<?
	$myFile = "states_loc.txt";
	$fh = fopen($myFile, 'r');
	fgets($fh); // remove title line.
	$counter = 0;

	while($str = fgets($fh)) {
		// Format:
		// $str = "ad,bicisarri,BiÁisarri,06,,42.4833333,1.4666667";
			$pattern = "/([^,]*),([^,]*),([^,]*)/";
			preg_match($pattern, $str, $matches);
			print_r($matches);
			mysql_query("UPDATE meta_location SET geo_lat='$matches[2]', geo_lng='$matches[3]' WHERE iso='US-$matches[1]'");
			
	}

	fclose($fh);
	echo "done";
?>

</body>
</html>