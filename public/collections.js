app.Collections.UserList=Backbone.Collection.extend({

	model: User,

	comparator: "time", //a function that compares parseInt(model.get("time") ) and new Date().getHours()

	//url: "http://91657c07.ngrok.io/",
	url: "/users",

})