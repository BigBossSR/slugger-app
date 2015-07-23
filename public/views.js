app.Views.User = Backbone.View.extend({
	className: "user",

	events: {
		"click": "viewUser",
	},

	initialize: function(){
		this.listenTo(this.model, "change", function(){
			this.updateView(this.model) 
		})
	},

	render: function(model) {
		this.updateView( model )
		$("#user-location").append( this.$el )
	},

	updateView: function(model){
		
		var modelData = this.model.toJSON() 

	//display the relevant data based on time of day
/*		if (morning) {
			modelData.depart = modelData.home_locale
			modelData.dest = modelData.work_locale
			modelData.time = modelData.morning_time
		} else {
			modelData.depart = modelData.work_locale
			modelData.dest = modelData.home_locale
			modelData.time = modelData.evening_time
		} */


		this.$el.html( this.template(modelData) )
	},

//open a user profile
	viewUser: function(id) {
		$(".view-container").fadeIn()
		$("#prof").slideDown()
		//finds the model of the clicked view, to populate the profile view
		var userId = this.model.id
		var userModel = app.myUsers.find(function(user){
			return user.get("id") === userId
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
	},

	loginUser: function() {
		var email = $("#loginEmail").val()
		var password = $("#loginPassword").val()

		$.ajax("http://557ed386.ngrok.io", {
			method: "GET",
			headers: {
				email: email,
				password: password
			},
		}).success( function(json) {
			console.log(json)
			//go through "users" to find a match
			app.CurrentUser = json

				if (json.error) {
					alert (json.error)
				}


			}
		).error(function (error){
			
		})

	},

	registerUser: function(){

		$.ajax("http://557ed386.ngrok.io/demo_user/create", {
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
		}).error( function(error){
			console.log("error", error)
		})
	},

})

app.Views.EditUser = Backbone.View.extend({
	el: document.getElementById("edit-user"),

	events: {
		"click .btn__discard" : "discardChanges",
		"click .btn__save" : "saveEdits"
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
		$.ajax("http://557ed386.ngrok.io/demo_user/edit",{
			method: "PUT",
			headers: {
				email: app.CurrentUser.user.email,
			},
			data: app.CurrentUser,
		}).success(function(data) {
			console.log("success updating", data)
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
		var discardYes = confirm("Exit without saving?")

		if( discardYes ) {
			app.router.navigate("", {trigger: true})
		}
	},

	template: Handlebars.compile( $("#edit-user-template").html() ),

})