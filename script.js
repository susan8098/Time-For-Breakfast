
// $(window).load(function() {
// 	$("#load").delay(2000).fadeOut("slow");
// });


var app = {};

app.clientId = 'HLU1Y0O4B5E21MZQ0V1HKDXYKVH5VKNR4CVDBDDHPYOOZGRS';
app.clientSecret = '2EN3T5AJYGP40N1AO5JWHXHKYOWLXQA4W0QJ1I2OJ42QSWGP';




var map;
function initMap(lat, long) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: long},
    zoom: 16
  });
}

// hide places section and map when landing on the page
$('#map').hide();
$('.places').hide();
$('#load').hide();


$(function() {
	app.init();

});

// get users date & time
// store users date & time in a variable
// store desired hours in a variable 
// if users date & time is NOT between the hours variable, 
// then prompt a message that says "it's not breakfast time at the moment!"

var userDate = new Date();
console.log(userDate);

var userHours = userDate.getHours();
console.log(userHours);

var userMinutes = userDate.getMinutes();
console.log(userMinutes);

var dimsumwhere = '<a href="http://dimsumwhere.com/">Dimsum</a>';


app.init = function() {
	// code to kick off the app 
	$('.start').on('submit', function(e) {
		e.preventDefault();


		// Set Time limitation
		if( userHours >= 5 &&  userHours <= 16 ) {
			console.log('it still breakfast time');

			$('#placeIn').html('<div id="load"><div class="color"><h1 class="spinSun"><i class="fa fa-sun-o fa-spin"></i></h1><h1 class="hide">Time for Brunch!</h1><form class="start"><div class="submitButton"><input type="submit" value="Search brunch near me"></div></form></div></div>');

			// getting geolocation from user
			navigator.geolocation.getCurrentPosition(function(position){
				app.lat = position.coords.latitude;
				app.long = position.coords.longitude;
				console.log(app.lat, app.long);
				
				// calling the parameters from map
				initMap(app.lat, app.long);

				// call to search from foursquare
				app.getBrunchLocations()

				// show places section and map div when search
				$('.places').show();
				$('#map').show();
			})
		} else { // Not Breakfast Time!
			console.log('breakfast time has passed!');

			// no breakfast message
			$('.title').html("<h2>It's passed breakfast time!</h2> <h3> maybe try again in the morning?</h3>");
			$('form').hide();

		}
			
	}); // end of submit function
}


app.getBrunchLocations = function() {
	// code to get brunch location info
	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/explore?&v=20130815',
		method: 'GET',
		dataType: 'json',
		data: {
			client_id: app.clientId,
			client_secret: app.clientSecret,
			ll: app.lat + ',' + app.long ,
			radius: 1000,
			section: 'food',
			query:'breakfast' ,
			limit: 13,
			venuePhotos: 1,
			openNow: 1,
			sortByDistance: 1,
		}
	}).then(function(results) {
		var object = results.response.groups[0].items;
		console.log(object);

		$('#placeIn').empty();

		app.displayLocations(object);

		$('body').animate( { 
            scrollTop: $('#places').offset().top}, 500);
	});
}

app.displayLocations = function(object) {
	// code to display results and info on the page
	// including map and marker 

	$.each(object, function(i, place) {

		// Name of the place
		var placeName = $('<h3>').text(place.venue.name);
		
		// variable shortcut to get to photos
		var photoShort = place.venue.featuredPhotos.items[0];

		// Photo of the place
		var photo = $('<img>').attr('src', photoShort.prefix + photoShort.height + photoShort.suffix);

		// rating
		var rating = $('<p>').addClass('rating').html('<i class="fa fa-thumbs-up"></i> ' + place.venue.rating);

		// container Div
		var containerDiv = $('<div>').addClass('placeContainers').append(placeName, photo, rating);

		// container with link
		var placeContainers = $('<a>').addClass('placeUrl').attr('href', place.venue.url).attr('target', 'blank').append(containerDiv); 

		var placePosition = {lat: place.venue.location.lat, lng: place.venue.location.lng};

		console.log (placePosition);

		// filtering out starbucks with if statement
		if(place.venue.name !== 'Starbucks') {
			$('#placeIn').append(placeContainers);

			// content inside marker
			var markerContent = '<h3>' + place.venue.name + '</h3>' + '<p> You are ' + place.venue.location.distance + 'm away </p>';

			// marker info window
			var infowindow = new google.maps.InfoWindow({
			    content: markerContent,
			    maxWidth: 200
			});

			// marker
			var marker = new google.maps.Marker({
			  position: placePosition,
			  map: map,
			  title: 'Hello World!'
			});

			marker.addListener('click', function() {
			    infowindow.open(map, marker);
			});
		}

		// when rating says "undefined"
		if(place.venue.rating === 'undefined') {
			var norating = $('p.rating').append('<p>woops, no reviews available!</p>');
			console.log('no rating')
		}
	});
}






// find out user's location
// use the location (longtitude, latitude) 
// get breakfast/brunch locations data from foursquare
// filter data locations relating to close proximaty to users location
// display data and results on the page 
