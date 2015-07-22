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

/*app.Views.SignIn = Backbone.View.extend({
	el: document.getElementById("signin"),

	events: {

	}
})*/