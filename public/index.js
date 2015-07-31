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

var showDrivers = function() {
	//go through myUsers
	app.myUsers.models = _.filter(app.myUsers.models, function(user) {
		return user.get("driver") === true
	})
}

var showRiders = function() {
	app.myUsers.models = _.reject(app.myUsers.models, function(user) {
		return user.get("driver") === true
	})
}

var viewProfile =  function(modelParam, collectionParam){
	$(".view-container").fadeIn()
	$(".edt").hide()
	$(".prof").show()
	$("#user-focus").slideDown()
	//finds the model of the clicked view, to populate the profile view
	var userId = modelParam.get("email")
	var userModel = collectionParam.find(function(user){
		return user.get("email") === userId
	})

	if (userModel) {
		app.profileView.render(userModel)
	}
}

var setCurrentUser = function(jsonData){
	app.CurrentUser = jsonData
	currentUserEmail = jsonData.user.email
	$("#current-user").text(jsonData.user.	username)
	formGroup()
}

var formGroup = function(){

	//create a new group for the user
	if (app.carpool){
		app.carpool.reset()
		//temp disabled to check about disappearing group lists
	} else {
		app.carpool = new app.Collections.Group()
	}
	//call the server for anyone currently in group
	app.carpool.fetch({
		headers: {email: app.CurrentUser.user.email},
		//data: {rider_id: inviteId},
	})
		.success( function(data){ 
			console.log(data)
			activePins=0
			_.each(app.carpool.models, function(model){
				model.initialize()
				var view = new app.Views.GroupUser({model})
				view.render()
				//drop pins for everyone but current user - needs DRYed
				if (view.model.get("email") !== currentUserEmail) {
					var homeMarker = view.model.get("home_marker")
					var workMarker = view.model.get("work_marker")
					
					homeMarker.icon.fillColor = pinColors[activePins]
					workMarker.icon.fillColor = pinColors[activePins]
					
					homeMarker.setMap(map)
					workMarker.setMap(map)
					activePins+=1
				}
			})
			//show button if they have a carpool group
			if (app.carpool.length > 0) {
				//if current user is owner let them disband
				if (currentUserEmail === data.group[0].email){
					$(".leave").hide()
					$(".disband").show()
				} else {
					$(".leave").show()
					$(".disband").hide()
				}
			}
		}) 
		
		.error( function(error){
			console.log(error)
		})
	populateList()
}

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
    //center on DC
    var mapOptions = {
		center: { lat: 38.899, lng: -77.015},
    	zoom: 10
    };
    //create the map object
	map = new google.maps.Map( document.getElementById('map-canvas'), mapOptions);
	
	if (app.CurrentUser) {
		var homeLatLng = new google.maps.LatLng(app.CurrentUser.itinerary.home_lat, app.CurrentUser.itinerary.home_lng )
		var workLatLng = new google.maps.LatLng( app.CurrentUser.itinerary.work_lat, app.CurrentUser.itinerary.work_lng )

		var homeMarker = new google.maps.Marker({
			position: homeLatLng,
			map: map,
		})

		bounds.extend(homeMarker.position)

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
google.maps.event.addDomListener(window, 'load', initializeMap)

var closeViewOnEsc = function(e) {
	if (e.keyCode === 27) {
		//clear all nput fielders in signin
		$(this.$el).find("input").val("")
		app.router.navigate("home", {trigger: true})
	}
}

var populateList = function(){
	if (app.CurrentUser) {
		emailString = app.CurrentUser.user.email
	}

	$.ajax(rootUrl+"/demo_users", {
		method: "GET",
		headers: {
				email: emailString
			},
		//Consider moving this to a collection render method
		success: function(json) {
			//reset the user collection so it doesn't repeat
			app.myUsers.reset()
			app.dispatcher.trigger("reset")

			var userList = json.user

			_.each(userList, function(item){
			   app.myUsers.add(item) 
			})

			if (app.CurrentUser && app.CurrentUser.user.driver) {
				showRiders()
			} else {
				showDrivers()
			}

			_.map(app.myUsers.models, function(model) {
//TO DO: only generate a view if user is groupless				
				var view = new app.Views.User({model})
				view.render()
			})

	//consider instantiating a second router, in case users don't populate
		}
	})
}

$(document).on("ready", function(){

	app.dispatcher = _.clone(Backbone.Events)

	app.profileView = new app.Views.Profile()
	app.signinView = new app.Views.Signin()
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
