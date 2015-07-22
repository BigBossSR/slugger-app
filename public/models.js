var User = Backbone.Model.extend({

	validate: function(attrs) {
		if (attrs.username.length < 1) {
			return alert("you need a username")
		}
		if (attrs.firstname.length < 1) {
			return alert("you need a first name")
		}
		if (attrs.email.length < 1) {
			return alert("you need an email")
		}
	}

})