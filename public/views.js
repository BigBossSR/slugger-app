app.Views.User = Backbone.View.extend({
	className: "user",

	events: {
		"click .usr-detail": "viewUser",
		"click :checkbox": "togglePins",
	},

	togglePins: function(){
		var homeMarker = this.model.get("home_marker")
		var workMarker = this.model.get("work_marker")

		if ( this.$el.find(":checkbox:checked").length > 0 ) {	
			//cycle through an arbitrary array of colors to vary user pins
			//this will break if too many pins
			homeMarker.icon.fillColor = pinColors[activePins]
			workMarker.icon.fillColor = pinColors[activePins]	
			homeMarker.setMap(map)
			workMarker.setMap(map)
			//show an el with same bg color as the marker 
			this.$el.find(".pin-color").fadeIn()
			this.$el.find(".pin-color").css( {"background-color": pinColors[activePins],
				"display": "inline-block"} )
			activePins+=1
		} else {
			activePins-=1
			homeMarker.icon.fillColor = "none"
			workMarker.icon.fillColor = "none"
			homeMarker.setMap(null)
			workMarker.setMap(null)
			this.$el.find(".pin-color").fadeOut()
		}
		
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
		$(".edt").hide()
		$(".prof").show()
		$("#user-focus").slideDown()
		//finds the model of the clicked view, to populate the profile view
		var userId = this.model.get("email")
		var userModel = app.myUsers.find(function(user){
			return user.get("email") === userId
		})

		if (userModel) {
			//give user converted times here or on model
				//need a new mode for current user
					//apply the time conversions
					//move a LOT of this functionality there
			app.profileView.render(userModel)
		}

		$(".edt__username").focus()
	},

	template: Handlebars.compile( $("#userlist-template").html() ),
})

app.Views.GroupUser = Backbone.View.extend({

	className: "group-member",

	events: {
		"click .grp__info" : "viewGroupMember"
	},

	viewGroupMember: function(){
		console.log(this.model)
	},

	render: function(model){
		modelData = this.model.toJSON()

		this.$el.html( this.template(modelData) )

		$("#group-location").append( this.$el )
	},

	template: Handlebars.compile( $("#group-template").html() )
})


app.Views.Profile = Backbone.View.extend({
	el: document.getElementById("user-focus"),

	events: {
		"click .prof__close": "hide",
		"click .btn__discard" : "discardChanges",
		"click .btn__save" : "saveEdits",
		"keyup" : "exitCheck",
		"click .prof__btn": "sendInvite",
	},

	sendInvite: function(){
		var inviteId = this.model.get("id")
		console.log(this.model)
		$.ajax(rootUrl+"/invite", {
			method: "GET",
			headers: {
				email: app.CurrentUser.user.email
			},
			data: {
				rider_id: inviteId
			}
		})
			.success( function(data) {
				formGroup()
			})
			.error( function(error) {
				console.log(error)
			})
	},

	initialize: function(){
		//DISUSED I believe
		this.listenTo(app.dispatcher, "close", function(){
			this.hide()
		} )
	},

	exitCheck: function(event) {
		closeViewOnEsc(event)
	},

	render: function(model) {
		this.$el.html( this.template(model.toJSON() ) )
		this.model = model
	},

	hide: function() {
		$(".view-container").fadeOut()
		$("#user-focus").slideUp()
	},

	saveEdits: function(){
		
			app.CurrentUser.user.username = $(".edt__username").val(),
			app.CurrentUser.user.first_name = $(".edt__name").val(),
			app.CurrentUser.itinerary.home_locale = $(".edt__home").val(),
			app.CurrentUser.itinerary.work_locale = $(".edt__work").val(),
			app.CurrentUser.itinerary.morning_time = $(".edt__am").val(),
			app.CurrentUser.itinerary.evening_time = $(".edt__pm").val(),
			app.CurrentUser.user.preferences = $(".edt__pref").val(),
			app.CurrentUser.user.bio = $(".edt__bio").val()
			
			if ( this.$el.find(":checkbox:checked").length > 0 ){
				app.CurrentUser.user.driver = true	
			} else {
				app.CurrentUser.user.driver = false
			}


		

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

				formGroup()

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
			formGroup()
			app.router.navigate("", {trigger: true})
			
		}).error( function(error){
			console.log("error", error)
		})
	},

})

app.Views.EditUser = Backbone.View.extend({
	el: document.getElementById("edit-user"),

	events: {

	},

	exitCheck: function(event) {
		closeViewOnEsc(event)
	},
//this will be sent by the router from app.currentuser
	render: function(model){
		this.$el.html( this.template( app.CurrentUser ) )
	},

	

	template: Handlebars.compile( $("#edit-user-template").html() ),

})