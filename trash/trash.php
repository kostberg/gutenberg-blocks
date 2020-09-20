<?php
// // Alter default gutenberg image
// function block_filters($content, $block){
//     if($block['blockName'] !== 'core/image'){
//         return $content;
//     }

//     $img_id = $block['attrs']['id'];
//     $img_meta = wp_get_attachment_metadata($img_id);
//     $class = "IA_image";
//     $editor_size = 300;

//     $url = wp_get_original_image_url($img_id);
//     $width = $img_meta['width'];
//     $height = $img_meta['height'];

//     libxml_use_internal_errors(TRUE);

//     // Get the attributes
//     $ser_block = serialize_block($block);

//     $attr_dom = new DOMDocument();

//     // Pass the content to the loadHTML function
//     $attr_dom->loadHTML($ser_block);
//     $xpath = new DOMXPath($attr_dom);

//     //Extract Comment Nodes
//     $comments = $xpath->query('//comment()');
//     $text = $comments->item(0)->data;

//     preg_match('~\{(?:[^{}]|(?R))*\}~', $text,$res);

//     // print_r(json_decode($res[0]));

//     // we get the remaining info by loading the html via DOMDocument
//     $dom = new DOMDocument();
//     $dom->preserveWhiteSpace = FALSE;
//     $dom->loadHtml( mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));

//     // Get the figure element
//     $figure = $dom->getElementsByTagName('figure')[0];

//     // because the caption can contain html
//     $figCaption = $figure->getElementsByTagName( 'figcaption' );
//     if ( count( $figCaption ) ) {
//         $caption = '';
//         foreach ( $figCaption[ 0 ]->childNodes as $child ) {
//             $caption .= $dom->saveHTML( $child );
//         }
//     }
    
//     // Editor panel styling for image
//     $style = "width: {$editor_size}px; height: {$editor_size}px; background-image: url({$url}); background-position: center; background-size: cover;";
//     $html = "<div class=\"{$class}\" data-width=\"{$width}\" data-height=\"{$height}\" style=\"{$style}\"></div>";

//     // Add caption
//     if($caption){
//         $style = "font-style: italic;";
//         $html .= "<p class=\"caption\" style=\"{$style}\">{$caption}</p>";
//     }

//     $html = "<div class=\"{$class}-outer\">{$html}</div>";
    
//     return $html;   
// }

// add_filter('render_block', 'block_filters', 10, 2);