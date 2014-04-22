$(function() {

	$.doTimeout('location1', 10000, function(){$('#location1').html('Acquiring location took too long (or was refused) and timed out.')}, true);
	$.doTimeout('location2', 10000, function(){$('#location2').html('Acquiring location took too long (or was refused) and timed out.')}, true);
	$.doTimeout('location3', 5000, function(){$('#location3').html('Acquiring location took too long and timed out.')}, true);

	$.get("http://ipinfo.io", function(result) {
		$.doTimeout('location3')
		$('#location3').html(
			'<ul>' +
			'<li>Country Code: ' + result.country + '</li>' + 
			'<li>City: ' + result.city + '</li>' +
			'</ul>'
		);
	}, "jsonp");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				$.getJSON('http://ws.geonames.org/countryCode', {
					username: 'buildempire',
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					type: 'JSON'
				}, function(result) {
					$.doTimeout('location1')
					$('#location1').html(
						'<ul>' +
						'<li>Country Code: ' + result.countryCode + '</li>' + 
						'<li>Country Name: ' + result.countryName + '</li>' +
						'</ul>'
					);
				});
				$.getJSON('http://ws.geonames.org/findNearbyPlaceName', {
					username: 'buildempire',
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					type: 'JSON'
				}, function(result) {
					$.doTimeout('location2')
					$('#location2').html(
						'<ul>' +
						'<li>Country Code: ' + result.geonames[0].countryCode + '</li>' + 
						'<li>Country Name: ' + result.geonames[0].countryName + '</li>' +
						'<li>Place Name: ' + result.geonames[0].name + '</li>' +
						'</ul>'
					);
				});
			},
			function(err) {
				$('#location1').html('ERROR(' + err.code + '): ' + err.message)
				$('#location2').html('ERROR(' + err.code + '): ' + err.message)
			}
		);
	} else {
		$('#location1').html('Browser does not support location services.')
	}

});