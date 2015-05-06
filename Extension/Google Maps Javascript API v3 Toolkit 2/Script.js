//Google Maps Javascript API v3 Toolkit 2
//Created by Renato Vieira - rvr@qlikview.com
//Under The MIT License 
//
//Developed and tested with QlikView v11.2 SR9


var map;
var latlngbounds;
var _this;

loadLibs();
		function loadLibs() {
			// console.log(Qva);
			Qva.AddExtension('Google Maps Javascript API v3 Toolkit 2', function(){ 
				_this=this;
				// console.log(this.Layout.Text0.text);
				var google_api_url='https://maps.googleapis.com/maps/api/js?';
				// console.log(_this.ExtSettings.APIKey);
				if(this.Layout.Text0.text!='(optional)' && this.Layout.Text0.text!='')
					google_api_url+='key='+this.Layout.Text0.text+'&';
				google_api_url+='libraries=visualization&sensor=false&callback=extension_Init';
				Qva.LoadScript(google_api_url);
			});
		};

function extension_Init()
{
	console.log("Hello");
	// Qva.AddExtension('Google Maps Javascript API v3 Toolkit 2', function(){ //(1) change name here of the extension accordingly
		 console.log("Hi");
		// var _this = this;
		_this.ExtSettings = {};
		extensionProperties(); //initializing the extension's main properties



		extensionCSS(); //loading additional CSS files;

	  	var jsFiles=extensionJS(); //loading additional JS files;
	
		// console.log('Loading JavaScript files and initializing the extension');
		// Qv.LoadExtensionScripts(jsFiles, function(){
		Qv.LoadExtensionScripts(jsFiles, function(){
			renderChart(); //start rendering chart, including initialized properties, loaded CSS and JS files
		})
		

		
		//Core function to render the chart. (4) Start your development here.
		function renderChart(){
			
			//Creating a div for easier reference (for example CSS formating)
			$divContainer = $(document.createElement('div'));
			$divContainer.attr('id',_this.ExtSettings.UniqueId);
			$divContainer.addClass('divTemplateContainer'); //(4.2) class attribute to format layout with CSS file

			$(_this.Element).empty();
			$(_this.Element).append($divContainer);

			$divContainer.height(_this.GetHeight());
			$divContainer.width(_this.GetWidth());

			createMap(_this.ExtSettings.ShowRoadmap,
				  _this.ExtSettings.ShowSatellite, 
				  _this.ExtSettings.ShowHibrid, 
				  _this.ExtSettings.ShowTerrain, 
				  _this.ExtSettings.Allow45Imagery, 
				  _this.ExtSettings.AllowStreetView,
				  _this.ExtSettings.UniqueId);	

			if(_this.ExtSettings.ActivateMarkers)
				drawMarkers(_this.ExtSettings.MarkerCustomIconURL,
							_this.ExtSettings.MarkerForceMultiIcon,
							_this.ExtSettings.MarkerAllowMoveMarkers,
							_this.ExtSettings.MarkerLabelHPosition,
							_this.ExtSettings.MarkerLabelVPosition,
							_this.ExtSettings.MarkerActivateCluster,
							_this.ExtSettings.MarkerClusterSize,
							_this.ExtSettings.MarkerClusterMaxZoom,
							_this.ExtSettings.ActivateCircles,
							_this.ExtSettings.ShapeStrokeOpacity,
							_this.ExtSettings.ShapeStrokeWeight,
							_this.ExtSettings.ShapeFillOpacity,
							_this.ExtSettings.Color1,
							_this.ExtSettings.Color2,
							_this.Data.Rows,
							_this);

			if(_this.ExtSettings.ActivateShapes)
				drawShapes(_this.ExtSettings.ActivateShapes, 
						   _this.ExtSettings.ActivateCircles, 
						   _this.ExtSettings.ActivateMarkers,
						   _this.ExtSettings.ShapeStrokeOpacity,
						   _this.ExtSettings.ShapeStrokeWeight,
						   _this.ExtSettings.ShapeFillOpacity,
						   _this.ExtSettings.Color1,
						   _this.ExtSettings.Color2,
						   _this.Data.Rows,
						   _this);

			if(_this.ExtSettings.ActivateHeatmap)
					drawHeatMap(_this.ExtSettings.HeatmapOpacity, 
								_this.ExtSettings.HeatmapRadius, 
								_this.ExtSettings.Color1, 
								_this.ExtSettings.Color2, 
								_this.ExtSettings.Color3, 
								_this.Data.Rows);

			if(_this.ExtSettings.ActivateLines)
					drawLines(_this.ExtSettings.LineOpacity, 
							  _this.ExtSettings.Color1, 
							  _this.ExtSettings.LineGeodesic, 
							  _this.Data.Rows, 
							  _this);

			if(_this.ExtSettings.ActivatePointToPointDirections)
				drawDirections(_this.ExtSettings.DirectionsStartLat, 
							   _this.ExtSettings.DirectionsStartLng,
							   _this.ExtSettings.DirectionsEndLat,
							   _this.ExtSettings.DirectionsEndLng,
							   _this.ExtSettings.DirectionsDrivingMode,
							   Qv.GetCurrentDocument());

			setTimeout(function(){
				if(!latlngbounds.isEmpty()){
					map.fitBounds(latlngbounds);

					map.setCenter(latlngbounds.getCenter());
					map.setZoom(map.getZoom()-1);
				}else{
					if(_this.ExtSettings.DefaultZoom==NaN || _this.ExtSettings.DefaultZoom=='')
						_this.ExtSettings.DefaultZoom=4;
					map.setCenter(new google.maps.LatLng(41.348205,-8.19274));
					map.setZoom(_this.ExtSettings.DefaultZoom);
				}
			},300);

			// console.log("Chart rendered at %s. Enjoy!", Date.now());//Date.now() is from https://datejs.googlecode.com/files/date.js
		};

		//Function to load JavaScript files. 
		function extensionJS(){
			var jsFiles = ['markerclusterer_compiled.js','markerwithlabel_packed.js']; //(3) If you have a new file, just copy it to the extension's /lib/js folder and add it's filename to the jsFiles Array.
			var jsFilesPath = [];
			
			for (var i=0; i<jsFiles.length; i++)
				jsFilesPath[i] = _this.ExtSettings.JSFolder+'/'+jsFiles[i];

			// jsFilesPath.push('https://datejs.googlecode.com/files/date.js');//(3.1) use this alternative to include JavaScript files external to the /lib/js folder
			
			//Console log 
			// console.group('Set up JS file(s) for loading');
			// for(var i=0; i<jsFilesPath.length; i++)
			// 	console.log('%d: %s', i, jsFilesPath[i]);
			// console.groupEnd();
			
			return jsFilesPath;
		};

		//Function to initialize additional CSS files. 
		function extensionCSS(){
			var cssFiles = [/*'style.css',*/'markerstyle.css']; //(2) If you have a new file, just copy it to the extension's /lib/css folder and add it's filename to the cssFiles Array.
			
			// console.group('Additional CSS File(s) Loaded');
			// for (var i=0; i<cssFiles.length; i++){
			// 	Qva.LoadCSS(_this.ExtSettings.CSSFolder+'/'+cssFiles[i]);
			// 	console.log('%d: %s', i, _this.ExtSettings.CSSFolder+'/'+cssFiles[i]);
			// }
			// console.groupEnd();
		};

		//Function to initialize the extension's main properties. This will extend the _this.ExtSettings object.
		function extensionProperties(){
			//Basic extension info
			_this.ExtSettings.ExtensionName = 'Google Maps Javascript API v3 Toolkit 2'; //(1) change name here of the extension accordingly
			_this.ExtSettings.UniqueId = _this.Layout.ObjectId.replace('\\', '_');	
			_this.ExtSettings.LoadUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=';
			_this.ExtSettings.ContainerId = 'GMapsAPI_' + _this.ExtSettings.UniqueId;

			//Multiple folders
			_this.ExtSettings.CSSFolder = _this.ExtSettings.LoadUrl + 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css';
			_this.ExtSettings.JSFolder = _this.ExtSettings.LoadUrl + 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js';
			_this.ExtSettings.ImagesFolder = _this.ExtSettings.LoadUrl + 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/images';

			//Main Extension Properties
			_this.ExtSettings.APIKey = _this.Layout.Text0.text;
			_this.ExtSettings.DefaultZoom = _this.Layout.Text1.text;
			_this.ExtSettings.ShowRoadmap = _this.Layout.Text2.text;
			_this.ExtSettings.ShowSatellite = _this.Layout.Text3.text;
			_this.ExtSettings.ShowHibrid = _this.Layout.Text4.text;
			_this.ExtSettings.ShowTerrain = _this.Layout.Text5.text;
			_this.ExtSettings.Allow45Imagery = _this.Layout.Text6.text;
			_this.ExtSettings.AllowStreetView = _this.Layout.Text7.text;
			//Markers
			_this.ExtSettings.ActivateMarkers = _this.Layout.Text8.text;
			_this.ExtSettings.MarkerCustomIconURL = _this.Layout.Text9.text;
			_this.ExtSettings.MarkerLabelHPosition = _this.Layout.Text10.text;
			_this.ExtSettings.MarkerLabelVPosition = _this.Layout.Text11.text;
			//Markers Advanced
			_this.ExtSettings.MarkerActivateCluster = _this.Layout.Text12.text;
			_this.ExtSettings.MarkerClusterSize = _this.Layout.Text13.text;;
			_this.ExtSettings.MarkerClusterMaxZoom = _this.Layout.Text14.text;
			_this.ExtSettings.MarkerForceMultiIcon = _this.Layout.Text15.text;
			_this.ExtSettings.MarkerAllowMoveMarkers = _this.Layout.Text16.text;
			//Shapes
			_this.ExtSettings.ActivateShapes = _this.Layout.Text17.text;
			_this.ExtSettings.ActivateCircles = _this.Layout.Text18.text;
			_this.ExtSettings.ShapeStrokeOpacity = _this.Layout.Text19.text;
			_this.ExtSettings.ShapeStrokeWeight = _this.Layout.Text20.text;
			_this.ExtSettings.ShapeFillOpacity = _this.Layout.Text21.text;
			//Heatmap
			_this.ExtSettings.ActivateHeatmap = _this.Layout.Text22.text;
			_this.ExtSettings.HeatmapOpacity = _this.Layout.Text23.text;
			_this.ExtSettings.HeatmapRadius = _this.Layout.Text24.text;
			//Lines
			_this.ExtSettings.ActivateLines = _this.Layout.Text25.text;
			_this.ExtSettings.LineOpacity = _this.Layout.Text26.text;
			_this.ExtSettings.LineGeodesic = _this.Layout.Text27.text;
			//Directions
			_this.ExtSettings.ActivatePointToPointDirections = _this.Layout.Text28.text;
			_this.ExtSettings.DirectionsStartLat = _this.Layout.Text29.text;
			_this.ExtSettings.DirectionsStartLng = _this.Layout.Text30.text;
			_this.ExtSettings.DirectionsEndLat = _this.Layout.Text31.text;
			_this.ExtSettings.DirectionsEndLng = _this.Layout.Text32.text;
			_this.ExtSettings.DirectionsDrivingMode = _this.Layout.Text33.text;
			//Colors
			_this.ExtSettings.Color1 = _this.Layout.Text34.text
			_this.ExtSettings.Color2 = _this.Layout.Text35.text
			_this.ExtSettings.Color3 = _this.Layout.Text36.text

			//Console log
			// console.group('Main properties created');
			// 	console.group('Basic extension information');
			// 		console.log('_this.ExtSettings.ExtensionName: '+_this.ExtSettings.ExtensionName);
			// 		console.log('_this.ExtSettings.UniqueId: '+_this.ExtSettings.UniqueId);
			// 		console.log('_this.ExtSettings.LoadUrl: '+_this.ExtSettings.LoadUrl);
			// 		console.log('_this.ExtSettings.ContainerId: '+_this.ExtSettings.ContainerId);
			// 	console.groupEnd();
			// 	console.group('Extension folders information');
			// 		console.log('_this.ExtSettings.CSSFolder: '+_this.ExtSettings.CSSFolder);
			// 		console.log('_this.ExtSettings.JSFolder: '+_this.ExtSettings.JSFolder);
			// 		console.log('_this.ExtSettings.JSFolder: '+_this.ExtSettings.ImagesFolder);
			// 	console.groupEnd();
			// 	console.group('Developer explicit configurations');
			// 		console.group('Main definitions');
			// 			console.log('_this.ExtSettings.APIKey: ' + _this.ExtSettings.APIKey);
			// 			console.log('_this.ExtSettings.DefaultZoom: ' + _this.ExtSettings.DefaultZoom);
			// 		console.groupEnd();
			// 		console.group('Map Views');
			// 			console.log('_this.ExtSettings.ShowRoadmap: ' + _this.ExtSettings.ShowRoadmap);
			// 			console.log('_this.ExtSettings.ShowSatellite: ' + _this.ExtSettings.ShowSatellite);
			// 			console.log('_this.ExtSettings.ShowHibrid: ' + _this.ExtSettings.ShowHibrid);
			// 			console.log('_this.ExtSettings.ShowTerrain: ' + _this.ExtSettings.ShowTerrain);
			// 			console.log('_this.ExtSettings.Allow45Imagery: ' + _this.ExtSettings.Allow45Imagery);
			// 			console.log('_this.ExtSettings.AllowStreetView: ' + _this.ExtSettings.AllowStreetView);
			// 		console.groupEnd();
			// 		console.group('Markers configuration');
			// 			console.log('_this.ExtSettings.ActivateMarkers: ' + _this.ExtSettings.ActivateMarkers);
			// 			console.log('_this.ExtSettings.MarkerCustomIconURL: ' + _this.ExtSettings.MarkerCustomIconURL);
			// 			console.log('_this.ExtSettings.MarkerLabelHPosition: ' + _this.ExtSettings.MarkerLabelHPosition);
			// 			console.log('_this.ExtSettings.MarkerLabelVPosition: ' + _this.ExtSettings.MarkerLabelVPosition);
			// 		console.groupEnd();
			// 		console.group('Markers advanced configuration');
			// 			console.log('_this.ExtSettings.MarkerActivateCluster: ' + _this.ExtSettings.MarkerActivateCluster);
			// 			console.log('_this.ExtSettings.MarkerClusterSize: ' + _this.ExtSettings.MarkerClusterSize);
			// 			console.log('_this.ExtSettings.MarkerClusterMaxZoom: ' + _this.ExtSettings.MarkerClusterMaxZoom);
			// 			console.log('_this.ExtSettings.MarkerForceMultiIcon: ' + _this.ExtSettings.MarkerForceMultiIcon);
			// 			console.log('_this.ExtSettings.MarkerAllowMoveMarkers: ' + _this.ExtSettings.MarkerAllowMoveMarkers);
			// 		console.groupEnd();
			// 		console.group('Shapes');
			// 			console.log('_this.ExtSettings.ActivateShapes: ' + _this.ExtSettings.ActivateShapes);
			// 			console.log('_this.ExtSettings.ActivateCircles: ' + _this.ExtSettings.ActivateCircles);
			// 			console.log('_this.ExtSettings.ShapeStrokeOpacity: ' + _this.ExtSettings.ShapeStrokeOpacity);
			// 			console.log('_this.ExtSettings.ShapeStrokeWeight: ' + _this.ExtSettings.ShapeStrokeWeight);
			// 			console.log('_this.ExtSettings.ShapeFillOpacity: ' + _this.ExtSettings.ShapeFillOpacity);
			// 		console.groupEnd();
			// 		console.group('Heatmap');
			// 			console.log('_this.ExtSettings.ActivateHeatmap: ' + _this.ExtSettings.ActivateHeatmap);
			// 			console.log('_this.ExtSettings.LineOpacity: ' + _this.ExtSettings.LineOpacity);
			// 			console.log('_this.ExtSettings.HeatmapRadius: ' + _this.ExtSettings.HeatmapRadius);
			// 		console.groupEnd();
			// 		console.group('Lines');
			// 			console.log('_this.ExtSettings.ActivateLines: ' + _this.ExtSettings.ActivateLines);
			// 			console.log('_this.ExtSettings.LineOpacity: ' + _this.ExtSettings.LineOpacity);
			// 			console.log('_this.ExtSettings.LineGeodesic: ' + _this.ExtSettings.LineGeodesic);
			// 		console.groupEnd();
			// 		console.group('Directions');
			// 			console.log('_this.ExtSettings.ActivatePointToPointDirections: ' + _this.ExtSettings.ActivatePointToPointDirections);
			// 			console.log('_this.ExtSettings.DirectionsStartLat: ' + _this.ExtSettings.DirectionsStartLat);
			// 			console.log('_this.ExtSettings.DirectionsStartLng: ' + _this.ExtSettings.DirectionsStartLng);
			// 			console.log('_this.ExtSettings.DirectionsEndLat: ' + _this.ExtSettings.DirectionsEndLat);
			// 			console.log('_this.ExtSettings.DirectionsEndLng: ' + _this.ExtSettings.DirectionsEndLng);
			// 			console.log('_this.ExtSettings.DirectionsDrivingMode: ' + _this.ExtSettings.DirectionsDrivingMode);
			// 		console.groupEnd();
			// 		console.group('Colors');
			// 			console.log('_this.ExtSettings.Color1: ' + _this.ExtSettings.Color1);
			// 			console.log('_this.ExtSettings.Color2: ' + _this.ExtSettings.Color2);
			// 			console.log('_this.ExtSettings.Color3: ' + _this.ExtSettings.Color3);
			// 		console.groupEnd()
			// 	console.groupEnd();
			// console.groupEnd();
		};
	// });
}

/***********************************
** Render Base Map
************************************/
function createMap(show_roadmap, show_satellite, show_hybrid, show_terrain, allow_45_imagery, allow_street_view, divName){
	//TODO
	// console.log('I am creating the base of the map');
	var map_types=new Array();
	if(show_roadmap==1) map_types.push(google.maps.MapTypeId.ROADMAP);
	if(show_satellite==1) map_types.push(google.maps.MapTypeId.SATELLITE);
	if(show_hybrid==1) map_types.push(google.maps.MapTypeId.HYBRID);
	if(show_terrain==1) map_types.push(google.maps.MapTypeId.TERRAIN);

	allow_street_view==1 ? allow_street_view=true : allow_street_view=false;
	
	var mapOptions = {
				mapTypeControlOptions: {
						mapTypeIds: map_types
					  },
				mapTypeId: map_types[0],
				streetViewControl: allow_street_view
			  };	
			  
	map = new google.maps.Map(document.getElementById(divName),mapOptions);
	
	allow_45_imagery==1? map.setTilt(45) : map.setTilt(0);
	
	latlngbounds = new google.maps.LatLngBounds();
}

/***********************************
** Draw Markers. Can be clustered.
************************************/
function drawMarkers(marker_custom_icon_url, multi_icon_markers, marker_is_draggable, marker_label_h_position, marker_label_v_position, activate_markers_cluster, marker_cluster_size, marker_max_cluster_zoom, activate_Circles, stroke_opacity, stroke_weight, fill_opacity, color1, color2, _rows, _overallthis){
	// console.log("I am starting to draw the markers");
	// console.log("Custom marker url: "+marker_custom_icon_url);
	// console.log(multi_icon_markers);
	// console.log(marker_is_draggable);
	// console.log(marker_label_h_position);
	// console.log(marker_label_v_position);
	// console.log(activate_markers_cluster);
	// console.log(marker_cluster_size);
	// console.log(marker_max_cluster_zoom);
	// console.log(activate_Circles);
	// console.log(stroke_opacity);
	// console.log(stroke_weight);
	// console.log(fill_opacity);
	// console.log(color1);
	// console.log(color2);
	// console.log(_rows);
	// console.log(_overallthis);
	// console.log("I am drawing markers");
	activate_markers_cluster==1 ? activate_markers_cluster=true : activate_markers_cluster=false;
	var infoList = [];
	var markers = [];

	for (var i=0,k=_rows.length;i<k;i++){

				var row = _rows[i];	
				if(row[2].text!='-'){
					//console.log(row);
					if(row[0].text!='-'){
						latlngbounds.extend(new google.maps.LatLng(parseFloat(row[0].text),parseFloat(row[1].text)));		
						// console.log(row[5].text);
						if(row[5].text!='-')
							var marker = new MarkerWithLabel({position: new google.maps.LatLng(parseFloat(row[0].text),parseFloat(row[1].text)),
															  map: map,
															  title: row[4].text,
															  draggable: marker_is_draggable==1 ? marker_is_draggable=true : marker_is_draggable=false,
															  labelContent: row[5].text,
															  labelClass: "markerlabels",
															  labelAnchor: new google.maps.Point(marker_label_h_position, marker_label_v_position),
															  labelInBackground: true //uncomment this to make label in front of marker
															 });
						else
							var marker = new MarkerWithLabel({position: new google.maps.LatLng(parseFloat(row[0].text),parseFloat(row[1].text)),
															  map: map,
															  draggable: marker_is_draggable==1 ? marker_is_draggable=true : marker_is_draggable=false,
															  title: row[4].text
															 });
						if(activate_Circles){
							// console.log("The markers will have circles too");
							// console.log(row[10].text);
							if(row[10].text=='-' && color1=='')
								color1 = '#008000';
							else if (row[10].text=='-')
								color1=color1;
							else
								color1=row[10].text;
							
							// console.log(row[11].text);
							if(row[11].text=='-' && color2=='')
								color2 = '#00FF40';
							else if (row[11].text=='-')
								color2=color2;
							else
								color2=row[11].text;
							// console.log(color1);
							// console.log(color2);
							//console.log(row);
							// console.log(row[8].text);
							var circle = new google.maps.Circle({
														map: map,
														strokeColor: color1,
														strokeOpacity: parseFloat(stroke_opacity),
														strokeWeight:  parseFloat(stroke_weight),
														fillColor: color2,
														fillOpacity: parseFloat(fill_opacity),
														center: new google.maps.LatLng(parseFloat(row[0].text),parseFloat(row[1].text)),
														radius: parseFloat(row[8].text)
							});
							circle.bindTo('center', marker, 'position');

							//Set appropriate zoom when only one circle is displayed on map
							if(_rows.length==1)
								latlngbounds = circle.getBounds();
							else{
								latlngbounds.extend(circle.getBounds().getNorthEast());
								latlngbounds.extend(circle.getBounds().getSouthWest());
							}
						}

						// console.log(_overallthis.ExtSettings.ImagesFolder);
						// console.log(multi_icon_markers);
						if(multi_icon_markers==1){
							// console.log(row[6].text);
							if(row[6].text!='' && row[6].text!='-') 
								marker.setIcon(_overallthis.ExtSettings.ImagesFolder+'/'+row[6].text); 
							else
								if (marker_custom_icon_url!= '' && marker_custom_icon_url!='(optional)') marker.setIcon(_overallthis.ExtSettings.ImagesFolder+'/'+marker_custom_icon_url);
						}
						else 	
							if (marker_custom_icon_url!= '' && marker_custom_icon_url!='(optional)') marker.setIcon(_overallthis.ExtSettings.ImagesFolder+'/'+marker_custom_icon_url);	
						// console.log(marker_custom_icon_url);
						
						//check for image path in the info window
						 // console.log(row[3].text);
						 if(row[3].text!='-'){
						 	// console.log(row[3].text.match(/(<img.*src=".*".*>)|(<img.*src='.*'.*>)/ig));

							var img_attribute = row[3].text.match(/(<img.*src=".*".*>)|(<img.*src='.*'.*>)/ig);

							// console.log(img_attribute != null);

							var img_link_within_extension = false;
							if(img_attribute != null){
								img_link_within_extension = true;
								if(img_attribute[0].indexOf(":\\")!=-1) img_link_within_extension = false; //local file
								if(img_attribute[0].indexOf(":\\\\")!=-1) img_link_within_extension = false; //local network shared folder
								if(img_attribute[0].indexOf("http://")!=-1) img_link_within_extension = false; //file in the web
							}

							if(img_link_within_extension)
							{
								var new_infoWindow = row[3].text.replace(img_attribute[0].match(/(src=".*")|(src='.*')/ig),
																"src='"+_overallthis.ExtSettings.ImagesFolder+'/'+img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].substring(5, (img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].length)-1)+"'");
								marker.infoWindow = new google.maps.InfoWindow({content: '<div class="infoWindows">'+new_infoWindow+'<br /></div>'});
								// console.log(new_infoWindow);
							}
							else
								marker.infoWindow = new google.maps.InfoWindow({content: '<div class="infoWindows">'+row[3].text+'<br /></div>'});
							
							// console.log(row[3].text);
							// marker.infoWindow = new google.maps.InfoWindow({content: '<div class="infoWindows">'+row[3].text+'<br /></div>'});
							
							// latlngbounds.extend(new google.maps.LatLng(parseFloat(row[0].text),parseFloat(row[1].text)));
							
							//Mouse events
							google.maps.event.addListener(marker,'mouseover',function() {
								infoList.push(this);
								var _this = this;
								setTimeout(function() { _this.infoWindow.open(map,_this); }, 100);
							});

							google.maps.event.addListener(marker,'mouseout',function() {						
								infoList.push(this);
								var toClose = this.infoWindow; 
								setTimeout(function() { toClose.close(); }, 250);
							});
						 }

						google.maps.event.addListener(marker, 'click', 
							(
							function(lat,lng) 
								{ 
								return function() { 
													_overallthis.Data.SearchColumn(0,lat,true);
													_overallthis.Data.SearchColumn(1,lng,true);
													}
								}
							)
							(row[0].text,row[1].text)
						);
						
						markers.push(marker);



					}
					
				}				
			};
			if(activate_markers_cluster) {
				var cluster_options = {gridSize: marker_cluster_size, maxZoom: marker_max_cluster_zoom};
				var marker_cluster = new MarkerClusterer(map, markers, cluster_options);
			}	
}

/***********************************
** Draw Shapes.
************************************/
function drawShapes(activate_Shapes, activate_Circles, activate_markers, stroke_opacity, stroke_weight, fill_opacity, color1, color2, _rows, _overallthis){
	// console.log("I am drawing shapes");
	// console.log(activate_Shapes);
	// console.log(activate_Circles);
	// console.log(activate_markers);
	// console.log(stroke_opacity);
	// console.log(stroke_weight);
	// console.log(fill_opacity);
	// console.log(color1);
	// console.log(color2);
	// console.log(_rows);
	// console.log(_overallthis);

	activate_Shapes==1 ? activate_Shapes=true : activate_Shapes=false;
	activate_Circles==1 ? activate_Circles=true : activate_Circles=false;
	
	if(activate_Shapes){
		// console.log("I am drawing polygons");
		var shapes = {},
			shape,
			item;
		
		for (i in _rows){
			if(_rows[i][2].text!='-'){
				if(_rows[i][1].text!='-'){
					// console.log(_rows[i][7].text);
					shape=_rows[i][7].text;
					if(_rows[i][10].text=='-' && color1=='')
						color1 = '#008000';
					else if (_rows[i][10].text=='-')
						color1=color1;
					else
						color1=_rows[i][10].text;
						
					if(_rows[i][11].text=='-' && color2=='')
						color2 = '#00FF40';
					else if (_rows[i][11].text=='-')
						color2=color2;
					else
						color2=_rows[i][11].text;
					// console.log(color1);
					// console.log(color2);
					
					item={
						latlng: new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)),
						stroke_color: color1,
						fill_color: color2,
						lat: parseFloat(_rows[i][0].text),
						lng: parseFloat(_rows[i][1].text),
						infos: _rows[i][9].text
					};
					
					latlngbounds.extend(new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)));
					
					if (!shapes[shape]) {
						shapes[shape] = [];
						}
					shapes[shape].push(item);
				}
			}
		};
		
		for (i in shapes){
		
			var sh = [];
			var lats_all = [];
			var lngs_all = [];
			var local_bounds = new google.maps.LatLngBounds();
			for (j = 0; j < shapes[i].length; j++){ 
				sh.push(shapes[i][j].latlng);
				lats_all.push(shapes[i][j].lat);
				lngs_all.push(shapes[i][j].lng);
				local_bounds.extend(shapes[i][j].latlng);
			}
			
			var polygon = new google.maps.Polygon({
												paths:sh,
												strokeColor: shapes[i][0].stroke_color,
												strokeOpacity: parseFloat(stroke_opacity),
												strokeWeight: parseFloat(stroke_weight),
												fillColor: shapes[i][0].fill_color,
												fillOpacity: parseFloat(fill_opacity)			
			});
			
			//Setup for distinct lats and lngs. Used for the click event
			function onlyUnique(value, index, self) { 
				return self.indexOf(value) === index;
			}
			
			lats_all = lats_all.filter(onlyUnique);
			lngs_all = lngs_all.filter(onlyUnique);
			
			//Mouse events
			google.maps.event.addListener(polygon, 'click', 
					(
					function(lats_all,lngs_all) 
						{						
						return function() { _overallthis.Data.SelectTextsInColumn(0,true, lats_all);
											_overallthis.Data.SelectTextsInColumn(1,true, lngs_all);
											}
						}
					)
				(lats_all, lngs_all)
			);
			
			//console.log(shapes[i][0].infos);
			if(shapes[i][0].infos!='-'){

				var img_attribute = shapes[i][0].infos.match(/(<img.*src=".*".*>)|(<img.*src='.*'.*>)/ig);

				// console.log(img_attribute != null);

				var img_link_within_extension = false;
				if(img_attribute != null){
					img_link_within_extension = true;
					if(img_attribute[0].indexOf(":\\")!=-1) img_link_within_extension = false; //local file
					if(img_attribute[0].indexOf(":\\\\")!=-1) img_link_within_extension = false; //local network shared folder
					if(img_attribute[0].indexOf("http://")!=-1) img_link_within_extension = false; //file in the web
				}

				if(img_link_within_extension)
				{
					var new_infoWindow = shapes[i][0].infos.replace(img_attribute[0].match(/(src=".*")|(src='.*')/ig),
													"src='"+_overallthis.ExtSettings.ImagesFolder+'/'+img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].substring(5, (img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].length)-1)+"'");
					var info_window = new google.maps.InfoWindow({content: '<div class="infoWindows">'+new_infoWindow+'<br /></div>',
														  		  position: local_bounds.getCenter()});
					// console.log(new_infoWindow);
				}
				else
					var info_window = new google.maps.InfoWindow({content: '<div class="infoWindows">'+shapes[i][0].infos+'<br /></div>',
														  position: local_bounds.getCenter()});

				google.maps.event.addListener(polygon, 'mouseover', 
					(function(info_window) { return function() { setTimeout(function() { info_window.open(map); }, 100);	} })
					(info_window)
				);
				
				google.maps.event.addListener(polygon, 'mouseout', 
					(function(info_window) { return function() { setTimeout(function() { info_window.close(); }, 250);	} })
					(info_window)
				);

			}
			polygon.setMap(map);
		}
	}
	
	if(activate_Circles && !activate_markers){
		// console.log("I am drawing circles");
		for (i in _rows){
			if(_rows[i][2].text!='-'){
				if(_rows[i][1].text!='-'){
					if(_rows[i][10].text=='-' && color1=='')
						color1 = '#008000';
					else if (_rows[i][10].text=='-')
						color1=color1;
					else
						color1=_rows[i][10].text;
						
					if(_rows[i][11].text=='-' && color2=='')
						color2 = '#00FF40';
					else if (_rows[i][11].text=='-')
						color2=color2;
					else
						color2=_rows[i][11].text;

					// console.log(color1);
					// console.log(color2);
					
					var circle = new google.maps.Circle({
												strokeColor: color1,
												strokeOpacity: parseFloat(stroke_opacity),
												strokeWeight: parseFloat(stroke_weight),
												fillColor: color2,
												fillOpacity: parseFloat(fill_opacity),
												center: new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)),
												radius: parseFloat(_rows[i][8].text)
					});
					
					//Set appropriate zoom when only one circle is displayed on map
					if(_rows.length==1)
						latlngbounds = circle.getBounds();
					else{
						//console.log(circle.getBounds());
						// var circle_bounds=circle.getBounds();
						// console.log(circle_bounds);
						// console.log(circle_bounds.getNorthEast());
						// console.log(circle_bounds.getSouthWest());
						latlngbounds.extend(circle.getBounds().getNorthEast());
						latlngbounds.extend(circle.getBounds().getSouthWest());
						//latlngbounds.extend(new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)));
					}
					
					//Mouse events
					google.maps.event.addListener(circle, 'click', 
							(
							function(circle_lat,circle_lng) 
								{						
								return function() { _overallthis.Data.SelectTextsInColumn(0,true, circle_lat);
													_overallthis.Data.SelectTextsInColumn(1,true, circle_lng);
													}
								}
							)
						(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text))
					);
					
					//console.log(_rows[i][8].text)



					if(_rows[i][9].text!='-'){


						var img_attribute = _rows[i][9].text.match(/(<img.*src=".*".*>)|(<img.*src='.*'.*>)/ig);

						// console.log(img_attribute != null);

						var img_link_within_extension = false;
						if(img_attribute != null){
							img_link_within_extension = true;
							if(img_attribute[0].indexOf(":\\")!=-1) img_link_within_extension = false; //local file
							if(img_attribute[0].indexOf(":\\\\")!=-1) img_link_within_extension = false; //local network shared folder
							if(img_attribute[0].indexOf("http://")!=-1) img_link_within_extension = false; //file in the web
						}

						if(img_link_within_extension)
						{
							var new_infoWindow = _rows[i][9].text.replace(img_attribute[0].match(/(src=".*")|(src='.*')/ig),
															"src='"+_overallthis.ExtSettings.ImagesFolder+'/'+img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].substring(5, (img_attribute[0].match(/(src=".*")|(src='.*')/ig)[0].length)-1)+"'");
							var info_window = new google.maps.InfoWindow({content: '<div class="infoWindows">'+new_infoWindow+'<br /></div>',
																  		  position: circle.getCenter()});
							// console.log(new_infoWindow);
						}
						else
							var info_window = new google.maps.InfoWindow({content: '<div class="infoWindows">'+_rows[i][8].text+'<br /></div>',
																	  position: circle.getCenter()});

	
						google.maps.event.addListener(circle, 'mouseover', 
							(function(info_window) { return function() { setTimeout(function() { info_window.open(map); }, 100);	} })
							(info_window)
						);
						
						google.maps.event.addListener(circle, 'mouseout', 
							(function(info_window) { return function() { setTimeout(function() { info_window.close(); }, 250);	} })
							(info_window)
						);
					}
					
					
					circle.setMap(map);
				}
			}
		}
	}
}

/***********************************
** Draw Heatmaps.
************************************/
function drawHeatMap(heatmap_opacity, heatmap_radius, color1, color2, color3, _rows){
	// console.log("I am drawing heatmaps");
	// console.log(heatmap_opacity);
	// console.log(heatmap_radius);
	// console.log(color1);
	// console.log(color2);
	// console.log(color3);
	// console.log(_rows);

	var markers=[];
	for(i=0;i<_rows.length;i++){
		// console.log(_rows[i]);
		// console.log(parseFloat(_rows[i][11].text));
		if(_rows[i][2].text!='-'){
			if(_rows[i][1].text!='-'){
				markers[i]={
					  location: new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)),
					  weight: parseFloat(_rows[i][12].text)
				};
				latlngbounds.extend(new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)));
			}
		}
	}
	
	var color_gradient = [];
	if(color1&&color2&&color3) {
		if(color1.charAt(0)=='#'&&color1.length==7&&color2.charAt(0)=='#'&&color2.length==7&&color3.charAt(0)=='#'&&color3.length==7){
			var rgb_color0='rgba('
				+parseInt(color1.substring(1,3),16)+','
				+parseInt(color1.substring(3,5),16)+','
				+parseInt(color1.substring(5),16)+',0)';
			var rgb_color1='rgba('
							+parseInt(color1.substring(1,3),16)+','
							+parseInt(color1.substring(3,5),16)+','
							+parseInt(color1.substring(5),16)+',1)';				
			var rgb_color2='rgba('
							+parseInt(color2.substring(1,3),16)+','
							+parseInt(color2.substring(3,5),16)+','
							+parseInt(color2.substring(5),16)+',1)';
			var rgb_color3='rgba('
							+parseInt(color3.substring(1,3),16)+','
							+parseInt(color3.substring(3,5),16)+','
							+parseInt(color3.substring(5),16)+',1)';
							
			var color_gradient=[rgb_color0, rgb_color1, rgb_color2, rgb_color3, 'rgba(255,0,0,1)'];
		}	
		else ;
			// console.log("Color error. Using default colors. Please use HEX color. Example: #FFFFFF");
	}
	
	var hm=new google.maps.visualization.HeatmapLayer({
												data: markers,
												opacity: parseFloat(heatmap_opacity),
												gradient: (color_gradient.length==0)? null : color_gradient,
												radius: parseFloat(heatmap_radius)
												}); 						
	hm.setMap(map);
}

/***********************************
** Draw Lines.
************************************/
function drawLines(line_opacity, color1, activate_geodesic, _rows, _overallthis){
	// console.log("I am drawing lines");
	// console.log(line_opacity);
	// console.log(color1);
	// console.log(activate_geodesic);
	// console.log(_rows);
	// console.log(_overallthis);

	var paths = {},
		path_name,
		item;
		
	for (i in _rows){
		//console.log(_rows[i]);
		if(_rows[i][2].text!='-'){
			if(_rows[i][1].text!='-'){
				path_name = _rows[i][13].text;
				if(_rows[i][14].text=='-' && color1=='')
						color1 = '#008000';
					else if (_rows[i][14].text=='-')
						color1=color1;
					else
						color1=_rows[i][14].text;
				item={
						latlng: new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)),
						stroke_color: color1,
						stroke_weight: parseFloat(_rows[i][15].text),
						lat: parseFloat(_rows[i][0].text),
						lng: parseFloat(_rows[i][1].text),
					};
					
				latlngbounds.extend(new google.maps.LatLng(parseFloat(_rows[i][0].text), parseFloat(_rows[i][1].text)));
				
				if (!paths[path_name]) {
					paths[path_name] = [];
					}
				paths[path_name].push(item);
			}
		}
	}
	
	for (i in paths){	
		var sh = [];
		var lats_all = [];
		var lngs_all = [];
		for (j = 0; j < paths[i].length; j++){
			sh.push(paths[i][j].latlng);
			lats_all.push(paths[i][j].lat);
			lngs_all.push(paths[i][j].lng);
		} 
		
		var polyline = new google.maps.Polyline({
											path: sh,
											strokeColor: paths[i][0].stroke_color,
											strokeOpacity: parseFloat(line_opacity),
											strokeWeight: paths[i][0].stroke_weight,
											geodesic: activate_geodesic==1 ? activate_geodesic=true : activate_geodesic=false
		});
		
		//Setup for distinct lats and lngs. Used for the click event
		function onlyUnique(value, index, self) { 
			return self.indexOf(value) === index;
		}
		
		lats_all = lats_all.filter(onlyUnique);
		lngs_all = lngs_all.filter(onlyUnique);
		
		//Mouse events
		google.maps.event.addListener(polyline, 'click', 
				(
				function(lats_all,lngs_all) 
					{						
					return function() { _overallthis.Data.SelectTextsInColumn(0,true, lats_all);
										_overallthis.Data.SelectTextsInColumn(1,true, lngs_all);
										}
					}
				)
			(lats_all, lngs_all)
		);

		polyline.setMap(map);
	}
}

/***********************************
** Draw Directions.
************************************/
function drawDirections(p2p_start_lat, p2p_start_lng, p2p_end_lat, p2p_end_lng, p2p_driving_mode, doc){
	
	// console.log("I am drawing directions");
	// console.log(p2p_start_lat);
	// console.log(p2p_start_lng);
	// console.log(p2p_end_lat);
	// console.log(p2p_end_lng);
	// console.log(p2p_driving_mode);
	// console.log(_overallthis);

	var start = new google.maps.LatLng(parseFloat(p2p_start_lat), parseFloat(p2p_start_lng));
	var end = new google.maps.LatLng(parseFloat(p2p_end_lat), parseFloat(p2p_end_lng));

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();

	  directionsDisplay = new google.maps.DirectionsRenderer();
	  directionsDisplay.setMap(map);

	  var request = {
	      origin:start,
	      destination:end,
	      travelMode: p2p_driving_mode=='DRIVING' ? google.maps.TravelMode.DRIVING : google.maps.TravelMode.WALKING
	  };
	  directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      	directionsDisplay.setDirections(response);
	      	// console.log(response.routes[0].legs[0].distance.text);

			// var doc = Qv.GetCurrentDocument();
			// doc.SetVariable("vTraveledDistance","Traveled distance: "+ response.routes[0].legs[0].distance.text);

			// console.log("done");
	    }
	  });
}

//Initiate extension
//extension_Init();

function workaroundLoadGoogleAPI(){setTimeout(function(){alert("hi")}, 1000);}; //Workaround to wait for the Google API to load correctly

//IE console doesn't have group or groupEnd, so:
var noop = function noop() {};
if (!console['group']) console['group'] = noop;
if (!console['groupEnd']) console['groupEnd'] = noop;