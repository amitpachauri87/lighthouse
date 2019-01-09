<?php
class TM_EPO_FIELDS_range extends TM_EPO_FIELDS {

	public function display_field( $element=array(), $args=array() ) {
		return array(
				'textafterprice'=> isset( $element['text_after_price'] )?$element['text_after_price']:"",
				'hide_amount'  	=> isset( $element['hide_amount'] )?" ".$element['hide_amount']:"",
				'min'  			=> isset( $element['min'] )?$element['min']:"",
				'max'  			=> isset( $element['max'] )?$element['max']:"",
				'step' 			=> isset( $element['step'] )?$element['step']:"",
				'pips' 			=> isset( $element['pips'] )?$element['pips']:"",
			);
	}

	public function validate() {

		$passed = true;
									
		foreach ( $this->field_names as $attribute ) {
			if ( !isset( $this->epo_post_fields[$attribute] ) ||  $this->epo_post_fields[$attribute]=="" ) {
				$passed = false;
				break;
			}										
		}

		return $passed;
	}
	
}