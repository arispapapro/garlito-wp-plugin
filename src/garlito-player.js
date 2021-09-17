//-------------------------------------------------------------------------
// Configuration
//-------------------------------------------------------------------------

    const config = {

        //Replace it with your stream url
        stream : {
            //Available types "shoutcast" , "icecast"
            type: "",
            url : ""
        },


        // Last Songs Url
        lastSongsUrl:{
            url: ""
        },
        // Fetch Statistics Url Every Second
        statisticsEverySecond : 5,

        //Statistics Url to fetch
        statistics :{
            //Available types "centova_cast"
            type: "",
            url : ""
        },

        //---- Colors
        colorConfiguration : {
            playerBackgroundColor : "#ffffff"
        },

        autoplay: true,

        plugin:{
            url: ""
        },
        wave: {
          //Available Wave Colors "gray" , "black", "red", "blue"
          color: "",
          enabled: true
        },
        icon_color: ""
    }

//-------------------------------------------------------------------------

$(window).on('load', function() {

    appendHtmlToBody();



    // Constants
    const topBar =              $("#topBar")
    const player =              document.querySelector("audio");
    const audioSource =         $("#audioSource");

    const playButton =          $("#playButton");

    const stopButton =          $("#stopButton");

    const muteButton =          $("#muteButton");

    const volumeSlider =        $("#volumeSlider");
    const closePlayerButton =   $("#closePlayerButton");
    const waveEffect =          $("#waveEffect");

    const playerHolder =        $("#playerHolder");

    const cover =               $("#cover");
    const title =               $("#title");
    const artist =              $("#artist");
    const album =               $("#album");
    const fullTitle =           $("#fullTitle");
    const stationTitle =        $("#stationTitle");
    const stationLogo  =        $("#stationLogo");

    const facebookIcon   =      $("#facebookIcon");
    const instagramIcon  =      $("#instagramIcon");
    const historyIcon    =      $("#historyIcon");
    const chatIcon       =      $("#chatIcon");
    const checkLastSongsModal       =      $("#checkLastSongsModal");


    var radioData = {};





// Update the current slider value (each time you drag the slider handle)
    volumeSlider.on('input', ( e ) => {

        player.volume = volumeSlider.val();

        if(volumeSlider.val() <= 0){
            hideElement(waveEffect);
        }else{
            showElement(waveEffect);
        }
    });

    historyIcon.on('click' , () => {
        getLastTenSongs();

    });
//-------------------------------------------------------------------------
// Initilization
//-------------------------------------------------------------------------
    //Initialize application
    init();

    //Update Radio Statistics with the current value
    updateStatistics();

//-------------------------------------------------------------------------

   async function init(){

        //Show the play button
	   showElement(playButton);
	   //Show the range Volume Slider
	   showElement(volumeSlider);


       //Load Configuration Settings
       await loadConfiguration();

       //Init Stream Settings
       if(config.stream){
           //If stream type is shoutcast
           if(config.stream.type === "shoutcast"){
               //Set the streamUrl
               player.src = config.stream.url;
           }
           else if(config.stream.type === "icecast"){
               //Set the streamUrl
               player.src = config.stream.url;
           }
       }

       //Init Color Settings
       updateColors();


       //Load Statistics Data Once
       updateStatistics();

       //-------------------------------------------------------------------------
       // Intervals
       //-------------------------------------------------------------------------

       //Update Radio Statistics every * seconds
       setInterval( () => { updateStatistics(); },1000 * 10);

       //-------------------------------------------------------------------------


       //Show player
       showElement(playerHolder);
   }


    function updateConfigurationValues( res ) {
        config.stream.url = res.stream_url;
        config.stream.type = res.stream_type;
        config.statistics.type = res.statistics_type;
        config.statistics.url = res.statistics_url;
        config.statisticsEverySecond = res.statisticsEverySecond;
        config.autoplay = res.autoplay;
        config.colorConfiguration.playerBackgroundColor = res.playerBackgroundColor;
        config.plugin.ulr = res.plugin_url;
        config.wave.color = res.wave_color;
        config.wave.enabled = res.wave_enabled;
        config.icon_color = res.icon_color;
        config.lastSongsUrl.url = res.last_songs_url;

        updateText(stationTitle,res.station_title);

    }

    async function loadConfiguration(){
       await $.ajax({
            url : '/wp-content/plugins/garlito-player/helpers/player-info.php'
        }).done( ( res) => {
            updateConfigurationValues(res);

        });
    }

    function updateIconColors(color){
        muteButtonIcon.css("fill" , color);
        playButtonIcon.css("fill" , color);
        stopButtonIcon.css("fill" , color);
    }

    function updateColors(){
        //If color configuration is set up
        if(config.colorConfiguration){

            //Set Player Holder Background Color
            if(config.colorConfiguration.playerBackgroundColor){
                changeBackgroundColorWithOpacity(playerHolder , config.colorConfiguration.playerBackgroundColor , 0.89);
                changeBackgroundColor(closePlayerButton , config.colorConfiguration.playerBackgroundColor );
            }
            if(config.wave.color){
                updateWave(config.wave.color);
            }

            if(config.icon_color){
                changeBackgroundColor(playButton , config.icon_color);
				changeBorderColor(playButton , config.icon_color);
                changeBackgroundColor(muteButton , config.icon_color);
				changeBorderColor(muteButton , config.icon_color);
                changeBackgroundColor(stopButton , config.icon_color);
				changeBorderColor(stopButton , config.icon_color);
				
            }
        }
    }

    function getLastTenSongs(){
        $.get( config.lastSongsUrl.url, ( data ) => {

            let songs = [];

            if(data){
                if(data.items){

                    data.items.forEach((item) =>{
                        if(item.title !== 'Αγνωστο - Boheme Radio Spot'){
                        songs.push(item);
                    }
                    })

                }
            }

        if (document.contains(document.getElementById("testooo"))) {
            document.getElementById("testooo").remove();
        }

        //Add the table with songs in the last songs table div
        addHtmlToDivWithId(getTableWithSongs(songs), 'lastSongsTable');
    });
    }


    function addHtmlToDivWithId(html , id){

        //Remove the created unique element if exists.
        removeDivWithId(id + 'uniqueElement');

        //Create the element using the createElement method.
        var myDiv = document.createElement("div");

        //Set its unique ID.
        myDiv.id = id + 'uniqueElement';

        //Add your content to the DIV
        myDiv.innerHTML = html;

        //Finally, append the element to the HTML body
        document.getElementById(id).appendChild(myDiv);
    }

    function removeDivWithId(id){
        if (document.contains(document.getElementById(id))) {
            document.getElementById(id).remove();
        }
    }

    function getTableWithSongs( songs ){
       let html = '<table class"table table-striped table-responsive"><thead> <tr> <th>Artwork</th> <th>Title</th><th>Album</th> <th>Date</th></tr></thead><tbody>';

       if(songs){
           songs.forEach((item) =>{
                html = html + ' <tr><td><img src="'+item.enclosure.url+'"></td></td><td>'+ item.title +'</td><td>'+item.description+'</td> <td>'+new Date(item.date* 1000).toLocaleTimeString()+'</td></tr>';
           });
       }

       html = html + '</tbody></table>';

       console.log(html);
       return html;
    }

    function updateStatistics(){
        if(config.statistics){

            //If Statistics Url is from Centova Cast
            if(config.statistics.type === "centova_cast"){
				
				$.get( config.statistics.url, ( data ) => {
				  refreshData(data["data"][0]["track"]);
				});
							 
            }

        }
    }


    function refreshData( data ){
        updateImg(cover,data.imageurl);
        updateText(artist, getArtist(data.artist));
        updateText(title,getTitle(data.title));
        updateText(album,getAlbum(data.album));
        updateText(fullTitle, getArtist(data.artist) + ' - ' + getTitle(data.title));

    }

    function getArtist(string){
        if(string.includes(";")){
            let artist = string.split(";")[0];
        }else{
            return string;
        }
    }

    function getTitle(string){
        return string;
    }

    function getAlbum(string){
		if(string){
				if(string.length >=20){
			return "";
		}
		}
	
        return string;
    }


    function updateWave( color ){
       waveEffect.css("background-color", color);
       waveEffect.css("mask", 'url("../wp-content/plugins/garlito-player/assets/img/wave_gray.svg") 0 0 repeat-x');
       waveEffect.css("-webkit-mask", 'url("../wp-content/plugins/garlito-player/assets/img/wave_gray.svg") 0 0 repeat-x');
    }




//Player Events

    //When you click on the play button
     playButton.click( () => {
        //Hide Play Button
        hideElement(playButton);

        //Show Mute Button
        showElement(muteButton);

        //Show Volume Slider
        showElement(volumeSlider);

        //Show Stop Button
        showElement(stopButton);

        //Show Wave Effect
        showElement(waveEffect);

        //Start Stream
        play();
    });

    //When you click on the stop button
    stopButton.click( () => {
        //Hide Wave Effect
        hideElement(waveEffect);

        //Hide Pause Button
        hideElement(stopButton);

        //Hide Mute Button
        hideElement(muteButton);

        //Hide Volume Slider
        hideElement(volumeSlider);

        //Show Play Button
        showElement(playButton);

        //Pause Stream
        stop();
    });

    //When you press the mute button of the player
    muteButton.click( () => {
        player.muted = !player.muted;
        if( player.muted){
            hideElement(waveEffect);
            muteButton.css("mask" , "url(wp-content/plugins/garlito-player/assets/img/mute.svg) no-repeat center / contain");
            muteButton.css("-webkit-mask" , "url(wp-content/plugins/garlito-player/assets/img/mute.svg) no-repeat center / contain");
        }else{
            showElement(waveEffect);
            muteButton.css("mask" , "url(wp-content/plugins/garlito-player/assets/img/speaker.svg) no-repeat center / contain");
            muteButton.css("-webkit-mask" , "url(wp-content/plugins/garlito-player/assets/img/speaker.svg) no-repeat center / contain");
        }
    });

    //When you click on the close button of the player
    closePlayerButton.click( () => {

        //Hide Player Holder
        hideElement(playerHolder);

        //Stop The Player
        stopButton.click();
    });

//Player Functionalities

    // Start the music stream
    function play(){
        player.src = config.stream.url;

        //Load Audio
        player.load();

        //Start Stream
        player.play();
    }

    //Stop the music stream
    function stop(){
        //Pause Stream
        player.src = "";
    }


//General Helpers

    //Make a Http Request
    function httpGet(theUrl) {
		
	$.get( theUrl, ( data ) => {
	  return data;
	});
        /*var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;*/
    }

    //Hide An Document Element
    function hideElement(el){
      el.css("display" ,"none");
    }

    //Show An Document Element
    function showElement(el){
        el.css("display" ,"inline-block");
    }

    //Updates the inner Html Text of an element
    function updateText( el , value){
        el.text(value);
    }

    //Updates the source of an image
    function updateImg( el , src){
        el.attr("src",src);
    }

    //Change Background Image of an Element
    function changeBackgroundImage(el , img_url){
        el.css("background-image",'url(' + img_url + ')');
    }
    //Change Background Color of an Element
    function changeBackgroundColor(el , color){
        el.css("background",color)
    }
	
	//Change Background Color of an Element
    function changeBackgroundColorWithOpacity(el , color, opacity){
        el.css("background",hexToRgbA(color,opacity))
    }
	
	function hexToRgbA(hex , opacity){
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + opacity + ')';
		}
		
	}

 	//Change Background Color of an Element
    function changeBorderColor(el , color){
        el.css("border-color",color)
    }



    function appendHtmlToBody(){
        //Set its unique ID.
        myDiv.getElementById('garlitoPlayerAppend')

        //Add your content to the DIV
        myDiv.innerHTML ='<div class="modal fade" id="checkLastSongsModal" tabindex="-1" aria-labelledby="checkLastSongsModalLabel" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title" id="exampleModalLabel">Τελευταία Τραγούδια </h4> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div><div id="lastSongsTable" class="modal-body "> </div><div class="modal-footer"> </div></div></div></div><div id="topBar" class="top-bar"> <div class="top-bar-icons"> <a href="https://facebook.com/bohemeradiogr" target="_blank" id="facebookIcon" class="top-bar-icon"></a> <a href="https://instagram.com/boheme.radio" target="_blank" id="instagramIcon" class="top-bar-icon"></a> <div id="historyIcon" class="top-bar-icon" data-bs-toggle="modal" data-bs-target="#checkLastSongsModal"></div><a href="https://chat.boheme-radio.com/boheme-radio" target="_blank" id="chatIcon" class="top-bar-icon"></a> </div></div><div id="playerHolder" class="player-holder"> <div class="player"> <input style="display:none" type="range" min="0" max="1" value="1" step="0.01" class="istyle" id="volumeSlider"> <div style="display:none" id="closePlayerButton" class="close-button">x</div><div style="display:none" id="muteButton" class="button"></div><div id="stationLogo" class="station-logo"></div><div id="stationTitle" class="station-title"></div><table class="info-table"> <tbody> <tr> <td rowspan="3"><img id="cover"></td><td><b><div id="artist"></div></b></td></tr><tr> <td><b><div id="title"></div></b></td></tr><tr> <td><div id="album"></div></td></tr></tbody> </table> <audio style="display:none"></audio> <div class="buttons-holder"> <div style="display:none" id="playButton" class="button"></div><div style="display:none" id="stopButton" class="button"></div></div></div><div id="waveEffect" class="wave2"></div><div></div></div>';

        //Finally, append the element to the HTML body
        document.body.appendChild(myDiv);
    }
});

