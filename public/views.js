app.Views.User = Backbone.View.extend({
	className: "user",

	events: {
		"click": "viewUser",
	},

	initialize: function(){
		this.listenTo(this.model, "change", function(){
			console.log("change")
			this.updateView(this.model) 
		})
		this.listenTo(app.dispatcher, "reset", function(){
			console.log("reset")
			this.remove()
		})

	},

	render: function(model) {
		this.updateView( model )
		$("#user-location").append( this.$el )
	},

	updateView: function(model){
		var modelData = this.model.toJSON() 

		this.$el.html( this.template(modelData) )
	},

//open a user profile
	viewUser: function() {
		$(".view-container").fadeIn()
		$("#prof").slideDown()
		//finds the model of the clicked view, to populate the profile view
		var userId = this.model.get("email")
		var userModel = app.myUsers.find(function(user){
			return user.get("email") === userId
		})

		if (userModel) {
			app.profileView.render(userModel)
		}
	},

	template: Handlebars.compile( $("#userlist-template").html() ),
})


app.Views.Profile = Backbone.View.extend({
	el: document.getElementById("prof"),

	events: {
		"click .prof__close": "hide",
	},

	initialize: function(){
		this.listenTo(app.dispatcher, "close", function(){
			this.hide()
		} )
	},

	exitCheck: function(event) {
		closeViewOnEsc(event)
	},


	render: function(model) {
		this.$el.html( this.template(model.toJSON() ) )
	},

	hide: function() {
		$(".view-container").fadeOut()
		$("#prof").slideUp()
	},

	template: Handlebars.compile( $("#profile-template").html() ),

})


app.Views.Signin = Backbone.View.extend({
	el: document.getElementById("signin"),

	events: {
		"click .btn__login" : "loginUser",
		"click .btn__register": "registerUser",
		"keyup :input" : "exitCheck",
	},

	exitCheck: function(event) {
		closeViewOnEsc(event)
	},

	loginUser: function() {
		var email = $("#loginEmail").val()
		var password = $("#loginPassword").val()

		$.ajax(rootUrl + "", {
			method: "GET",
			headers: {
				email: email,
				password: password
			},
		}).
			success( function(json) {
				console.log(json)
				//go through "users" to find a match
				app.CurrentUser = json

				if (json.error) {
					alert(json.error)
					return
				}
			
				app.router.navigate("", {trigger: true})
			}
		).error(function (error){
			
		})

	},

	registerUser: function(){

		$.ajax(rootUrl + "/demo_user/create", {
			method: "POST",
			data: {
				email: $("#register-email").val(),
				username: $("#register-username").val(),
				password: $("#register-password").val(),
				first_name: $("#register-firstname").val(),
				last_name: $("#register-lastname").val(),
			},
		}).success( function(data){
			console.log("success", data)
			app.CurrentUser = data
			app.router.navigate("", {trigger: true})
			
		}).error( function(error){
			console.log("error", error)
		})
	},

})

app.Views.EditUser = Backbone.View.extend({
	el: document.getElementById("edit-user"),

	events: {
		"click .btn__discard" : "discardChanges",
		"click .btn__save" : "saveEdits",
		"keyup" : "exitCheck",
	},

	exitCheck: function(event) {
		closeViewOnEsc(event)
	},
//this will be sent by the router from app.currentuser
	render: function(model){
		this.$el.html( this.template( app.CurrentUser ) )
	},

	saveEdits: function(){
		
			app.CurrentUser.user.username = $(".edt__username").val(),
			app.CurrentUser.user.first_name = $(".edt__name").val(),
			app.CurrentUser.itinerary.home_locale = $(".edt__home").val(),
			app.CurrentUser.itinerary.work_locale = $(".edt__work").val(),
			app.CurrentUser.itinerary.morning_time = $(".edt__am").val(),
			app.CurrentUser.itinerary.evening_time = $(".edt__pm").val(),
			app.CurrentUser.user.preferences = $(".edt__pref").val(),
			app.CurrentUser.user.bio = $(".edt__bio").val(),
		

		//app.CurrentUser.save()
		$.ajax(rootUrl + "/demo_user/edit",{
			method: "PUT",
			headers: {
				email: app.CurrentUser.user.email,
			},
			data: app.CurrentUser,
		}).success(function(data) {
			console.log("success updating", data)
			app.router.navigate("", {trigger: true})
		}).error(function(error){
			console.log("error updating", error)
		})
		/*headers: {
			email: app.CurrentUser.email
		},
		data: {

		},*/

	},

	discardChanges: function(){
		app.router.navigate("", {trigger: true})
	},

	template: Handlebars.compile( $("#edit-user-template").html() ),

})