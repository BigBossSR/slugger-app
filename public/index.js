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



$(document).on("ready", function(){
	app.dispatcher = _.clone(Backbone.Events)

	app.profileView = new app.Views.Profile()
	
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
		//jquery hide those that don't applys

	app.myUsers.fetch({
		success: function() {
			app.myUsers.sort()
			//this sorts by the "morning_time" comparator, which is dumb and does not account for too-early times
			_.map(app.myUsers.models, function(model) {
				var view = new app.Views.User({model})
				userViewsArray.push(view)
				view.render()
			})
			app.router = new app.Routers.MainRouter()
			Backbone.history.start()
		}
	})

	
})

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