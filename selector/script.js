jQuery(document).ready(main)
var map;
var areaSelect = null;
var bound = null;
function main() {
  map = L.map('map', {}).setView([49.5, 16], 14);

  L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    atribution: 'Map data &copy; OSM.org'
  }).addTo(map);

  $('.collapse .show').collapse('show')
}

//"https://nominatim.openstreetmap.org/search.php?format=json&q="

var options = {
	url: function(phrase) {
		return "https://nominatim.openstreetmap.org/search.php?format=json&q=" + phrase;
	},
	getValue: "display_name",
	list: {

		onSelectItemEvent: function() {
			var selected_place = $("#autocomplete").getSelectedItemData();
			map.panTo(new L.LatLng(selected_place.lat, selected_place.lon));
			bound = selected_place.boundingbox;
		}
	}
};

$("#autocomplete").easyAutocomplete(options);	
var selected_area_bound = null;
var bounds_selected_for_sending = null
var total_area_size = null;
function select_map(){
	if(bound == null){
		alert("No map selected");
	} else{
		if(areaSelect != null){
			areaSelect.remove();
		}
		$('#collapseOwo').collapse('hide')
		$('#collapseTwo').collapse('show')
		$('#collapseThree').collapse('hide')
		areaSelect = L.areaSelect({width:200, height:300});
		areaSelect.addTo(map);

		// Read the bouding box
		selected_area_bound = areaSelect.getBounds();
		bounds_selected_for_sending = [selected_area_bound._southWest.lat,selected_area_bound._southWest.lng,selected_area_bound._northEast.lat,selected_area_bound._northEast.lng];
		total_area_size = calculate_area_by_bounds(selected_area_bound.getNorthWest(),selected_area_bound.getSouthWest(),selected_area_bound.getSouthEast());
		console.log(bounds_selected_for_sending);
		$("#area_selected_field").html(total_area_size);
		// Get a callback when the bounds change
		areaSelect.on("change", function() {
			console.log(map.getZoom());
		    selected_area_bound = this.getBounds();
		    bounds_selected_for_sending = [selected_area_bound._southWest.lat,selected_area_bound._southWest.lng,selected_area_bound._northEast.lat,selected_area_bound._northEast.lng];
			total_area_size = calculate_area_by_bounds(selected_area_bound.getNorthWest(),selected_area_bound.getSouthWest(),selected_area_bound.getSouthEast());
		    console.log(bounds_selected_for_sending);
		    $("#area_selected_field").html(total_area_size);
		});

		// Set the dimensions of the box
		areaSelect.setDimensions({width: 500, height: 500})
	}
}

function select_area(){
	if(bound == null){
		alert("No map selected");
		$('#collapseOwo').collapse('show')
		$('#collapseTwo').collapse('hide')
		$('#collapseThree').collapse('hide')
	} 
	else if(selected_area_bound == null){
		alert("Select the area in map");
	}
	else if(total_area_size > 1){
		alert("Select less than 1 KM2");
	}
	else{
		$('#collapseOwo').collapse('show')
		$('#collapseTwo').collapse('hide')
		$('#collapseThree').collapse('show')
	}
}

function getDistanceInMeters(location1, location2) {
    var lat1 = location1.lat;
    var lon1 = location1.lng;

    var lat2 = location2.lat;
    var lon2 = location2.lng;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return (d * 1000);

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}

function calculate_area_by_bounds(nw,sw,se){
	return (getDistanceInMeters(sw, nw)*getDistanceInMeters(sw, se)/1000000).toFixed(4);
}

function finish(){
	var name = $("#c_name").val();
	var email = $("#c_email").val();
	var data = {"name":name,"bound":bounds_selected_for_sending,"email":email};
	var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://cityscope.gok03.com:5000/",
  "method": "POST",
  "headers": {
    "content-type": "application/json"
  },
  "data": JSON.stringify(data)
}

if(bound == null){
		alert("No map selected");
		$('#collapseOwo').collapse('show')
		$('#collapseTwo').collapse('hide')
		$('#collapseThree').collapse('hide')
	} 
	else if(selected_area_bound == null){
		alert("Select the area in map");
		$('#collapseOwo').collapse('hide')
		$('#collapseTwo').collapse('show')
		$('#collapseThree').collapse('hide')
	}
	else if(total_area_size > 1){
		alert("Select less than 1 KM2");
		$('#collapseOwo').collapse('hide')
		$('#collapseTwo').collapse('show')
		$('#collapseThree').collapse('hide')
	}
	else if(name == null || email == null){
		alert("Please Enter Name and Email");
	}
	else{
		$.ajax(settings).done(function (response) {
  		if(response != "404"){
  			alert("Redirecting to Result Page");
  			$(".loading").hide()
  			window.location.href = response;
  		}
		});
		if(total_area_size>0.3){
			alert("The area selected is large, It takes 5 to 10 min to process. You will get a mail with link");
		}
		$(".loading").show()
	}
}
