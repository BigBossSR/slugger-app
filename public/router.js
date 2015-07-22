app.Routers.MainRouter = Backbone.Router.extend({

	routes: {
		"": "viewUserList",
		"users/:id": "viewUser",
	},

	viewUserList: function() {
		$(".profile-container").slideUp()
	},

	viewUser: function(id) {
		//make profile view active
		$(".profile-container").slideDown()

		var userId = id
		var userModel = app.myUsers.find(function(user){
			return user.get("id") === userId
		})

		if (userModel) {
			console.log('yes')
			app.profileView.render(userModel)
		}
	},
})