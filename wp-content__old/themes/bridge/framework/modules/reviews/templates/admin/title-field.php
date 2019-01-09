<p>
    <label for="title"><?php esc_html_e( 'Comment Title', 'qode' ); ?></label>
    <input type="text" name="qode_comment_title" value="<?php if(!empty($title)){ echo esc_attr( $title ); } ?>" class="widefat" />
</p>