app.Routers.MainRouter = Backbone.Router.extend({

	routes: {
		"": "viewUserList",
		//"users/:id": "viewUser",
		"signin": "login",
		"edit-profile":"edit",
	},

	viewUserList: function() {
		console.log("yo")
		$("#signin").slideUp()
		$("#edit-user").slideUp()
		$(".view-container").fadeOut()
	},

	//currently unused
	viewUser: function(id) {
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
	},

	login: function() {
		$(".view-container").fadeIn()
		$("#signin").slideDown()
	},

	edit: function() {
		$(".view-container").fadeIn()
		$("#edit-user").slideDown()
		app.editView.render()
	},
})