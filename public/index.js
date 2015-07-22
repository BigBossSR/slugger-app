var app = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {}
}




$(document).on("ready", function(){
	app.dispatcher = _.clone(Backbone.Events)

	app.profileView = new app.Views.Profile()
	
	app.myUsers = new app.Collections.UserList
	
	app.myUsers.on("add", function(model){		
		var view = new app.Views.User({model})
		//app.views.push(view)
		view.render()
	})


/*	var riders = new User (
		{
			first_name: "Gaylord Jenkins",
			email: "myface@face.com",
			morning_time: "23:00",
			evening_time: "11:00",
			home_locale: "The Burbs",
			work_locale: "The White House"
		}
	)

	app.myUsers.add( riders )*/

	app.myUsers.fetch({
		success: function() {
			app.router = new app.Routers.MainRouter()
			Backbone.history.start()
		}
	})
	
})