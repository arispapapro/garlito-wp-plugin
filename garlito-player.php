<?php
/**
 * Plugin Name:       Garlito Shoutcast Player
 * Plugin URI:        https://example.com/plugins/the-basics/
 * Description:       A Simple Shoutcast Wordpress Player.
 * Version:           0.1.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            YourAgency.gr
 * Author URI:        https://youragency.gr
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       garlito-player
 * Domain Path:       /languages
 */
add_action('wp_enqueue_scripts', 'callback_for_setting_up_scripts');

if ( !defined( 'ABSPATH' ) ) exit;

global $garlito_plugin_db_version;

//Version of the plugin
$garlito_plugin_db_version = '1.0';


// Act on plugin activation
register_activation_hook( __FILE__, "activate_garlito_plugin" );

// Act on plugin de-activation
register_deactivation_hook( __FILE__, "deactivate_garlito_plugin" );

// Activate Plugin
function activate_garlito_plugin() {

	// Execute tasks on Plugin activation

	// Insert DB Tables
	init_db_garlito_plugin();
}

// De-activate Plugin
function deactivate_garlito_plugin() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'garlito_player';

    echo $table_name;

    // Execute tasks on Plugin de-activation
   $table_name = $wpdb->prefix . "garlito_player";
   require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

   $wpdb->query( "DROP TABLE IF EXISTS $table_name" );


}

// Initialize DB Tables
function init_db_garlito_plugin() {

	    global $wpdb;
    	global $jal_db_version;

    	$table_name = $wpdb->prefix . 'garlito_player';

    	$charset_collate = $wpdb->get_charset_collate();

    // Create Customer Table if not exist
	if( $wpdb->get_var( "show tables like '$table_name'" ) != $table_name ) {

		// Query - Create Table
    	$sql = "CREATE TABLE $table_name (
    		id mediumint(9) NOT NULL AUTO_INCREMENT,
    		stream_type varchar(255) DEFAULT '' NOT NULL,
    		stream_url varchar(255) DEFAULT '' NOT NULL,
    		statistics_type varchar(255) DEFAULT '' NOT NULL,
    		statistics_url varchar(255) DEFAULT '' NOT NULL,
    		playerBackgroundColor varchar(255) DEFAULT '' NOT NULL,
    		station_title varchar(255) DEFAULT '' NOT NULL,
    		icon_color varchar(255) DEFAULT '' NOT NULL,
    		wave_color varchar(255) DEFAULT '' NOT NULL,
    		PRIMARY KEY  (id)
    	) $charset_collate;";

		// Include Upgrade Script
		require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );

		// Create Table
		dbDelta( $sql );

	    add_option( 'plugin_name_db_version', $garlito_plugin_db_version );

 $wpdb->query("INSERT INTO $table_name(stream_type, stream_url, statistics_type, statistics_url, playerBackgroundColor, station_title, icon_color, wave_color )
 VALUES( 'shoutcast', 'https://cast2.my-control-panel.com/proxy/aris/stream' , 'centova_cast' ,
 'https://cast2.asurahosting.com/rpc/aris/streaminfo.get', '#ffffff', 'Boheme Radio', '#d7c9af', 'gold' )");

//         $wpdb->insert($table_name, array(
//         			'stream_type' => "shoutcast",
//         			'stream_url' => "https://cast1.my-control-panel.com/proxy/aris1/stream",
//         			'statistics_type' => "centova_cast",
//         			'statistics_url' => "https://cast1.asurahosting.com:2199/rpc/aris1/streaminfo.get",
//         			'playerBackgroundColor' => "#ffffff",
//         			'station_title' => "ΕΛΙΤ Radio",
//         			'icon_color' => "#d7c9af",
//         			'wave_color' => "gold"
//         ));
	}

}




function init_database_data() {
	global $wpdb;
}



function callback_for_setting_up_scripts() {

    wp_register_style( 'bootstrap-min', plugins_url ( 'garlito-player/assets/css/bootstrap.min.css') );
	wp_enqueue_style( 'bootstrap-min' );

    wp_register_style( 'garlito-player-css', plugins_url ( 'garlito-player/garlito-player.css') );
    wp_enqueue_style( 'garlito-player-css' );

   
	//wp_register_script( 'bootstrap-js', plugins_url ( 'garlito-player/assets/js/bootstrap.bundle.min.js') );
	//wp_enqueue_script( 'bootstrap-js' );
	
	wp_register_script( 'popper-js', 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js' );
  	wp_enqueue_script( 'popper-js' );
	
    wp_register_script( 'bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.min.js' );
  	wp_enqueue_script( 'bootstrap-js' );
	
    wp_register_script( 'jquery-js', plugins_url ( 'garlito-player/assets/js/jquery-3.6.0.min.js') );
  	wp_enqueue_script( 'jquery-js' );

    wp_register_script( 'garlito-player-js', plugins_url ( 'garlito-player/garlito-player.js') );
	wp_enqueue_script( 'garlito-player-js' );

}






// Add menu
function customplugin_menu() {
    add_menu_page("Garlito Player", "Garlito Player", "manage_options", "garlito-player", "displayList",'dashicons-microphone');
}

add_action("admin_menu", "customplugin_menu");

function displayList(){
  include "pages/garlito-player-admin.php";
}

?><?php if(!is_admin() && home_url( $_SERVER['REQUEST_URI']) !== home_url($wp->request) ."/wp-content/plugins/garlito-player/helpers/player-info.php" ){ ?>

<div id="playerHolder" class="player-holder">
    <div class="player">

    <!-- Range Volume -->
    <input style="display:none" type="range" min="0" max="1" value="1"  step="0.01" class="istyle" id="volumeSlider">

    <!-- Close Button -->
    <div style="display:none" id="closePlayerButton" class="close-button">x</div>

     <!-- Mute Button -->
    <div style="display:none" id="muteButton" class="button"></div>

   <!-- Station Logo -->
   <div  id="stationLogo" class="station-logo"></div>

   <!-- Station Title -->
   <div  id="stationTitle"  class="station-title"></div>

   <!-- Statistics Table -->
   <table class="info-table">
   <tbody>
     <tr>
       <td rowspan="3"><img id="cover"></td>
       <td><b><div id="artist"></div></b></td>
     </tr>
     <tr>
       <td><b><div id="title"></div></b></td>
     </tr>
      <tr>
        <td><div id="album"></div></td>
      </tr>
   </tbody>
   </table>


        <!-- Player -->
        <audio style="display:none"></audio>
        <div class="buttons-holder">
            <div style="display:none"  id="playButton" class="button"></div>
            <div style="display:none"  id="stopButton" class="button"></div>
        </div>
    </div>

 <div id="waveEffect" class="wave2"></div>




<div>

</div>
</div>

<?php } ?>