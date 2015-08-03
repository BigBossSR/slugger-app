app.Collections.UserList=Backbone.Collection.extend({
	model: User,

	comparator: "time", //a function that compares parseInt(model.get("time") ) and new Date().getHours()

	url: rootUrl + "/demo_users",

	parse: function(response) {
		return response.user
	},

 	showDrivers:function() {
		var filteredList = _.filter(this.models, function(user) {
			return user.get("driver") === true
		})
		this.set(filteredList)
	},

	showRiders: function() {
		var filteredList = _.reject(this.models, function(user) {
			return user.get("driver") === true
		})
		this.set(filteredList)
	},

	update: function(){
		$("#user-location").text("")
		if (app.CurrentUser && app.CurrentUser.user.driver) {
			this.showRiders()
		} else {
			app.myUsers.showDrivers()
		}

		_.each(app.myUsers.models, function(model) {			
			var view = new app.Views.User({model})
			view.render()
		})
	},

	populateList: function(){
		//reset the user collection so it doesn't repeat
		app.myUsers.reset()
		$("#user-location").text("Looking for users near you!")
		if (app.CurrentUser) {
			emailString = currentUserEmail
		}
		app.myUsers.fetch({
			headers: {
					email: emailString
				},
		})
			.success( function(json) {
				app.myUsers.update()
		//consider instantiating a second router, in case users don't populate
			})
			.error( function(error) {
				$("#user-location").text("Whoops, something went wrong!")
			})	
	},

})

app.Collections.Group = Backbone.Collection.extend({
	model: User,

	url: rootUrl+"/group",

	parse: function(response) {
		return response.group
	},

	update: function(jsonData) {
		activePins=0
		_.each(this.models, function(model){
			model.initialize()
			var view = new app.Views.GroupUser({model})
			view.render()
			//drop pins for everyone but current user - needs DRYed
			if (view.model.get("email") !== currentUserEmail) {
				var homeMarker = view.model.get("home_marker")
				var workMarker = view.model.get("work_marker")
				
				homeMarker.icon.fillColor = pinColors[activePins]
				workMarker.icon.fillColor = pinColors[activePins]
				
				homeMarker.setMap(map)
				workMarker.setMap(map)
				activePins+=1
			}
		})
		//show button if they have a carpool group
		if (this.length > 0) {
			//if current user is owner let them disband
			if (currentUserEmail === jsonData.group[0].email){
				$(".leave").hide()
				$(".disband").show()
			} else {
				$(".leave").show()
				$(".disband").hide()
			}
		}
	},

	formGroup: function(){
		var theCollection = this
		theCollection.reset()
		theCollection.fetch({
			headers: {email: currentUserEmail},
			//data: {rider_id: inviteId},
		})
			.success( function(data){ 
				theCollection.update(data)
			}) 		
			.error( function(error){
				console.log(error)
			})
		app.myUsers.populateList()
	},

})