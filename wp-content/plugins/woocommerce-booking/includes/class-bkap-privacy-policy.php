<?php
/**
 * Export Booking data in 
 * Dashboard->Tools->Export Personal Data
 * 
 * @since 4.9.0
 */
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

if ( !class_exists('Bkap_Privacy_Policy' ) ) {

    /**
     * Export Booking data in
     * Dashboard->Tools->Export Personal Data
     */
    class Bkap_Privacy_Policy {
    
        /**
         * Construct
         * @since 4.9.0
         */ 
        public function __construct() {
            
            add_filter( "woocommerce_privacy_export_order_personal_data_props", array( &$this, "bkap_privacy_export_order_personal_data_props" ), 10, 2 );

            add_filter( "woocommerce_privacy_export_order_personal_data_prop", array( &$this, "bkap_privacy_export_order_personal_data_prop_callback"), 10, 3 );

            add_action( 'admin_notices',                        array( &$this, 'bkap_privacy_admin_notices' ) );
            add_action( 'wp_ajax_bkap_dismiss_admin_notices',   array( &$this, 'bkap_dismiss_admin_notices' ) );

        }

        /**
         * Showing Privacy Policy notice on admin end on 0-15-45 days intervals
         * 
         * @since 4.9.0
         *
         * @hook admin_notices
         */

        public function bkap_dismiss_admin_notices() {
            
            if ( isset( $_POST[ 'notice' ] ) && $_POST[ 'notice' ] == 'bkap-privacy-notice' ) {
                update_option( 'bkap_privacy_notice', "dismissed" );                
            }
        }

        /**
         * Showing GDPR Privacy Policy notice on admin end.
         * 
         * @since 4.9.0
         *
         * @hook admin_notices
         */ 

        function bkap_privacy_admin_notices() {           

            if ( isset( $_GET['action'] ) && $_GET['action'] == "calendar_sync_settings" ){                
                echo '<div class="notice notice-warning"><p>';
                echo bkap_common::bkap_privacy_notice();
                echo '</p></div>';
            } else {

                $bkap_privacy_notice = get_option( 'bkap_privacy_notice' );
                
                if ( !$bkap_privacy_notice && "dismissed" != $bkap_privacy_notice ) {               
                    echo '<div class="notice notice-warning bkap-privacy-notice is-dismissible"><p>';
                    echo bkap_common::bkap_privacy_notice();
                    echo '</p></div>';
                }
            }
        }

        /**
         * Adding Booking Details lable to personal data exporter order table
         *
         * @param array $props_to_export array of the order property being exported
         * @param object $order WooCommerce Order Post
         * 
         * @since 4.9.0
         *
         * @hook woocommerce_privacy_export_order_personal_data_props
         */


        public static function bkap_privacy_export_order_personal_data_props( $props_to_export, $order ) {

            $my_key_value   = array( 'items_booking' => __( 'Items Booking Details', 'woocommerce-booking') );
            $key_pos        = array_search( 'items', array_keys( $props_to_export ) );
            
            if ( $key_pos !== false ) {
                $key_pos++;
                
                $second_array       = array_splice( $props_to_export, $key_pos );        
                $props_to_export    = array_merge( $props_to_export, $my_key_value, $second_array );
            }
            return $props_to_export;
        }

        /**
         * Adding Booking Details value to personal data exporter order table
         *
         * @param string $value 
         * @param stringn $prop key of the exported data
         * @param object $order WooCommerce Order Post
         * 
         * @since 4.9.0
         *
         * @hook woocommerce_privacy_export_order_personal_data_props
         */

        public static function bkap_privacy_export_order_personal_data_prop_callback( $value, $prop, $order ) {

            if ( $prop == "items_booking" ) {

                $date_format    = get_option('date_format');
                $item_names     = array();

                foreach ( $order->get_items() as $item => $item_value ) {

                    $product_id   = $item_value[ 'product_id' ];      
                    $is_bookable  = bkap_common::bkap_get_bookable_status( $product_id );

                    if( $is_bookable ) {

                        $value_string   = $item_value->get_name() . ' x ' . $item_value->get_quantity();
                        $item_meta      = $item_value->get_meta_data();
                                 
                        $booking_time           = "";
                        $booking_date_form      = "";
                        $booking_end_date_form  = "";
                        
                        foreach( $item_meta as $meta_data ) {    

                            if ( '_wapbk_booking_date' == $meta_data->key ) {
                                $booking_date = $meta_data->value;
                                $booking_date_form = date( $date_format, strtotime( $booking_date ) );                    
                            }
                                            
                            if ( '_wapbk_checkout_date' == $meta_data->key ) {
                                $booking_end_date = $meta_data->value;
                                $booking_end_date_form = date( $date_format, strtotime( $booking_end_date ) );
                            }

                            if( '_wapbk_time_slot' == $meta_data->key ) {
                                $booking_time = $meta_data->value;
                            } 
                        }

                        $booking_details = $booking_date_form." ".$booking_end_date_form." ".$booking_time;

                        $value_string .= " -- ".$booking_details; 
                        $item_names[] = $value_string;
                    }       
                }
                $value = implode( ', ', $item_names );
            }
            return $value;
        }
    } // end of class
    $Bkap_Privacy_Policy = new Bkap_Privacy_Policy();
} // end if
?>