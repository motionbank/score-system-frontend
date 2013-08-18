jQuery(function(){

	var onLocalhost = /(localhost|.+\.local)/.test(window.location.host);

	var api = null, config = null;

	var parentWindow = null, parentWindowOrigin = '';
	
	var formats = [
		{ext: '.mp4',  type: 'video/mp4'},
		{ext: '.ogv',  type: 'video/ogg'},
		{ext: '.webm', type: 'video/webm'},
		{ext: 'flash', type: 'video/flash'},
	];
	
	var sceneEvents = [];
	var currentScene = null, currentVideo = null;

	var videoFileName = window.location.search.split('v=')[1].split('&')[0];
	var videoId 	  = window.location.search.split('id=')[1].split('&')[0];

	var messenger = new PostMessenger(window);

	messenger.on('connect',function(req,resp){
		if ( parentWindow ) return;

		parentWindow = req.message.source;
		parentWindowOrigin = req.message.origin;

		config = req.data;
		api = new PieceMakerApi( this, config.pieceMaker.apiKey, 'http://' + config.pieceMaker.host );

		initFully();

		//api.useProxy( parentWindow, parentWindowOrigin ); // TODO: repair this sucker
	});

	var initFully = function () {

		messenger.on('set-scene',function(req,resp){
			//console.log( 'received: set-scene' );
			setToScene( req.data );
		});

		var fPlayer = null;

		// http://flowplayer.org/docs/api.html
		// http://flash.flowplayer.org/documentation/api/
		flowplayer(function(fp){
			
			fPlayer = fp; // store it in function context

			fPlayer.bind('ready',function(){
				setPlayerSize();
				fPlayer.pause();
				api.loadVideo( videoId, videoLoaded );
			});

			fPlayer.bind('progress',function(evt){
				if ( !currentVideo ) return;

				var now = fPlayer.video.time * 1000 + currentVideo.happened_at_float;
				var lastScene = currentScene;
				for ( var i = 0; i < sceneEvents.length-1; i++ ) {
					if ( sceneEvents[i+1].happened_at_float > now ) {
						if ( fPlayer.seeking || !fPlayer.playing ) return;
						if ( lastScene !== sceneEvents[i] ) {
							currentScene = sceneEvents[i];
							messenger.send( 'set-scene', currentScene.title, parentWindow );
						}
						return;
					}
				}
			});

			fPlayer.bind('finish',function(evt){
				messenger.send( 'flowplayer:finish', null, parentWindow );
			});
		});

		var video_format_urls = [];

		for ( var i = 0; i < formats.length; i++ ) {
			if ( formats[i].ext !== 'flash' ) {
				video_format_urls.push( 'http://'+config.cloudFront.fileHost+config.pieceMaker.basePath+'/'+videoFileName+formats[i].ext );
			} else if ( !config.islocal ) {
				video_format_urls.push( 'mp4:'+(config.pieceMaker.basePath.replace(/^\//,''))+'/'+videoFileName );
			}
		}

		var $videoContainer = jQuery('#video-container').flowplayer({
			playlist: [ video_format_urls ],
			engine: 'flash',
			swf: 'flowplayer-5.4.3/flowplayer.swf',
			rtmp: 'rtmp://'+config.cloudFront.streamer+'/cfx/st'
		});

		jQuery(window).resize(function(){
			setPlayerSize();
		});

		var setPlayerSize = function () {

			var vw = fPlayer.video.width;
			var vh = fPlayer.video.height;
			var $doc = jQuery(document.body);
			var dw = $doc.width();
			var dh = $doc.height();
			var vr = vw/vh;
			var dr = dw/dh;
			if ( dr >= vr ) {
				vw = parseInt( Math.round( vr * dh ) );
				vh = dh;
			} else {
				vh = parseInt( Math.round( dw / vr ) );
				vw = dw;
			}
			jQuery('#video-container').css({
				left: ((dw-vw) / 2) + 'px',
					//top: ((dh-vh) / 2) + 'px',
				top: '0px',
				width: vw + 'px',
				height: vh + 'px'
			});
		}

		setPlayerSize();

		var videoLoaded = function ( video ) {
			
			currentVideo = video;
			api.loadEventsByTypeForVideo( currentVideo.id, 'scene', eventsLoaded );

			fPlayer.play();
		}

		var eventsLoaded = function ( events ) {

			sceneEvents = events.events;
			messenger.send( 'get-scene', null, parentWindow );
		}

		var setToScene = function ( newScene ) {

			if ( !currentScene || currentScene.title !== newScene ) { // block own calls after initial get-scene

				for ( var i = 0; i < sceneEvents.length; i++ ) {
					if ( sceneEvents[i].title === newScene ) {
						// if ( fPlayer.seekable ) {
							var newSceneEvent = sceneEvents[i];
							var seekTo = (sceneEvents[i].happened_at_float - currentVideo.happened_at_float) / 1000.0;
							fPlayer.seek( seekTo, function () {
								currentScene = newSceneEvent;
								fPlayer.play();
							});
						// } else {
						// 	console.log( "setToScene, playing" );
						// 	fPlayer.play(0);
						// }
						return;
					}
				}
				// not found ... play from start i guess ... no better wait it out
				// fPlayer.seek(0, function () {
				// 	fPlayer.resume();
				// });
				fPlayer.pause();
			}
		}
	};
});