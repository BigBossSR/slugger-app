app.Routers.MainRouter = Backbone.Router.extend({

	routes: {
		"home": "viewUserList",
		//"users/:id": "viewUser",
		"signin": "login",
		"edit-profile":"edit",
		"close": "closeView",
	},

	closeView: function(){
		app.router.navigate("home", {trigger:true})
	},

	viewUserList: function() {
		if (app.CurrentUser) {
			//display options for logged in or anonymous
			$(".anon").hide()
			$(".lgd").show()
			//group display options if driver
		}

		populateList()
		$("#signin").slideUp()
		$("#edit-user").slideUp()
		$("#user-focus").slideUp()
		$(".view-container").fadeOut()

		//clear map
		initializeMap()
		activePins = 0
		//uncheck checkboxes
	},



	login: function() {
		$(".view-container").fadeIn()
		$("#signin").slideDown()
		$("#loginEmail").focus()
	},

	edit: function() {
		$(".view-container").fadeIn()
		$("#user-focus").slideDown()
//need a current user model, bc this is carrying chuff
		var userModel = new User(app.CurrentUser)
		console.log(userModel)
		app.profileView.render(userModel)
		$(".prof").hide()
		$(".edt").show()
		if (app.CurrentUser.user.driver){
			$("#edt__driver").prop("checked", true)
		} else {
			$("#edt__driver").prop("checked", false)
		}
		$(".edt__username").focus()
	},
})