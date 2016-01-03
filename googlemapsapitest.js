	var location1;
	var location2;
	var address1;
	var address2;
	var centerlatlng;
	var geocoder;
	var map;
	var distance;
	
	function initializeAndShowMap() { // finds the latitude and longitude for both addresses and calls the show map function to display the map
		geocoder = new google.maps.Geocoder(); // creates a new geocode object using Geocoder function
		address1 = document.getElementById("address1").value; // gets first address from html field
		address2 = document.getElementById("address2").value; // gets second address from html field
		
		if (geocoder) { // finds the locations of both addresses and shows them on the map
			geocoder.geocode({'address': address1}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					location1 = results[0].geometry.location; // computes the latitude and longitude of first address
				}
				else {	
					alert("Geocode failed because of the following: " + status); // alerts the user if something went wrong
				}
			});
			geocoder.geocode({'address': address2}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					location2 = results[0].geometry.location; // computes the latitude and longitude of the second address
					showMap(); // calling the showMap() function to create and show the map 
				} 
				else {
					alert("Geocode failed because of the following: " + status);
				}
			});
		}
	}
		
	function showMap() { // creates and shows the map with markers and path lines
		centerlatlng = new google.maps.LatLng((location1.lat()+location2.lat())/2,(location1.lng()+location2.lng())/2); //computes the location of the center of the map using the average between the 2 entered locaitons
		
		var mapOptions = { // sets the map options 
		
			zoom: 1, // set zoom level
			center: centerlatlng, // set center of map
			mapTypeId: google.maps.MapTypeId.HYBRID // sets map type
		};
		
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions); // creates a new map object with canvas where map is shown and the map options specified above
		
		directionsService = new google.maps.DirectionsService(); // shows the route between the two selected locations
		
		directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true,
			suppressInfoWindows: true
		});
		directionsDisplay.setMap(map); // sets up our map object with directions between both locations

		var request = {
			origin:location1, // starting location 
			destination:location2, // destination location 
			travelMode: google.maps.DirectionsTravelMode.WALKING // computes time to walk the distance between the two locations
		};
		
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				distance = "The distance between the two locations is: "+response.routes[0].legs[0].distance.text; // calculates the distance between the two locations in miles
				distance += "<br/>The aproximate time to walk between the two locations is: "+response.routes[0].legs[0].duration.text; // calculates the walking time between the two locations
				document.getElementById("distance_road").innerHTML = distance; // shows distance in the html file/webpage
			}
		});

		var line = new google.maps.Polyline({ // shows the line between the two selected locations
			map: map, 
			path: [location1, location2],
			strokeWeight: 7,
			strokeOpacity: 0.8,
			strokeColor: "#FF0000" // shortest path between the two locations shown in red
		});
			
		var marker1 = new google.maps.Marker({ // creates the first marker for the starting location	
			map: map, 
			position: location1,
			title: "Origin"
		});
		
		var marker2 = new google.maps.Marker({ // creates the second marker for the destination location 
			map: map, 
			position: location2,
			title: "Destination"
		});
		
		// text 1 and text 2 create the text to be shown in the info windows when the marker is clicked for the origin and the destination respectively
		var text1 = '<div id="content">' + '<h1 id="firstHeading">Origin</h1>' + '<div id="bodyContent">' + '<p>Lat And Long Coordinates: ' + location1 + '</p>' + '<p>Address: ' + address1 + '</p>' + '</div>' + '</div>';
		var text2 = '<div id="content">' + '<h1 id="firstHeading">Destination</h1>' + '<div id="bodyContent">' + '<p>Lat And Long Coordinates: ' + location2 + '</p>' + '<p>Address: ' + address2 + '</p>' + '</div>' + '</div>';
		
		// create info boxes for the two markers
		var infowindow1 = new google.maps.InfoWindow({
			content: text1
		});
		var infowindow2 = new google.maps.InfoWindow({
			content: text2
		});

		google.maps.event.addListener(marker1, 'click', function() { // adds action events so the info windows will be shows when the marker on the map is clicked 
			infowindow1.open(map,marker1);
		});
		google.maps.event.addListener(marker2, 'click', function() {
			infowindow2.open(map,marker1);
		});
		
		// computes the distance between the two locations
		var R = 6371; 
		var dLat = toRad(location2.lat() - location1.lat()); 
		var dLon = toRad(location2.lng() - location1.lng()); 
		
		var dLat1 = toRad(location1.lat());
		var dLat2 = toRad(location2.lat());
		
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(dLat1) * Math.cos(dLat1) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
		var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
		var d = R * b;
		
		document.getElementById("distance_direct").innerHTML = "<br/>The distance between the two points is (indicated by the red line): " + d;
	}
	
	function toRad(deg) {
		return deg * Math.PI / 180;
	}