app.Routers.MainRouter = Backbone.Router.extend({

	routes: {
		"home": "viewUserList",
		"signin": "login",
		"edit-profile":"edit",
		"close": "closeView",
		"error": "errorView",
	},

	errorView: function(){
		$(".page-container").hide()
		$("#error-view").show()
		$("#error-code").text(errorCode)
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

		app.carpool.formGroup()
		$("#signin").slideUp()
		$("#edit-user").slideUp()
		$("#user-focus").slideUp()
		$("#user-focus").css("background", "white")
		$(".view-container").fadeOut()

		//clear map
		initializeMap()
		activePins = 0
		//uncheck checkboxes
		if (app.carpool.length > 1) {
			app.carpool.formGroup()
		}
	},



	login: function() {
		$(".view-container").fadeIn()
		$("#signin").slideDown()
		$("#loginEmail").focus()
	},

	edit: function() {
		$(".view-container").fadeIn()
		$("#user-focus").slideDown()
		$("#user-focus").css("background","rgb(233, 242, 242)")
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