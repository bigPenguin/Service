var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var Student = require('./app/model/student')

//mongoose.connect('mongodb://localhost/student')
mongoose.connect('mongodb://frankfei123:N1ad4Z7XRlwHCT0J@cluster0-shard-00-00-lketl.mongodb.net:27017,cluster0-shard-00-01-lketl.mongodb.net:27017,cluster0-shard-00-02-lketl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
app.use(bodyParser.urlencoded({
  'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(methodOverride('X-HTTP-Method-Override'));

// respond with "hello world" when a GET request is made to the homepage
// app.get('/ab?cd', function (req, res) {
//   res.send('hello world')
// })
//
// app.get('/users/:userId/books/:bookId', function (req, res) {
//   res.send(req.params)
// })
//
// app.get('/example/b', function (req, res, next) {
//   console.log('the response will be sent by the next function ...')
//   next()
// }, function (req, res) {
//   res.send('Hello from B!')
// })
function getStudents(res) {
  Student.find((err, items) => {
    if (err) {
      res.send(err);
      console.log("sss");
    }
    res.json(items);
  });
};
app.route('/students')
  .get(function(req, res) {
    res.send('Get a random book')
  })

app.route('/getstudents').get(function(req, res) {
  getStudents(res);
})

app.route('/addstudent').post(function(req, res) {
  Student.create({
    name: req.body.name,
    age: req.body.age
  }, (err, item) => {
    if (err) {
      res.send(err);
    }
    getStudents(res);
  })
})
app.route('/updatestudent/:student_id').put(function(req, res) {
  var conditions = {
    _id: req.params.student_id
  };
  var student = {
    age: req.body.age,
    name: req.body.name
  }
  var options = {
    upsert: true
  }

  Student.update(conditions, student, options, (err, numAffected) => {
    if (numAffected.ok == 1) {
      getStudents(res);
    }
  })
})
app.route('/deletestudent/:student_id').delete(function(req, res) {
  Student.remove({
    _id: req.params.student_id
  }, function(err, tag) {
    if (err) {
      res.send(err);
    }
    getStudents(res);
  })
})
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});