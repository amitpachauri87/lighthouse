<?php 
/**
 * Bookings and Appointment Plugin for WooCommerce
 *
 * Class for adding Booking Fields In Voucher Template
 *
 * @author   Tyche Softwares
 * @package  BKAP/Addons
 * @category Classes
 * @class Booking_Information_In_Voucher_Template
 */

if (!class_exists('Booking_Information_In_Voucher_Template')) {

	/**
	 * Add Booking Information in Voucher Template
	 */
	class Booking_Information_In_Voucher_Template {

		public $plugin_version = '1.0';
		
		/**
		 * Construct
		 */
		public function __construct() {
		   
            // Add filter to replace voucher template shortcodes in download pdf
            add_filter('woo_vou_pdf_template_inner_html', array( &$this, 'woo_vou_pdf_template_replace_shortcodes'), 10, 6 );
        }
		
		/**
		 * Adding Custom shortcode value in PDF voucher
		 * 
		 * @param string $voucher_template_html - Voucher Template HTML
		 * @param integer $orderid - Order ID
		 * @param integer $item_key - Item ID
		 * @param WC_Order_Item $items - Item Details
		 * @param array $voucodes - Voucher short codes
		 * @param integer $productid - Product ID
		 * @return string $voucher_template_html - Updated Voucher Template
		 * 
		 * @hook woo_vou_pdf_template_inner_html
		 * @since 4.8.0
		 */
		public static function woo_vou_pdf_template_replace_shortcodes( $voucher_template_html, $orderid, $item_key, $items, $voucodes, $productid ) {

			// Creating order object for order id
			$order       = new WC_Order( $orderid );
			
			$order_items    =   $order->get_items();
			
			foreach( $order_items as $k => $v ) {
				// get buyerphone value
				$buyerstartdate =  isset( $v['wapbk_booking_date'] ) 	? $v['wapbk_booking_date'] 	: '';
				$buyerenddate 	=  isset( $v['wapbk_checkout_date'] ) 	? $v['wapbk_checkout_date'] : '';
				$buyertime 		=  isset( $v['wapbk_time_slot'] ) 		? $v['wapbk_time_slot'] 	: '';			
			}

			$bkap_date_format = apply_filters("bkap_change_date_format", "j.n.Y" ); // Change time format.
			
			$buyerstart_date_formatted  	= date_create_from_format( 'Y-m-d', $buyerstartdate );
			$start_date_format 				= date_format( $buyerstart_date_formatted, $bkap_date_format );

			$buyerend_date_formatted  		= date_create_from_format( 'Y-m-d', $buyerenddate );
			$end_date_format 				= date_format( $buyerend_date_formatted, $bkap_date_format );

			// replace {buyerphone} shortcode with actual value
			$voucher_template_html = str_replace( '{booking_start_date}', 	$start_date_format, $voucher_template_html );
			$voucher_template_html = str_replace( '{booking_end_date}', 	$end_date_format, 	$voucher_template_html );
			$voucher_template_html = str_replace( '{booking_timeslot}', 	$buyertime, 		$voucher_template_html );
			 
			return $voucher_template_html;
		}
	}
}
$booking_information_in_voucher_template = new Booking_Information_In_Voucher_Template();