<?php
/**
 * Booking & Appointment Plugin for WooCommerce
 *
 * This file contains all the generic function used in the booking plugin to calculating bookings, availability etc
 *
 * @author      Tyche Softwares
 * @category    Core
 * @package     BKAP/Global-Function
 * @version     4.0.0
 */


/**
 * This functions is for getting an array of dates that are locked
 *
 * @since 4.0.0
 * @global object $wpdb Global wpdb Object
 * @param int $product_id Product ID
 * @param string $min_date Date
 * @param string $days Day number
 * @return array $booked_dates Returns array of dates in j-n-Y format
 */

function bkap_get_lockout( $product_id, $min_date, $days ) {
    
    if ( absint( $days ) > 0 ) {
        $end_date = date( 'YmdHis', strtotime( $min_date . "+$days days" ) );
    } else {
        $end_date = $days;
    }

    $dates              = get_bookings_for_range( $product_id, $min_date, $end_date, true );
    $booked_dates       = array(); // default the booked dates array
    $specific_dates     = get_post_meta( $product_id, '_bkap_specific_dates', true ); // get the specific dates lockout
    $recurring_lockout  = get_post_meta( $product_id, '_bkap_recurring_lockout', true ); // get the weekdays lockout
    $booking_type       = get_post_meta( $product_id, '_bkap_booking_type', true ); // check the booking type
    
    // once we have a list of the dates, we need to see if bookings for any date have reached the lockout
    foreach ( $dates as $d_key => $d_value ) {
        
        $jny_format             = date( 'j-n-Y', strtotime( $d_key ) );
        $total_timeslot_lockout = '';
        
        // Based on the booking type, get the final bookings done for a date
        if ( 'only_day' === $booking_type ) {
            $total_bookings = $d_value;
        } else if ( 'date_time' === $booking_type ) {
            $total_bookings = 0;

            foreach ( $d_value as $time_slot => $bookings ) {
                $total_bookings += $bookings;
            }
        }
        
        if ( array_key_exists( $jny_format, $specific_dates ) ) { // specific date lockout has been set
            $date_lockout = $specific_dates[ $jny_format ];
            
            if ( absint( $date_lockout ) > 0 && $total_bookings >= $date_lockout ) // lockout reached
                $booked_dates[] = $jny_format;
            
        } else { // recurring weekday lockout
            $weekday = date( 'w', strtotime( $d_key ) );
            $weekday = "booking_weekday_$weekday";
            
            if ( 'date_time' === $booking_type ){
                $total_timeslot_lockout = bkap_get_total_timeslot_maximum_booking ( $product_id, $weekday );
            }

            if ( absint( $recurring_lockout[ $weekday ] ) > 0 && $total_bookings >= $recurring_lockout[ $weekday ] ) {
                // weekday lockout reached
                $booked_dates[] = $jny_format;
            } elseif ( $total_timeslot_lockout == $total_bookings ) {
                $booked_dates[] = $jny_format;
            }
        }
    }
    
    return $booked_dates;
}

/**
 * This function will calculate the total maximum booking for timeslot.
 *
 * @since 4.5.0
 * @param int $product_id Product ID
 * @param string $weekday Weekday
 * @global object $wpdb Global wpdb Object
 * 
 * @return $tatal Blank if unlimited booking for any one timeslot else total of max bookings for all timeslot.
 */

function bkap_get_total_timeslot_maximum_booking( $product_id, $weekday ) {
    global $wpdb;

    $total = '';

    $unlimited          =   "SELECT available_booking FROM `" . $wpdb->prefix . "booking_history`
                              WHERE post_id= %d
                              AND weekday = %s
                              And start_date = '0000-00-00'
                              AND from_time != ''
                              AND total_booking <= 0";
    $unlimited_results  = $wpdb->get_results( $wpdb->prepare( $unlimited, $product_id, $weekday ) );

    if( empty( $unlimited_results ) ){
        $date_lockout       =   "SELECT SUM(total_booking) FROM `" . $wpdb->prefix . "booking_history`
                              WHERE post_id= %d
                              AND weekday = %s
                              And start_date = '0000-00-00'
                              AND from_time != ''";
        $results_date_lock  = $wpdb->get_results( $wpdb->prepare( $date_lockout, $product_id, $weekday ) );

        $total              = $results_date_lock[0]->{'SUM(total_booking)'};
    }    

    return $total;
}

/**
 * This function will calculate the check-in dates that are booked for multiple
 *
 * @since 4.5.0
 * @param int $product_id Product ID
 * @param string $min_date Min_date
 * @param string $days Number of days
 * 
 * @return array $booked_dates Array of the booked dates
 */

function bkap_get_booked( $product_id, $min_date, $days ) {

    // check the booking type
    $booking_type = get_post_meta( $product_id, '_bkap_booking_type', true );
     
    if ( 'multiple_days' === $booking_type ) {
        
        if ( absint( $days ) > 0 ) {
            $end_date = date( 'YmdHis', strtotime( $min_date . "+$days days" ) );
        } else {
            $end_date = $days;
        }
        // get bookings for that range
        $dates = get_bookings_for_range( $product_id, $min_date, $end_date, true );
        // get the dates which have reached lockout
        $booked_dates = get_booked_multiple( $product_id, $dates );        
    }
    
    return $booked_dates;    
}

/**
 * This function will calculate the check-out dates that are booked for multiple
 *
 * @param int $product_id Product ID
 * @param string $min_date Min_date
 * @param string $days Number of days
 * @since 4.5.0
 * 
 * @return array $booked_dates Array of the booked dates
 * @todo The same function is written bkap_get_booked. check why it is saperatly written.
 */

function bkap_get_booked_checkout( $product_id, $min_date, $days ) {

    // check the booking type
    $booking_type = get_post_meta( $product_id, '_bkap_booking_type', true );
     
    if ( 'multiple_days' === $booking_type ) {
        
        if ( absint( $days ) > 0 ) {
            $end_date = date( 'YmdHis', strtotime( $min_date . "+$days days" ) );
        } else {
            $end_date = $days;
        }
        // get bookings for that range
        $dates = get_bookings_for_range( $product_id, $min_date, $end_date, false );
        // get the dates which have reached lockout
        $booked_dates = get_booked_multiple( $product_id, $dates );
    }
    
    return $booked_dates;
    
}

/**
 * Function to calculate dates and/or time slots with the number of bookings received in the date range.
 *
 * @param int $product_id Product ID
 * @param string $min_date Min_date
 * @param string $end_date Date
 * @param boolean $include_start Pass true if checkout date should be consider
 * @since 4.5.0
 * 
 * @return array $dates Array of Date and/or Timeslot with the number of booking received in the date range.
 */

function get_bookings_for_range( $product_id, $min_date, $end_date, $include_start = true ) {
    
    // get all the bookings IDs and start & end booking times for the given product ID from post meta
    $args = array(  'post_type' => 'bkap_booking',
        'post_status' => array( 'paid', 'pending-confirmation', 'confirmed' ),
        'meta_query'  => array(
            array(
                'key' => '_bkap_product_id',
                'value' => $product_id,
            ),
            array(
                'key' => '_bkap_start',
                'value' => date( 'YmdHis', strtotime( $min_date ) ),
                'compare' => '>='
            ),
            array(
                'key' => '_bkap_end',
                'value' => $end_date,
                'compare' => '<='
            )
        ),
        'posts_per_page' => -1
    );
    
    $dates = array();
    
    $query = new WP_Query( $args );
    
    if ( $query->have_posts() ) {    
        
        $booking_type       = get_post_meta( $product_id, '_bkap_booking_type', true ); // check the booking type
        $booking_settings   = get_post_meta( $product_id, 'woocommerce_booking_settings', true ); // booking settings for rental charges
        
        while( $query->have_posts() ) :
    
        $query->the_post();
    
        $booking_id     = $query->post->ID;
        $start_date     = get_post_meta( $booking_id, '_bkap_start', true );
        $end_date       = get_post_meta( $booking_id, '_bkap_end', true );    
        $qty            = get_post_meta( $booking_id, '_bkap_qty', true );
        $start          = substr( $start_date, 0, 8 );
    
        switch( $booking_type ) {
            case 'only_day':
                if ( array_key_exists( $start, $dates ) ) {
                    $dates[ $start ] += $qty;
                } else {
                    $dates[ $start ] = $qty;
                }
                break;

            case 'date_time':
                $start_time = date( 'G:i', strtotime( $start_date ) );
                $end_time = date( 'G:i', strtotime( $end_date ) );
    
                if ( array_key_exists( $start, $dates ) && array_key_exists( "$start_time - $end_time", $dates[ $start ] ) ) {
                    $dates[ $start ][ "$start_time - $end_time" ] += $qty;
                } else {
                    $dates[ $start ][ "$start_time - $end_time" ] = $qty;
                }
                break;

            case 'multiple_days':
                
                if ( $include_start ) {
                    $start_dny = date( 'd-n-Y', strtotime( $start_date ) );
                } else {
                    $start_dny = date( 'd-n-Y', strtotime( $start_date . "+1 day " ) );
                }

                $end_dny = date( 'd-n-Y', strtotime( $end_date ) );
    
                if( isset( $booking_settings[ 'booking_charge_per_day' ] ) && $booking_settings[ 'booking_charge_per_day' ] == 'on' ){
                    $get_days = bkap_common::bkap_get_betweendays_when_flat( $start_dny, $end_dny, $product_id );
                } else {
                    $get_days = bkap_common::bkap_get_betweendays( $start_dny, $end_dny );
                }
    
                foreach ( $get_days as $days ) {
                    $Ymd_format = date( 'Ymd', strtotime( $days ) );
    
                    if ( array_key_exists( $Ymd_format, $dates ) ) {
                        $dates[ $Ymd_format ] += $qty;
                    } else {
                        $dates[ $Ymd_format ] = $qty;
                    }
                }

                break;
        }
    
        endwhile;

        wp_reset_postdata();
    }

    return $dates;
}

/**
 * Returns an array of dates that are completely booked
 * i.e. lockout has been reached.
 * Lockout Priority:
 * 1. specific date lockout
 * 2. weekday lockout
 * 3. lockout date after X orders
 *
 * @since 4.2.0
 * @param int $product_id Product Id
 * @param array $dates Array of Date and its lockout
 * @return array $booked_dates Return array the dates whose lockout is reached
 */

function get_booked_multiple( $product_id, $dates ) {
    
    $booked_dates       = array();
    $specific_dates     = get_post_meta( $product_id, '_bkap_specific_dates', true ); // get the specific dates lockout
    $recurring_lockout  = get_post_meta( $product_id, '_bkap_recurring_lockout', true ); // get the weekdays lockout
    $any_date_lockout   = get_post_meta( $product_id, '_bkap_date_lockout', true ); // get the Lockout Date after X orders
    
    // once we have a list of the dates, we need to see if bookings for any date have reached the lockout
    foreach( $dates as $d_key => $d_value ) {
        
        $jny_format = date( 'j-n-Y', strtotime( $d_key ) );    
        $weekday    = date( 'w', strtotime( $d_key ) );
        $weekday    = "booking_weekday_$weekday";
    
        if( array_key_exists( $jny_format, $specific_dates ) ) { // specific date lockout has been set
            $date_lockout = $specific_dates[ $jny_format ];
    
            if ( absint( $date_lockout ) > 0 && $d_value >= $date_lockout ) // lockout reached
                $booked_dates[] = $jny_format;
    
        } else if( is_array( $recurring_lockout ) && array_key_exists( $weekday, $recurring_lockout ) ) { // recurring weekday lockout
    
            if ( absint( $recurring_lockout[ $weekday ] ) > 0 && $d_value >= $recurring_lockout[ $weekday ] ) // weekday lockout reached
                $booked_dates[] = $jny_format;
    
        } else { // Lockout Date after X orders field
    
            if ( absint( $any_date_lockout) > 0 && $d_value >= $any_date_lockout )
                $booked_dates[] = $jny_format;
        }
    }
    
    return $booked_dates;
}

/**
 * Returns an array of dates and the number of bookingsdone for the same. array[ Ymd ] => bookings done
 *
 * @since 4.2.0
 * @param int $product_id Product ID
 * @param string $date Date
 * @return array $dates array of date and number of bookings done
 */

function get_bookings_for_date( $product_id, $date ) {    
    
    $booking_type = get_post_meta( $product_id, '_bkap_booking_type', true ); // check the booking type
    
    // get all the bookings IDs and start & end booking times for the given product ID from post meta
    
    if ( 'multiple_days' === $booking_type ) {
        $args = array(  'post_type' => 'bkap_booking',
            'post_status' => array( 'paid', 'pending-confirmation', 'confirmed' ),
            'meta_query'  => array(
                array(
                    'key' => '_bkap_product_id',
                    'value' => $product_id,
                ),
                array(
                    'key' => '_bkap_start',
                    'value' => date( 'YmdHis', strtotime( $date ) ),
                    'compare' => '<='
                ),
                array(
                    'key' => '_bkap_end',
                    'value' => date( 'YmdHis', strtotime( $date ) ),
                    'compare' => '>='
                )
            )
        );
    } else {
        $args = array( 'post_type' => 'bkap_booking',
                       'post_status' => array( 'paid', 'pending-confirmation', 'confirmed' ),
                       'meta_query' => array(
                           array(
                               'key' => '_bkap_product_id',
                               'value' => $product_id
                           ),
                           array(
                               'key' => '_bkap_start',
                               'value' => date( 'Ymd', strtotime( $date ) ),
                               'compare' => 'LIKE'
                           ) 
                       )
        );
    }
    
    $dates = array();
    $query = new WP_Query( $args );
    
    if ( $query->have_posts() ) {
    
        // booking settings for rental charges
        $booking_settings = get_post_meta( $product_id, 'woocommerce_booking_settings', true );
    
        while( $query->have_posts() ) :
    
            $query->the_post();
        
            $booking_id = $query->post->ID;
            $start_date = get_post_meta( $booking_id, '_bkap_start', true );
            $end_date   = get_post_meta( $booking_id, '_bkap_end', true );
        
            $qty        = get_post_meta( $booking_id, '_bkap_qty', true );
            $start      = substr( $start_date, 0, 8 );
        
            switch( $booking_type ) {
                case 'only_day':
                    if ( array_key_exists( $start, $dates ) ) {
                        $dates[ $start ] += $qty;
                    } else {
                        $dates[ $start ] = $qty;
                    }
                    break;
                case 'date_time':
                    $start_time = date( 'G:i', strtotime( $start_date ) );
                    $end_time = date( 'G:i', strtotime( $end_date ) );
        
                    $slot_time = "$start_time - $end_time";
                    if ( array_key_exists( $start, $dates ) && array_key_exists( $slot_time, $dates[ $start ] ) ) {
                        $dates[ $start ][ $slot_time ] += $qty;
                    } else {
                        $dates[ $start ][ $slot_time ] = $qty;
                    }
                    break;
                case 'multiple_days':
        
                    $start_dny  = date( 'd-n-Y', strtotime( $start_date ) );
                    $end_dny    = date( 'd-n-Y', strtotime( $end_date ) );
        
                    if( isset( $booking_settings[ 'booking_charge_per_day' ] ) && $booking_settings[ 'booking_charge_per_day' ] == 'on' ){
                        $get_days = bkap_common::bkap_get_betweendays_when_flat( $start_dny, $end_dny, $product_id );
                    } else {
                        $get_days = bkap_common::bkap_get_betweendays( $start_dny, $end_dny );
                    }
        
                    foreach( $get_days as $days ) {
                        $jny_format = date( 'j-n-Y', strtotime( $days ) );
    
                        if ( strtotime( $days ) == strtotime( $date ) ) {
                            if ( array_key_exists( $jny_format, $dates ) ) {
                                $dates[ $jny_format ] += $qty;
                            } else {
                                $dates[ $jny_format ] = $qty;
                            }
                        }
                    }
                    
                    break;
            }
        
        endwhile;
    }
    
    wp_reset_postdata();
    
    return $dates;
}

/**
 * This function is to get the available bookings for a date
 *
 * @since 4.2.0
 * @param int $product_id Product ID
 * @param string $booking_date Date
 * @param array $bookings_array Array for all the bookings received for the set date
 * @return array Returns the available bookings for a date.
 */

function get_availability_for_date( $product_id, $booking_date, $bookings_array ) {

    $available_bookings = 0;
    $unlimited = 'YES';
    
    $lockout = get_date_lockout( $product_id, $booking_date );

    $total_bookings = 0;
    if ( is_array( $bookings_array ) && count( $bookings_array ) > 0 ) {
        foreach( $bookings_array as $b_key => $b_value ) {
            if ( is_array( $b_value ) && count( $b_value ) > 0 ) {
                foreach( $b_value as $slot => $booking ) {
                    $total_bookings += $booking;
                }          
            } else {
                $total_bookings = $b_value;
            }
        }
    } 

    if ( 'unlimited' === $lockout ) {
        $available_bookings = 0;
        $unlimited = 'YES';
    } else if ( absint( $lockout ) >= 0 ) {
        $unlimited = 'NO';
        $available_bookings = $lockout - $total_bookings;
    }
    
    return array( 'unlimited' => $unlimited,
                  'available' => $available_bookings
    );
}

/**
 * Returns the available bookings for a date & time slot
 *
 * @since 4.2.0
 * @param int $product_id Product ID
 * @param string $date Date
 * @param string $slot Timeslot
 * @param string $bookings Array for all the bookings received for the dates
 * @return array Returns the available bookings for a date & time slot
 */

function get_slot_availability( $product_id, $date, $slot, $bookings ) {
    
    $available_bookings = 0; // default
    $total_bookings     = 0; // default total bookings placed to 0    
    $date_ymd           = date( 'Ymd', strtotime( $date ) );
    $weekday            = date( 'w', strtotime( $date ) );
    $weekday            = "booking_weekday_$weekday";
    
    // bookings have been placed for that date
    if ( is_array( $bookings ) && count( $bookings ) > 0 ) {
        
        if ( array_key_exists( $date_ymd, $bookings ) ) {
            if( array_key_exists( $slot, $bookings[ $date_ymd ] ) ) {
                $total_bookings = $bookings[ $date_ymd ][ $slot ];
            } 
        }    
    }
    
    $lockout = get_slot_lockout( $product_id, $date, $slot );
    
    $available_bookings = ( absint( $lockout ) > 0 ) ? $lockout - $total_bookings : 'Unlimited';

    if ( $available_bookings === 'Unlimited' ) {
        $unlimited = 'YES';
        $available = 0;
    }else {
        $unlimited = 'NO';
        $available = $available_bookings;
    }

    return array( 'unlimited' => $unlimited,
                  'available' => $available );
}

/** 
 * Returns the total bookings allowed for a given date and time slot
 *
 * @since 4.2.0
 * @param int $product_id Product ID
 * @param string $date Date
 * @param string $slot Timeslot
 * @return int $lockout Returns the total bookings allowed for a given date and time slot
 */

function get_slot_lockout( $product_id, $date, $slot ) {

    $lockout        = 0; // default
    $date_jny       = date( 'j-n-Y', strtotime( $date ) ); // date format
    $weekday        = date( 'w', strtotime( $date ) );
    $weekday        = "booking_weekday_$weekday";
    $time_settings  = get_post_meta( $product_id, '_bkap_time_settings', true ); // get the lockout for the date & time slot
    
    if ( is_array( $time_settings ) && count( $time_settings ) > 0 ) {
        
        if ( array_key_exists( $date_jny, $time_settings ) ) { // specific date time slot
            $slot_settings = $time_settings[ $date_jny ];
        } else if( array_key_exists( $weekday, $time_settings ) ) { // weekday timeslot
            $slot_settings = $time_settings[ $weekday ];
        }
    
        if ( is_array( $slot_settings ) && count( $slot_settings ) > 0 ) {
    
            foreach( $slot_settings as $settings ) {
    
                $from_time  = date( 'G:i', strtotime( $settings[ 'from_slot_hrs' ] . ':' . $settings[ 'from_slot_min' ] ) );
                $to_time    = date( 'G:i', strtotime( $settings[ 'to_slot_hrs' ] . ':' . $settings[ 'to_slot_min' ] ) );
        
                if ( $slot === "$from_time - $to_time" ) {
                    
                    $lockout = ( absint( $settings[ 'lockout_slot' ] ) > 0 ) ? $settings[ 'lockout_slot' ] : 'unlimited';
                }
            }
        }
    }
    
    return $lockout;    
}

/**
 * Function to get the total bookings allowed for a date
 *
 * @since 4.2.0
 * @param int $product_id Product ID
 * @param string $date Date
 * @return int $lockout Returns the total bookings allowed for a date
 */

function get_date_lockout( $product_id, $date ) {

    $lockout = 0;
    
    // get recurring settings _bkap_recurring_weekdays
    $recurring_settings     = get_post_meta( $product_id, '_bkap_enable_recurring', true );
    $recurring_weekdays     = get_post_meta( $product_id, '_bkap_recurring_weekdays', true );

    // get the booking type
    $booking_type           = get_post_meta( $product_id, '_bkap_booking_type', true );

    // get the specific dates lockout
    $specific_dates         = get_post_meta( $product_id, '_bkap_specific_dates', true );

    // get custom ranges
    $custom_ranges          = get_post_meta( $product_id, '_bkap_custom_ranges', true );
    $custom_holiday_ranges  = get_post_meta( $product_id, '_bkap_holiday_ranges', true );
    $product_holidays       = get_post_meta( $product_id, '_bkap_product_holidays', true );

    // get the weekdays lockout
    $recurring_lockout      = get_post_meta( $product_id, '_bkap_recurring_lockout', true );

    // get the Lockout Date after X orders
    $any_date_lockout       = get_post_meta( $product_id, '_bkap_date_lockout', true );

    $date_jny               = date( 'j-n-Y', strtotime( $date ) );
    $weekday                = date( 'w', strtotime( $date ) );
    $weekday                = "booking_weekday_$weekday";

    if ( is_array( $custom_holiday_ranges ) && count( $custom_holiday_ranges ) > 0 ) {
        
        foreach ( $custom_holiday_ranges as $range_key => $range_value ) {
            if ( strtotime( $range_value['start'] ) <= strtotime( $date ) &&
                 strtotime( $range_value['end'] ) >= strtotime( $date ) ) {
                
                return $lockout = 0;
            }
        }
    }

    if ( is_array( $custom_ranges ) && count( $custom_ranges ) > 0 ) {
        
        foreach ( $custom_ranges as $custom_key => $custom_value ) {
            if ( !( strtotime( $custom_value['start'] ) <= strtotime( $date ) &&
                 strtotime( $custom_value['end'] ) >= strtotime( $date ) ) ) {
                
                return $lockout = 0;
            }
        }
    }

    if ( is_array( $product_holidays ) && array_key_exists( $date_jny, $product_holidays ) ) {
        
        return $lockout = 0;
    }

    if ( is_array( $specific_dates ) && array_key_exists( $date_jny, $specific_dates ) ) {

        $lockout = ( absint( $specific_dates[ $date_jny ] ) > 0 ) ? $specific_dates[ $date_jny ] : 'unlimited';
    } else if( is_array( $recurring_weekdays ) &&  'on' === $recurring_weekdays[ $weekday ] && 
        is_array( $recurring_lockout ) && array_key_exists( $weekday, $recurring_lockout ) && 
        'multiple_days' !== $booking_type ) {

        $lockout = ( absint( $recurring_lockout[ $weekday ] ) > 0 ) ? $recurring_lockout[ $weekday ] : 'unlimited';
    } else {

        if ( 'multiple_days' === $booking_type ) {
            $lockout = ( absint( $any_date_lockout ) > 0 ) ? $any_date_lockout : 'unlimited';
        }
    }

    return $lockout;
}

/**
 * This function will return an array of resource availability and its available quantity.
 *
 * @since 4.6.0
 * @param  int     $post_id Resource Post ID
 * @param  WP_Post $post Resource Post
 * @return array $resource_data Array of resource availability and its available quantity
 */

function bkap_save_resources( $post_id, $post ) {

    $availability = bkap_get_posted_availability();
    $resource_data  = array(
        'bkap_resource_qty'          => wc_clean( $_POST['_bkap_booking_qty'] ),
        'bkap_resource_availability' => $availability
    );

    return $resource_data;
}

/**
 * Getting all the post which has resource post meta.
 *
 * @since 4.6.0
 * @param  int $resource_id Resource ID
 * @return object $post_data  WP Post
 */

function bkap_booked_resources( $resource_id ) {

    $args = array(
        'post_type'         => 'bkap_booking',
        'numberposts'       => -1,
        'post_status'       => array( 'paid', 'pending-confirmation', 'confirmed' ),
        'meta_key'          => '_bkap_resource_id',
        'meta_value'        => $resource_id,
    );

    $posts_data = get_posts( $args );

    return $posts_data;
}

/**
 * All Booking posts having the resource ID
 * 
 * @since 4.6.0
 * @param  int $resource_id Resource ID
 * @return array $booking List of posts having Resource
 */

function bkap_booking_posts_for_resource( $resource_id ) {

    $all_posts  = bkap_booked_resources( $resource_id );
    $booking    = array();

    foreach ( $all_posts as $key => $value ) {
         
        $booking[ $key ] = new BKAP_Booking( $value->ID );
    }

    return $booking;
}

/**
 * Calculating Booked, locked dates and time for resource
 * 
 * @since 4.6.0
 * @param  int $resource_id Resource ID
 * @return array $booking_resource_booking_dates Resource's Booked and locked dates
 */

function bkap_calculate_bookings_for_resource( $resource_id ) {

    $booking_posts                  = bkap_booking_posts_for_resource( $resource_id );
    $dates                          = array();
    $datet                          = array();
    $day                            = date( 'Y-m-d', current_time( 'timestamp' ) );
    $daystr                         = strtotime( $day );
    $bkap_booking_placed            = "";
    $bkap_locked_dates              = "";
    $bkap_time_booking_placed       = $bkap_time_locked_dates = "";
    $booking_resource_booking_dates = array( 'bkap_booking_placed' => '',
        'bkap_locked_dates' => ''
    );

    $bkap_resource_availability     = get_post_meta( $resource_id, '_bkap_resource_qty', true );


    foreach ( $booking_posts as $booking_key => $booking ) {

        if( $booking->start >= $daystr ){
            $qty        = $booking->qty;
            $tqty       = $booking->qty;

            $start_time = ( $booking->get_start_time() != "" ) ? $booking->get_start_time() : "";
            $end_time   = ( $booking->get_end_time() != "" ) ? $booking->get_end_time() : "";

            $time_slot  = $start_time . " - " . $end_time;

            $start_dny  = date( 'd-n-Y', $booking->start );
            $end_dny    = date( 'd-n-Y', $booking->end );

            $rental_status = false;

            if ( is_plugin_active( 'bkap-rental/rental.php' ) ) {

                $booking_settings = get_post_meta( $booking->get_product_id(), 'woocommerce_booking_settings', true );
        
                if( isset( $booking_settings[ 'booking_charge_per_day' ] ) && $booking_settings[ 'booking_charge_per_day' ] == 'on' && isset( $booking_settings[ 'booking_same_day' ] ) && $booking_settings[ 'booking_same_day' ] == 'on' ) {
                    $rental_status = true;
                }
            }

            if( $rental_status ) {
                $get_days   = bkap_common::bkap_get_betweendays_when_flat( $start_dny, $end_dny, $booking->get_product_id() );
            } else {
                $get_days   = bkap_common::bkap_get_betweendays( $start_dny, $end_dny );
            }

            foreach ( $get_days as $days ) {

                $Ymd_format = date( 'j-n-Y', strtotime( $days ) );

                if ( array_key_exists( $Ymd_format, $dates ) ) {

                    $dates[ $Ymd_format ] += $qty;

                    if ( $start_time != "" ) {

                        if ( array_key_exists( $Ymd_format, $datet ) ) {
                            if ( array_key_exists( $time_slot, $datet[$Ymd_format] ) ) {
                                $datet[$Ymd_format][$time_slot] += $tqty;
                            } else {
                                $datet[$Ymd_format][$time_slot] = $tqty;
                            }
                        } else {
                            $datet[$Ymd_format][$time_slot] = $tqty;
                        }
                    }
                } else {
                    $dates[$Ymd_format] = $qty;
                    $datet[$Ymd_format][$time_slot] = $tqty;
                }
            }
        }
    }

    // Date calculations
    foreach ( $dates as $boking_date => $booking_qty ) {
        $bkap_booking_placed .= '"' . $boking_date . '"=>'.$booking_qty.',';

        if ( $bkap_resource_availability <= $booking_qty ) {
            $bkap_locked_dates .= '"' . $boking_date . '",';
        }
    }

    // Timeslots calculations
    foreach ( $datet as $boking_date => $booking_time ) {

        foreach ( $booking_time as $b_time => $b_qty ){
            $bkap_time_booking_placed .= '"' . $boking_date . '"=>'.$b_time . '=>' . $b_qty . ',';
        }


        if ( $bkap_resource_availability <= $b_qty ) {
            $bkap_time_locked_dates .= '"' . $boking_date . '"=>'.$b_time.',';
        }
    }

    $bkap_booking_placed        = substr_replace( $bkap_booking_placed, '', -1 );
    $bkap_locked_dates          = substr_replace( $bkap_locked_dates, '', -1 );

    $bkap_time_booking_placed   = substr_replace( $bkap_time_booking_placed, '', -1 );
    $bkap_time_locked_dates     = substr_replace( $bkap_time_locked_dates, '', -1 );

    $booking_resource_booking_dates['bkap_booking_placed']      = $bkap_booking_placed;
    $booking_resource_booking_dates['bkap_locked_dates']        = $bkap_locked_dates;
    $booking_resource_booking_dates['bkap_time_booking_placed'] = $bkap_time_booking_placed;
    $booking_resource_booking_dates['bkap_time_locked_dates']   = $bkap_time_locked_dates;
    $booking_resource_booking_dates['bkap_date_time_array']     = $datet;
    $booking_resource_booking_dates['bkap_date_array']          = $dates;

    return $booking_resource_booking_dates;
}

/**
 * Sorting Resource Ranges based on priority
 * 
 * @since 4.6.0
 */

function bkapSortByPriority($x, $y) {
    return $x['priority'] - $y['priority'];
}

/**
 * Get date range between month.
 *
 * @since 4.6.0
 * @param $start int Month Start
 * @param $end int Month End
 * @global array $bkap_months
 * @return $date Array Date range of Given Month Range
 */

function bkap_get_month_range( $start, $end ) {
    global $bkap_months;

    $current_year   = date( 'Y', current_time( 'timestamp' ) );
    $next_year      = date( 'Y', strtotime( '+1 year' ) );

    // Start Date
    $month_start_name   = $bkap_months[ $start ];
    $month_to_use       = "$month_start_name $current_year";
    $range_start        = date ( 'j-n-Y', strtotime( $month_to_use ) );

    // End Date
    $month_end_name = $bkap_months[ $end ];

    if ( $start <= $end ) {
        $month_to_use = "$month_end_name $current_year";
    } else {
        $month_to_use = "$month_end_name $next_year";
    }
    $month_end = date ( 'j-n-Y', strtotime( $month_to_use ) );

    $days = date( 't', strtotime( $month_end ) );
    $days -= 1;
    $range_end = date ( 'j-n-Y', strtotime( "+$days days", strtotime( $month_end ) ) );

    $date['start'] = $range_start;
    $date['end']   = $range_end;

    return $date;

}

/**
 * Get date range between week.
 *
 * @since 4.6.0
 * @param int $week1 Number of start week
 * @param int $week2 Number of end week
 * @param string $format 'j-n-Y'
 *
 * @return array $week_date_range Array of date range of give week
 */

function bkap_get_week_range( $week1, $week2, $format = 'j-n-Y' ){

    global $bkap_months;

    $week_date_range = array();

    $date            = date_create();

    $current_year   = date( 'Y', current_time( 'timestamp' ) );
    $next_year      = date( 'Y', strtotime( '+1 year' ) );

    $currentWeekNumber = date('W');


    if( $week1 >= $currentWeekNumber ) {
        date_isodate_set( $date, $current_year, $week1 );
        $week_date_range['start'] = date_format( $date, $format );

        date_isodate_set( $date, $current_year, $week2, 7 );
        $week_date_range['end'] = date_format( $date, $format );
    }else{
        date_isodate_set( $date, $next_year, $week1 );
        $week_date_range['start'] = date_format( $date, $format );

        date_isodate_set( $date, $next_year, $week2, 7 );
        $week_date_range['end'] = date_format( $date, $format );

    }

    return $week_date_range;

}

/**
 * Get days numbers between days.
 *
 * @since 4.6.0
 * @param int $day1 Number of start weekday
 * @param int $day2 Number of end weekday
 *
 * @return string $days Numbers between start and end weekday
 */

function bkap_get_day_between_Week( $day1, $day2 ){

    $days = "";

    if ( $day1 == $day2 ) {
        $days = $day1;
    } else {
        for ( $i = 0; $i < 7; $i++ ) {

            if ( $day1 < 7 ) {
                $days .= $day1.",";
                $day1++;

                if ( $day1 == $day2 ) {

                    if ( $day1 == 7 ) {
                        $day1 = 0;
                    }
                    $days .= $day1;
                    break;
                }
                if ( $day1 == 7 ) {
                    $day1 = 0;
                }
            }
        }
    }
    return $days;
}

/**
 * Get posted availability fields and format.
 *
 * @since 4.6.0
 * @return array $availability Returns the array of availability data set in the Resource details metabox 
 */
function bkap_get_posted_availability() {

    $availability = array();
    $row_size     = isset( $_POST['wc_booking_availability_type'] ) ? sizeof( $_POST['wc_booking_availability_type'] ) : 0;

    if ( isset( $_POST['wc_booking_availability_bookable_hidden'] ) ) {
        $_POST['wc_booking_availability_bookable'] = $_POST['wc_booking_availability_bookable_hidden']; // Assiging hidden values for bookable data.    
    }    

    for ( $i = 0; $i < $row_size; $i ++ ) {

        $availability[ $i ]['bookable'] = 0;

        if( isset( $_POST['wc_booking_availability_bookable'] ) ) {
            $availability[ $i ]['bookable'] = wc_clean( $_POST['wc_booking_availability_bookable'][ $i ] );
        }

        $availability[ $i ]['type']     = wc_clean( $_POST['wc_booking_availability_type'][ $i ] );

        $availability[ $i ]['priority'] = intval( $_POST['wc_booking_availability_priority'][ $i ] );

        switch ( $availability[ $i ]['type'] ) {
            case 'custom' :
                $availability[ $i ]['from'] = wc_clean( $_POST['wc_booking_availability_from_date'][ $i ] );
                $availability[ $i ]['to']   = wc_clean( $_POST['wc_booking_availability_to_date'][ $i ] );
                break;
            case 'months' :
                $availability[ $i ]['from'] = wc_clean( $_POST['wc_booking_availability_from_month'][ $i ] );
                $availability[ $i ]['to']   = wc_clean( $_POST['wc_booking_availability_to_month'][ $i ] );
                break;
            case 'weeks' :
                $availability[ $i ]['from'] = wc_clean( $_POST['wc_booking_availability_from_week'][ $i ] );
                $availability[ $i ]['to']   = wc_clean( $_POST['wc_booking_availability_to_week'][ $i ] );
                break;
            case 'days' :
                $availability[ $i ]['from'] = wc_clean( $_POST['wc_booking_availability_from_day_of_week'][ $i ] );
                $availability[ $i ]['to']   = wc_clean( $_POST['wc_booking_availability_to_day_of_week'][ $i ] );
                break;
            case 'time' :
            case 'time:1' :
            case 'time:2' :
            case 'time:3' :
            case 'time:4' :
            case 'time:5' :
            case 'time:6' :
            case 'time:7' :
                $availability[ $i ]['from'] = wc_booking_sanitize_time( $_POST['wc_booking_availability_from_time'][ $i ] );
                $availability[ $i ]['to']   = wc_booking_sanitize_time( $_POST['wc_booking_availability_to_time'][ $i ] );
                break;
            case 'time:range' :
                $availability[ $i ]['from'] = wc_booking_sanitize_time( $_POST['wc_booking_availability_from_time'][ $i ] );
                $availability[ $i ]['to']   = wc_booking_sanitize_time( $_POST['wc_booking_availability_to_time'][ $i ] );

                $availability[ $i ]['from_date'] = wc_clean( $_POST['wc_booking_availability_from_date'][ $i ] );
                $availability[ $i ]['to_date']   = wc_clean( $_POST['wc_booking_availability_to_date'][ $i ] );
                break;
        }
    }
    return $availability;
}


/**
 * Return price based standard decimal thousand separator.
 *
 * @return string 
 * @since 4.6.0
 */

function get_standard_decimal_thousand_separator_price( $price ) {

    $decimal_separator  = wc_get_price_decimal_separator();
    $thousand_separator = wc_get_price_thousand_separator();

    if ( '' != $thousand_separator ) {    
        $price_with_thousand_separator_removed = str_replace( $thousand_separator, '', $price );        
    } else {
        $price_with_thousand_separator_removed = $price;
    }

    if ( '.' != $decimal_separator ) {        
        $price = str_replace ( $decimal_separator, '.', $price_with_thousand_separator_removed ) ;        
    }

    return $price;
}

/**
 * Return date in d-n-Y format after adding days to original date.
 *
 * @param string $date Date in d-n-Y format
 * @param int $day Number of days to be added to date
 *
 * @return string 
 * @since 4.8.0
 */

function bkap_add_days_to_date( $date, $day ) {
    
    $day_str = "+ ".$day." days";

    return date( 'd-n-Y', strtotime( $date.$day_str ) );
}

/**
 * Create array of dates between give start and end dateReturn date in d-n-Y format after adding days to original date.
 *
 * @param string $start Start Date
 * @param string $end End Date
 * @param string $format Format of the date (Optional)
 *
 * @return array $new_week_days_arr Array of dates
 * @since 4.8.0
 */

function bkap_array_of_given_date_range ( $start, $end, $format = 'Y-m-d' ){
    
    $start_ts           =   strtotime( $start );
    $end_ts             =   strtotime( $end );
   
    $new_week_days_arr  =   array();
    $start              =   date( $format, $start_ts ); 

    while ( $start_ts <= $end_ts ) {

        $new_week_days_arr []   =   $start;
        $start_ts               =   strtotime( '+1 day', $start_ts );
        $start                  =   date( $format, $start_ts );
    }

    return $new_week_days_arr;
}

/**
 * Create array of dates between give start and end dateReturn date in d-n-Y format after adding days to original date.
 *
 * @param string/int $resource_id Resource ID
 * @param array $date_range array of Dates
 *
 * @return boolean $status Return true if date range has date on which the resource is lockedout
 * @since 4.8.0
 */

function bkap_check_resource_booked_in_date_range( $resource_id, $date_range ){
    
    $resource_booked_data   = bkap_calculate_bookings_for_resource( $resource_id );
    $status                 = false;

    if ( isset( $resource_booked_data['bkap_locked_dates'] ) && $resource_booked_data['bkap_locked_dates'] != "" ) {

        $resource_locked_dates_string   = $resource_booked_data['bkap_locked_dates'];
        $resource_locked_dates_string   = str_replace("\"","",$resource_locked_dates_string);
        $resource_locked_dates          = explode(',', $resource_locked_dates_string);
        
        foreach ( $date_range as $key => $value ) {

            if ( in_array( $value, $resource_locked_dates ) ) {
                $status = true;
                break;
            }
        }
    }

    return $status;
}

/**
 * Delete event from Google Calendar for the given order item id 
 *
 * @param int $product_id Product ID
 * @param int $item_id Order Item ID
 * @since 4.8.0
 */

function bkap_delete_event_from_gcal( $product_id, $item_id ) {

    $pro_id             = $product_id;
    $user_id            = get_current_user_id(); // user ID
    $gcal               = new BKAP_Gcal();
    $booking_settings   = get_post_meta( $product_id, 'woocommerce_booking_settings', true );
     
    if ( $gcal->get_api_mode( $user_id, $product_id ) == "directly" ) {

        if ( isset( $booking_settings[ 'product_sync_integration_mode' ] ) && 'directly' == $booking_settings[ 'product_sync_integration_mode' ] ) {
            $pro_id = $product_id;
        } else {
            $pro_id = 0;
        }    
        $gcal->delete_event( $item_id, $user_id, $pro_id );
    }
}

/**
 * Insert event to Google Calendar for the given order item id 
 *
 * @param object $order_obj Order Object
 * @param int $product_id Product ID
 * @param int $item_id Order Item ID
 * @since 4.8.0
 */

function bkap_insert_event_to_gcal( $order_obj, $product_id, $item_id ) {

    $user_id            = get_current_user_id();
    $gcal               = new BKAP_Gcal();
    
    if ( $gcal->get_api_mode( $user_id, $product_id ) == "directly" ) {

        $order_items_new = $order_obj->get_items();

        foreach ( $order_items_new as $oid => $o_value ) {

            if ( $oid == $item_id ) {
                $itm_value      = $o_value;                 
                
                $event_details  = bkap_cancel_order::bkap_create_gcal_object( $order_obj->get_id(), $itm_value, $order_obj );
                 
                $gcal->insert_event( $event_details, $item_id, $user_id, $product_id, false );
                 
                // add an order note, mentioning an event has been created for the item
                $post_title = $event_details[ 'product_name' ];
                $order_note = __( "Booking details for $post_title have been exported to the Google Calendar", 'woocommerce-booking' );
                
                $order_obj->add_order_note( $order_note );            
                break;
            }
        }
    }    
}

?>