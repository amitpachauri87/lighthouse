/**
 * This function allows to dismiss the notices which are shown from the plugin.
 *
 * @namespace orddd_notice_dismissible
 * @since 6.8
 */
// Make notices dismissible
jQuery(document).ready( function() {

	/**
	 * Dismiss BKAP TS tracking notice
	 */
	
	jQuery('.bkap-tracker').on( 'click', 'button.notice-dismiss', function(){
		
		// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
		var admin_url 	= jQuery( "#admin_url" ).val();
		ajaxurl 		= admin_url + "admin-ajax.php";

		var data = {
			action: "bkap_admin_notices"
		};
		
		jQuery.post( ajaxurl, data, function( response ) {
		});
	});

	/**
	 * Dismiss GDPR notice
	 */

	jQuery('.bkap-privacy-notice').on( 'click', 'button.notice-dismiss', function(){
		
		// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
		var admin_url 	= jQuery( "#admin_url" ).val();
		ajaxurl 		= admin_url + "admin-ajax.php";

		var data = {
	 		notice: "bkap-privacy-notice",
			action: "bkap_dismiss_admin_notices"
		};
		
		jQuery.post( ajaxurl, data, function( response ) {
		});
	});
	
});