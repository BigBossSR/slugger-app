app.Routers.MainRouter = Backbone.Router.extend({

	routes: {
		"": "viewUserList",
		//"users/:id": "viewUser",
		"signin": "login",
		"edit-profile":"edit",
	},

	viewUserList: function() {
		console.log("yo")
		populateList()
		$("#signin").slideUp()
		$("#edit-user").slideUp()
		$(".view-container").fadeOut()

		//clear map
		initializeMap()
		activePins = 0
		//uncheck checkboxes
	},

	//currently unused
/*	viewUser: function(id) {
		//make profile view active
		$(".view-container").fadeIn()

		var userId = id
		var userModel = app.myUsers.find(function(user){
			return user.get("id") === userId
		})

		if (userModel) {
			console.log('yes')
			app.profileView.render(userModel)
		}
	},*/

	login: function() {
		$(".view-container").fadeIn()
		$("#signin").slideDown()
		$("#loginEmail").focus()
	},

	edit: function() {
		$(".view-container").fadeIn()
		$("#user-focus").slideDown()
/*		var userId = app.CurrentUser.user.email
		var userModel = app.myUsers.find(function(user){
			return user.get("email") === userId
		})*/
		var userModel = new User(app.CurrentUser)
		console.log(userModel)
		app.profileView.render(userModel)
		$(".prof").hide()
		$(".edt").show()
	},
})