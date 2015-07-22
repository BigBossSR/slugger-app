var app = {}
	app.myUsers = new UserList
	app.dispatcher = _.clone(Backbone.Events)
	app.views = []


$(document).on("ready", function(){


	app.myUsers.on("add", function(model){		
		var view = new UserView({model})
		app.views.push(view)
		console.log(view)
		view.render()
	})

	app.myUsers.fetch(		)

	console.log(app.views)

	var riders = new User (
		{
			first_name: "Gaylord Jenkins",
			email: "myface@face.com",
			morning_time: "23:00",
			evening_time: "11:00",
			home_locale: "The Burbs",
			work_locale: "The White House"
		}
	)

	app.myUsers.add( riders )

})