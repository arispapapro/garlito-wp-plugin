<?php

	$is_updated = false;

	global $wpdb;

  	// this adds the prefix which is set by the user upon instillation of wordpress
    $table_name = $wpdb->prefix . "garlito_player";

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		
		 $where = array('id' => 1);
		
		 $new_value = array(
			 'stream_type' => $_POST["stream_type"] , 
			 'stream_url' => $_POST["stream_url"] ,
			 'last_songs_url' => $_POST["last_songs_url"],
			 'statistics_type' => $_POST["statistics_type"] , 
			 'statistics_url' => $_POST["statistics_url"] , 
			 'playerBackgroundColor' => $_POST["player_background_color"] , 
			 'station_title' => $_POST["station_title"] , 
			 'icon_color' => $_POST["icon_color"] , 
			 'wave_color' => $_POST["icon_color"] 
		 );
		
		 $wpdb->update($table_name, $new_value, $where);
		
		$is_updated = true;
	 }

    // this will get the data from your table
    $retrieve_data = $wpdb->get_results( "SELECT * FROM $table_name");



?>


<link rel="stylesheet" href="<?php echo plugins_url('garlito-player/garlito-player.css'); ?> ">
<link rel="stylesheet" href="<?php echo plugins_url('garlito-player/assets/css/bootstrap.min.css'); ?> ">
<style>
	body{background-color:#f0f0f1!important;}
</style>
<div class="container-fluid"> 
	<br>
	<h3>Garlito Player Settings</h3>
	<br>
	<div class="row">
		
		<?php if($is_updated){ ?>
			<div class="alert alert-success" role="alert">
			  Player Settings have been succesfully updated!
			</div>
		<?php } ?>
		
		<div class="col-12 admin-white-box">
		    <form method="POST" action="">
		        <div class="mb-3">
                    <label for="RadioStationTitleInput" class="form-label">Radio Station Title</label>
                    <input type="text" class="form-control" name="station_title" id="RadioStationTitleInput" value="<?php echo $retrieve_data[0]->station_title; ?>">
                </div>

               <div class="mb-3">
                    <label for="StreamType" class="form-label">Streaming Type</label>
                    <select class="form-select form-control" id="StreamType" name="stream_type" value="<?php echo $retrieve_data[0]->stream_type; ?>">
                        <option selected="<?php $retrieve_data[0]->stream_type === 'selected_value' ?> ">Select Value</option>
                        <option selected="<?php $retrieve_data[0]->stream_type === 'shoutcast' ?>" value="shoutcast">Shoutcast</option>
                        <option selected="<?php $retrieve_data[0]->stream_type === 'icecast' ?>" value="icecast">Icecast</option>
                     </select>
                </div>

                <div class="mb-3">
                    <label for="webRadioStreamUrl" class="form-label">Web Radio Stream Url</label>
                    <input type="text" class="form-control" id="webRadioStreamUrl" name="stream_url" value="<?php echo $retrieve_data[0]->stream_url; ?>">
                </div>

                <div class="mb-3">
                    <label for="StreamType" class="form-label">Statistics Type</label>
                    <select class="form-select form-control" id="StatisticsTypeInput" name="statistics_type" value="<?php echo $retrieve_data[0]->statistics_type; ?>">
                        <option selected="<?php $retrieve_data[0]->statistics_type === 'selected_value' ?>" >Select Value</option>
                        <option selected="<?php $retrieve_data[0]->statistics_type === 'centova_cast' ?>" value="centova_cast">Centovacast</option>
                     </select>
                </div>

                <div class="mb-3">
                    <label for="StatisticsUrl" class="form-label">Statistics URL</label>
                    <input type="text" class="form-control" id="StatisticsUrl" name="statistics_url" value="<?php echo $retrieve_data[0]->statistics_url; ?>">
                </div>

                <div class="mb-3">
                    <label for="StatisticsUrl" class="form-label">Last Songs URL</label>
                    <input type="text" class="form-control" id="LastSongsUrl" name="last_songs_url" value="<?php echo $retrieve_data[0]->last_songs_url; ?>">
                </div>

                <div class="mb-3">
                     <label for="IconColorInput" class="form-label">Icon Color</label>
                    <input class="form-control form-control-color" type="color" id="IconColorInput" name="icon_color" value="<?php echo $retrieve_data[0]->icon_color; ?>">
                </div>

                <div class="mb-3">
                     <label for="IconColorInput" class="form-label">Player Background Color</label>
                    <input class="form-control form-control-color" type="color" id="PlayerBackgroundColorInput" name="player_background_color" value="<?php echo $retrieve_data[0]->playerBackgroundColor; ?>">
                </div>
		        <button type="submit" class="btn btn-primary">Save</button>
		    </form>
		</div>
	
	</div>
</div>
