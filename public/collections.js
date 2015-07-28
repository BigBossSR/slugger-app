app.Collections.UserList=Backbone.Collection.extend({

	model: User,

	comparator: "time", //a function that compares parseInt(model.get("time") ) and new Date().getHours()

	url: rootUrl + "/demo_users",
	//url: "/users",
})

app.Collections.Group = Backbone.Collection.extend({
	model: User,

	url: rootUrl+"/group",

	parse: function(response) {
			return response.group
	}

})