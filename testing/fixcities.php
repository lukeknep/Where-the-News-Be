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
	$query = mysql_query("SELECT * FROM meta_location WHERE local_name REGEXP  '^.*\\r'");
	while($row = mysql_fetch_array($query)) {
		$local_name = $row['local_name'];
		echo $local_name." | ".strpos($local_name, "\r")." | ";
		$local_name = substr($local_name, 0, strpos($local_name, "\r"));
		echo $local_name." | ".strpos($local_name, "\r")." | "."<br />";
		echo "UPDATE meta_location SET local_name='$local_name' WHERE id=$row[id]<br />";
		mysql_query("UPDATE meta_location SET local_name=\"$local_name\" WHERE id=$row[id]");
	}
	echo "done";
?>

</body>
</html>