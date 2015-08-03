var app = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {}
}
var map
var morning
var activePins = 0
var pinColors = [
	"green",
	"blue",
	"orange",
	'yellow',
	'silver',
	'purple',
	'brown',
	'teal',
	'pink',
]
var rootUrl = "https://sluggr-api.herokuapp.com"
var currentUserEmail
var errorCode

var convertTime = function(timeString) {	
	var d = new Date(timeString)
	var h = d.getUTCHours()
	var m = d.getUTCMinutes()
	if (m < 10) {
		m = "0"+m
	}
	var convertedTime
	if (h > 12) {
		convertedTime = (h-12)+":"+m+" PM"
	}
	else if (h === 0) {
		convertedTime = "12:"+m+" AM"
	} else {
		convertedTime = h+":"+m+" AM"
	}
	return convertedTime
}

var initializeMap = function() {	
	var bounds = new google.maps.LatLngBounds()
    //center on DC by default
    var mapOptions = {
		center: { lat: 38.899, lng: -77.015},
    	zoom: 10
    };
    //create the map object
	map = new google.maps.Map( document.getElementById('map-canvas'), mapOptions);
	
	//drop pins at home and work locations
		//use them as map boundaries
	if (app.CurrentUser) {
		var homeLatLng = new google.maps.LatLng(app.CurrentUser.itinerary.home_lat, app.CurrentUser.itinerary.home_lng )
		var homeMarker = new google.maps.Marker({
			position: homeLatLng,
			map: map,
		})
		bounds.extend(homeMarker.position)

		var workLatLng = new google.maps.LatLng( app.CurrentUser.itinerary.work_lat, app.CurrentUser.itinerary.work_lng )
		var workMarker = new google.maps.Marker({
			position: workLatLng,
			map: map,
		})
		bounds.extend(workMarker.position)
			map.fitBounds(bounds)
	}
	//add current user markers
}
//generate map on load
//google.maps.event.addDomListener(window, 'load', initializeMap)

var closeViewOnEsc = function(e) {
	if (e.keyCode === 27) {
		//clear all nput fielders in signin
		$(this.$el).find("input").val("")
		app.router.navigate("home", {trigger: true})
	}
}

$(document).on("ready", function(){
	initializeMap()

	app.dispatcher = _.clone(Backbone.Events)

	app.profileView = new app.Views.Profile()
	app.signinView = new app.Views.Signin()
	app.carpool = new app.Collections.Group()
	app.groupView = new app.Views.GroupPanel()
	
	app.myUsers = new app.Collections.UserList

//decide whether to sort by morning or evening - probably don't need
	if ( new Date().getHours() < 10 || new Date().getHours > 20) {
		morning = true
		//app.myUsers.comparator = "morning_time"
	} else {
		morning = false
		//app.myUsers.comparator = "evening_time"
	}


	$(".view-backdrop").on("click", function(){
		app.dispatcher.trigger("close")
	})

	app.router = new app.Routers.MainRouter()
	Backbone.history.start()

	app.router.navigate("signin", {trigger:true})
	
})
