/**
 * Edit Booking Class for manipulating data on modal pop-up
 * @namespace bkap_resource
 * @since 4.6.0
 */
jQuery( document ).ready( function ($) {

	/**
	 * Event for showing the saved resource details
	 *
	 * @fires event:click
	 * @since 4.6.0
	 */
	$( '#bkap_resource_availability, #bookings_pricing, .bookings_extension' ).on( 'change', '.wc_booking_availability_type select, .wc_booking_pricing_type select', function() {
		var value = $(this).val();
		var row   = $(this).closest('tr');		

		$(row).find('.from_date, .from_day_of_week, .from_month, .from_week, .from_time, .from').hide();
		$(row).find('.to_date, .to_day_of_week, .to_month, .to_week, .to_time, .to').hide();
		$( '.repeating-label' ).hide();
		$( '.bookings-datetime-select-to' ).removeClass( 'bookings-datetime-select-both' );
		$( '.bookings-datetime-select-from' ).removeClass( 'bookings-datetime-select-both' );
		$( '.bookings-to-label-row .bookings-datetimerange-second-label' ).hide();


		if ( value == 'custom' ) {
			$(row).find('.from_date, .to_date').show();
		}
		if ( value == 'months' ) {
			$(row).find('.from_month, .to_month').show();
		}
		if ( value == 'weeks' ) {
			$(row).find('.from_week, .to_week').show();
		}
		if ( value == 'days' ) {
			$(row).find('.from_day_of_week, .to_day_of_week').show();
		}
		if ( value.match( "^time" ) ) {
			$(row).find('.from_time, .to_time').show();
			// Show the date range as well if "time range for custom dates" is selected
			if ( 'time:range' === value ) {
				$(row).find('.from_date, .to_date').show();
				$( '.repeating-label' ).show();
				$( '.bookings-datetime-select-to' ).addClass( 'bookings-datetime-select-both' );
				$( '.bookings-datetime-select-from' ).addClass( 'bookings-datetime-select-both' );
				$( '.bookings-to-label-row .bookings-datetimerange-second-label' ).show();
			}
		}
		if ( value == 'persons' || value == 'duration' || value == 'blocks' ) {
			$(row).find('.from, .to').show();
		}
	});

	/**
	 * Event for adding rows to the resources table
	 *
	 * @fires event:bkap_row_added
	 * @since 4.6.0
	 */
	$('body').on('bkap_row_added', function(){

		$('.wc_booking_availability_type select, .wc_booking_pricing_type select').change();

		$( '.date-picker' ).datepicker({
			dateFormat: 'yy-mm-dd',
			minDate: 0,
			numberOfMonths: 1,
			showButtonPanel: true,
			showOn: 'button',
			buttonImage: bkap_resource_params.bkap_calendar,
  			buttonText: "Select Date",
			buttonImageOnly: true
		});
	});

	/**
	 * Callback Function when Edit Booking Button is clicked
	 *
	 * @function wc_bookings_trigger_change_events
	 * @return {bool} stop further propogation of event
	 * @since 4.6.0
	 */
	function wc_bookings_trigger_change_events() {
		$('.wc_booking_availability_type select, .wc_booking_pricing_type select, #_wc_booking_duration_type, #_wc_booking_user_can_cancel, #_wc_booking_duration_unit, #_wc_booking_has_persons, #_wc_booking_has_resources, #_wc_booking_has_person_types').change();
	}

	/**
	 * Event when add new row is clicked
	 *
	 * @fires event:click
	 * @since 4.6.0
	 */
	$( '.bkap_add_row_resource' ).click(function( e ){
			
		var newRowIndex = $(e.target).closest('table').find( '#pricing_rows tr' ).length;
		var newRow 		= $( this ).data( 'row' );
		newRow 			= newRow.replace( /bookings_cost_js_index_replace/ig, newRowIndex.toString() );
		
		$(this).closest('table').find('tbody').append( newRow);

		/**
		 * Indicates that the row is added
		 * 
		 * @event bkap_row_added
		 * @since 4.6.0
		 */
		$('body').trigger('bkap_row_added');
		return false;
	});

	/**
	 * Event when Checkbox is clicked on Availability Rows
	 *
	 * @fires event:click
	 * @since 4.6.0
	 */
	jQuery( "#availability_rows" ).on( 'click', '.bkap_checkbox', function( e ) {
		
		var bkap_checkbox = $( this ).parent();
		
		if ( $( e.target).prop("checked") == true ){
			$( bkap_checkbox ).find( ".bkap_hidden_checkbox" ).val("1");
		}else{
			$( bkap_checkbox ).find( ".bkap_hidden_checkbox" ).val("0");
		}
	});

	/**
	 * Event when Close Resource clicked
	 *
	 * @fires event:click
	 * @since 4.6.0
	 */
	jQuery('#availability_rows').on( 'click', '#bkap_close_resource', function( e ) {
		$(this).parent().remove();
	});

	$( '.date-picker' ).datepicker({
		dateFormat: 'yy-mm-dd',
		minDate: 0,
		numberOfMonths: 1,
		showButtonPanel: true,
		showOn: 'button',
		buttonImage: bkap_resource_params.bkap_calendar,
  		buttonText: "Select Date",
		buttonImageOnly: true
	});	

	wc_bookings_trigger_change_events();
});