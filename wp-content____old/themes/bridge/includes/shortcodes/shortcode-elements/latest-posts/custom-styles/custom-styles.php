<?php

if(!function_exists('qode_latest_posts_styles')) {
    function qode_latest_posts_styles(){
        $first_main_color = qode_options()->getOptionValue('first_color');
        $background_selector = '.latest_post_holder.image_on_the_left_boxed .date_hour_holder, .latest_post_holder.image_on_the_left_boxed .featured .read_more:before';

        if(!empty($first_main_color)){
            echo qode_dynamic_css($background_selector, array('background-color' => $first_main_color));
        }
    }
    add_action('qode_style_dynamic', 'qode_latest_posts_styles');
}
