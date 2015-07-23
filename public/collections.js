app.Collections.UserList=Backbone.Collection.extend({

	model: User,

	comparator: "time", //a function that compares parseInt(model.get("time") ) and new Date().getHours()

	url: "http://557ed386.ngrok.io/demo_users",
	//url: "/users",
})