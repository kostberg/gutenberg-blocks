<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.build.js - Backend.
 */

function ia_blocks_assets() {

	// Register block editor script for backend.
	wp_register_script(
		'ia-blocks-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor', 'wp-components' ),
		null, 
		true
	);

	// WP Localized globals
	wp_localize_script(
		'ia-blocks-js',
		'cgbGlobal',
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
		]
	);

	register_block_type(
		'ia/block-citat', array(
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'ia-blocks-js',
		)
    );

	register_block_type(
		'ia/block-bildtext', array(
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'ia-blocks-js',
		)
    );
}

add_action('init', 'ia_blocks_assets');

/**
 * Add theme specific category
 */

function IAs_block_category($categories, $post){
	return array_merge(
        array(
			array(
				'slug' => 'ia-blocks',
				'title' => 'IA Blocks',
			),
		),
		$categories
	);
}

add_filter('block_categories', 'IAs_block_category', 10, 2);