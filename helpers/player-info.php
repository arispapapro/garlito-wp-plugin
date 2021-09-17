<?php
	  	require_once("../../../../wp-load.php");
	header('Content-Type: application/json');

	global $wpdb;

    // this adds the prefix which is set by the user upon instillation of wordpress
    $table_name = $wpdb->prefix . "garlito_player";

    // this will get the data from your table
    $retrieve_data = $wpdb->get_results( "SELECT * FROM $table_name");

	echo json_encode($retrieve_data[0]);

exit();

?>