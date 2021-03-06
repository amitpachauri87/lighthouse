<?php
// Direct access security
if (!defined('TM_EPO_PLUGIN_SECURITY')){
	die();
}
if (!isset($fieldtype)){
	$fieldtype="tmcp-field";
}
?>
<?php
$use="";
if (!empty($use_images)){
	switch ($use_images){
	case "images":
		$use=" use_images";
		if (!empty($image)){
			$swatch="";
			$swatch_class="";
			if ($swatchmode=='swatch'){
				$swatch_class=" tm-tooltip";
				$swatch=' '.'data-tm-tooltip-swatch="on"';
			}
			if ($tm_epo_no_lazy_load=='no'){
				$altsrc='data-original="'.$image.'"';
			}else{
				$altsrc='src="'.$image.'"';
			}
			$label='<img class="tmlazy radio_image'.$swatch_class.'" alt="" '.$altsrc.$swatch.' />'.'<span class="checkbox_image_label">'.$label.'</span>';
		}else{
			// check for hex color
			$search_for_color = $label;
			if (isset($color)){
				$search_for_color = $color;
				if(empty($search_for_color)){
					$search_for_color = 'transparent';
				}
			}
			if($search_for_color == 'transparent' || preg_match('/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $search_for_color)){ //hex color is valid
				$swatch="";
				$swatch_class="";
				if ($swatchmode=='swatch'){
					$swatch_class=" tm-tooltip";
					$swatch=' '.'data-tm-tooltip-swatch="on"';
				}
				if($search_for_color == 'transparent'){
					$swatch_class .=" tm-transparent-swatch";
				}
				$label='<img class="tmhexcolorimage checkbox_image'.$swatch_class.'" alt="" '.$swatch.' />'.'<span class="checkbox_image_label">'.((!isset($color))?$search_for_color:'').'</span>';
			}
		}
		break;
	}
}
if (!empty($li_class)){
	$li_class =" ".$li_class;
}else{
	$li_class = "";
}
if (!empty($class)){
	$fieldtype .=" ".$class;
}
if (!empty($changes_product_image)){
	$fieldtype .=" tm-product-image";
}
if (!empty($changes_product_image) && $changes_product_image=="images"){
	$imagep = '';
}

if (!empty($use_url)){
	switch ($use_url){
	case "url":
		$url=' data-url="'.$url.'"';
		break;
	}
}else{
	$url="";
}
$checked=false;

if (isset($_POST[$name]) && esc_attr(stripslashes($_POST[$name]))==$value){
	$checked=true;
}
elseif (isset($_GET[$name]) && esc_attr(stripslashes($_GET[$name]))==$value){
	$checked=true;
}
elseif (empty($_POST) && isset($default_value)){
	if ($default_value){
		$checked=true;
	}
}
if (isset($textafterprice) && $textafterprice!=''){
	$textafterprice = '<span class="after-amount'.(!empty($hide_amount)?" ".$hide_amount:"").'">'.$textafterprice.'</span>';
}

$element_data_attr_html = array();
if (!empty($element_data_attr) && is_array($element_data_attr)){
	foreach ($element_data_attr as $k => $v) {
		$element_data_attr_html[] = $k.'="'.esc_attr($v).'"';
	}
}
if (!empty($element_data_attr_html)){
	$element_data_attr_html = " ". implode(" ", $element_data_attr_html)." ";
}else{
	$element_data_attr_html = "";
}
if (empty($image)){
	$image = '';
}
if (empty($imagep)){
	$imagep = '';
}
?>
<li class="tmcp-field-wrap<?php echo $grid_break.$li_class;?>">
	<input class="<?php echo $fieldtype;?> tm-epo-field tmcp-radio<?php echo $use; ?>" 
	name="<?php echo $name; ?>" 
	data-price="" 
	data-rules="<?php echo $rules; ?>" 
	data-rulestype="<?php echo $rules_type; ?>" 
	data-image="<?php echo $image; ?>" 
	data-imagep="<?php echo $imagep; ?>" <?php echo $element_data_attr_html; ?>
	value="<?php echo $value; ?>" 
	id="<?php echo $id; ?>" 
	tabindex="<?php echo $tabindex; ?>" 
	type="radio" <?php checked( $checked, true ); echo $url; ?> />
	<label for="<?php echo $id; ?>"><?php echo $label; ?></label>
	<span class="amount<?php if (!empty($hide_amount)){echo " ".$hide_amount;} ?>"><?php echo $amount; ?></span>
	<?php echo $textafterprice; ?>
</li>