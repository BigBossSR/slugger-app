app.Views.User = Backbone.View.extend({

	intitialize: function(){
		this.render( this.template )
	},

	render: function(model) {
		this.updateView( model )
		$("#user-location").append( this.$el )
	},

	updateView: function(model){
		var modelData = this.model.toJSON() 
		//to store the id
		this.$el.attr("data-id", modelData.id)

		this.$el.html( this.template(modelData) )
	},

	template: Handlebars.compile( $("#userlist-template").html() ),
})


app.Views.Profile = Backbone.View.extend({
	el: document.getElementById("profile"),

	events: {
		"click .close": "hide",
	},

	render: function(model) {
		this.$el.html( this.template(model.toJSON() ) )
	},

	hide: function() {
		$(".profile-container").slideUp()
	},

	template: Handlebars.compile( $("#profile-template").html() ),

})