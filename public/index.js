var app = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {}
}

var loggedIn
var morning
//currently disused
var userViewsArray = []

//test this when server is up
var populateList = function(){
	$.ajax("http://557ed386.ngrok.io/demo_users", {
		method: "GET",
		success: function(json) {
			console.log(json)
			var userList = json.user
			console.log(userList)
			_.each(userList, function(item){
			   app.myUsers.add(item) 
			})
			_.map(app.myUsers.models, function(model) {
//TO DO: only generate a view if user is groupless				
				var view = new app.Views.User({model})
				userViewsArray.push(view)
				view.render()
			})
			console.log(app.myUsers)
			//consider instantiating a second router, in case users don't populate

		}

	})
}

$(document).on("ready", function(){
	app.dispatcher = _.clone(Backbone.Events)

	app.profileView = new app.Views.Profile()
	app.signinView = new app.Views.Signin()
	app.editView = new app.Views.EditUser()
	
	app.myUsers = new app.Collections.UserList

//decide whether to sort by morning or evening - probably don't need
	if ( new Date().getHours() < 10 || new Date().getHours > 20) {
		morning = true
		//app.myUsers.comparator = "morning_time"
	} else {
		morning = false
		//app.myUsers.comparator = "evening_time"
	}
	
	//a listener of requests to sort list. 
		//Kill the views
		//sort the collection
		//generate new views

	//a listener for filter requests
		//jquery hide those that don't apply

	populateList()
	
	app.router = new app.Routers.MainRouter()
	Backbone.history.start()
	
})

//fetch for dummy data, switched away from fetch b/c
	//collection was not cooperating with data table
/*	app.myUsers.fetch({
		success: function(data) {
			console.log(data)
			app.myUsers.sort()
			//this sorts by the "morning_time" comparator, which is dumb and does not account for too-early times
			_.map(app.myUsers.models, function(model) {
				//TO DO: only generate a view if user is groupless
				
				var view = new app.Views.User({model})
				userViewsArray.push(view)
				view.render()
			})
			app.router = new app.Routers.MainRouter()
			Backbone.history.start()
		}
	})*/

//derogated - functionality now exists on the view
	/*app.myUsers.on("change", function(model){
		var i = model.get("id") - 1
		console.log('hi')
		userViewsArray[i].updateView(model)
	})*/

	//this gives me an array of user views which i can sort
/*	app.myUsers.on("add", function(model){		
		var view = new app.Views.User({model})
		userViewsArray.push(view)
		view.render()
	})*/