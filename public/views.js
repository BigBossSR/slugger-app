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
			console.log("reset user view")
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
		viewProfile(this.model, this.model.collection)
	},

	template: Handlebars.compile( $("#userlist-template").html() ),
})

app.Views.GroupUser = Backbone.View.extend({

	className: "group-member",

	events: {
		"click .grp__info" : "viewGroupMember"
	},

	initialize: function(){
		this.listenTo(this.model.collection, "reset", function(){
			console.log("group reset")
			this.remove()
		})
	},

	viewGroupMember: function(){
		viewProfile(this.model, this.model.collection)
	},

	render: function(model){
		modelData = this.model.toJSON()

		this.$el.html( this.template(modelData) )

		$("#group-location").append( this.$el )
	},
	
	template: Handlebars.compile( $("#group-template").html() ),

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
				email: currentUserEmail
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
		this.hide()
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
		app.router.navigate("home", {trigger: true})
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
				email: currentUserEmail,
			},
			data: app.CurrentUser,
		}).success(function(data) {
			console.log("success updating", data)
			app.router.navigate("home", {trigger: true})
		}).error(function(error){
			console.log("error updating", error)
		})

	},

	discardChanges: function(){
		app.router.navigate("home", {trigger: true})
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
				

				if (json.error) {
					alert(json.error)
					return
				}

				setCurrentUser(json)
				app.router.navigate("home", {trigger: true})
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
			setCurrentUser(data)
			$("#signin").slideUp()
			app.router.navigate("edit-profile", {trigger: true})
			
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

app.Views.GroupPanel = Backbone.View.extend({
	el: document.getElementsByClassName("group-box"),

	events: {
		"click .disband":"disbandGroup",
		"click .leave": "leaveGroup",
	},

	leaveGroup: function(){
		$.ajax(rootUrl+"/group/leave", {
			method: "PUT",
			headers: {email: currentUserEmail},
		})
			.success( function(data){
				console.log("group left")
				app.carpool.reset()
			})

		$(".leave").hide()
	},

	disbandGroup: function(){
		$.ajax(rootUrl+"/group/disband", {
			method: "DELETE",
			headers: {email: currentUserEmail},
		})
			.success( function(data){
				console.log("group disbanded")
				app.carpool.reset()
				$(".disband").hide()
				populateList()
				initializeMap()
			})
	},

})