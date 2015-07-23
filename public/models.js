var User = Backbone.Model.extend({

	initialize: function() {
//this will need updating if tables change

		if (morning) {
			this.set({
				depart: this.get("home_locale"),
				dest : this.get("work_locale"),
				time : this.get("morning_time")
			})
		} else {
			this.set({
				depart : this.get("work_locale"),
				dest : this.get("home_locale"),
				time : this.get("evening_time")
			})
		}
	},

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
	},

})