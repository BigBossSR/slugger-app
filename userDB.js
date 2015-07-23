/*
  So, obviously this isn't actually a real database.

  But see if you can follow along with what's going on.
*/

var u = require("underscore")

var users = []
var userCounter = 0

var createUser = function(data) {

  var newUser = {
    first_name: data.first_name,
    username: data.username,
    email: data.email,
    morning_time: data.morning_time,
    evening_time: data.evening_time,
    home_locale: data.home_locale,
    work_locale: data.work_locale,
    driver: data.driver,
  
    
    createdAt: new Date(),
  }

  userCounter++

  newUser.id = (userCounter).toString()

  users.push(newUser)

  return newUser
}

exports = module.exports = {

  all: function() {
    return users
  },

  driver: function() {
    return u.filter(users, function(user){
      return (user.driver === true)
    })
  },

  rider: function() {
    return u.filter(users, function(user){
      return (user.driver === false)
    })
  },

  create: function(data) {
    return createUser(data)
  },

  find: function(id) {
    return u.find(users, function(user){
      return (user.id === id)
    })
  },

  edit: function(id, data) {
    var user = u.find(users, function(user){
      return (user.id === id)
    })

    user = u.extend(user, data, { id: id })

    return user
  },

/*  reopen: function(id) {
    var task = u.find(tasks, function(task){
      return (task.id === id)
    })

    task.complete = false
    task.reopenedAt = new Date()

    return task
  },*/

  init: function() {
    createUser({
      first_name: "Jean Luc",
      email: "iamlocutus@borg.org",
      username: "LocutusOfBorg",
      morning_time: "7:00am",
      evening_time: "6:00pm",
      home_locale: "West Springfield, VA",
      work_locale: "19th and F, Washington, DC",
      driver: true,
    })

    createUser({
      first_name: "William",
      email: "commander4lyfe@beards.co",
      username: "No1ofFun",
      morning_time: "5:30am",
      evening_time: "4:30pm",
      home_locale: "Lorton, VA",
      work_locale: "Navy Yard, Washington, DC",
      driver: false,
    })

    createUser({
      first_name: "Deanna",
      email: "counselorgrrrl@empathy.net",
      username: "ParanoidBetazoid",
      morning_time: "6:00am",
      evening_time: "5:00pm",
      home_locale: "Keene Mill Heights, VA",
      work_locale: "15th Street and New York Ave, Washington, DC",
      driver: false,
    })

    createUser({
      first_name: "Geordi",
      email: "itsinabook@readingrainbow.net",
      username: "BothEyeBlind",
      morning_time: "8:00am",
      evening_time: "7:00pm",
      home_locale: "Occoquan, VA",
      work_locale: "Navy Yard, Washington, DC",
      driver: true,
    })

    createUser({
      first_name: "Worf",
      email: "songofmogh@klingonempire.gov",
      username: "BatlethStarGalactica",
      morning_time: "5:30am",
      evening_time: "5:00pm",
      home_locale: "Potomac Mills, VA",
      work_locale: "Navy Yard, Washington, DC",
      driver: false,
    })

    createUser({
      first_name: "Data",
      email: "spotthecat@skynet.com",
      username: "UniversalTuringMachine",
      morning_time: "12:00am",
      evening_time: "11:59pm",
      home_locale: "Minnieville, VA",
      work_locale: "Pentagon City, VA",
      driver: true,
    })

    createUser({
      first_name: "Miles",
      email: "obrien@enterprise.mil",
      username: "BeamItYourself",
      morning_time: "6:00am",
      evening_time: "4:30pm",
      home_locale: "Montclair, VA",
      work_locale: "Pentagon City, VA",
      driver: false,
    })
  }

}