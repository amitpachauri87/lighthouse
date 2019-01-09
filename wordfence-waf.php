<?php
// Before removing this file, please verify the PHP ini setting `auto_prepend_file` does not point to this.

if (file_exists('/data/home/pdcisinl/public_html/lighthouse/wp-content/plugins/wordfence/waf/bootstrap.php')) {
	define("WFWAF_LOG_PATH", '/data/home/pdcisinl/public_html/lighthouse/wp-content/wflogs/');
	include_once '/data/home/pdcisinl/public_html/lighthouse/wp-content/plugins/wordfence/waf/bootstrap.php';
}
?>