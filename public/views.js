var UserView = Backbone.View.extend({

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

var ProfileView