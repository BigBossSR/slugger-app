var User = Backbone.Model.extend({

	initialize: function() {
		//set an unplaced Google Map marker
		var homeLatLng = new google.maps.LatLng(this.get("home_lat"), this.get("home_lng") )
		var workLatLng = new google.maps.LatLng( this.get("work_lat"), this.get("work_lng") )

		var homeMarker = new google.maps.Marker({
			position: homeLatLng,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillOpacity: .8,
				strokeWeight: 1,
			}
		})

		var workMarker = new google.maps.Marker({
			position: workLatLng,
				icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillOpacity: .8,
				strokeWeight: 1,
			}
		})

		this.set("home_marker", homeMarker)
		this.set("work_marker", workMarker)

		var convertedMorning = convertTime(this.get("morning_time") )
		var convertedEvening = convertTime(this.get("evening_time") )
		this.set("morning_converted", convertedMorning)
		this.set("evening_converted", convertedEvening)
//this will need updating if tables change
	//also this is probably superfluous and could be handled with HBars conditionals
		if (morning) {
			this.set({
				depart: this.get("home_locale"),
				dest : this.get("work_locale"),
				time : this.get("morning_converted")
			})
		} else {
			this.set({
				depart : this.get("work_locale"),
				dest : this.get("home_locale"),
				time : this.get("evening_converted")
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