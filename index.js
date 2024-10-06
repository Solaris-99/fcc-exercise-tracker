const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./user.js')
const Exercise = require('./exercise.js')
const bodyParser = require('body-parser')
require('dotenv').config()

const bparser = bodyParser.urlencoded({extended: false});
const users = [];

app.use( bparser);
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create user
app.post('/api/users',(req,res)=>{

  let user = users.find((e)=>e.username == req.body.username)
  if(!user){
    user = new User(req.body.username);
  }
  

  users.push(user)
  res.json({username: user.username, _id: user._id})
})

//show all users
app.get('/api/users', (req, res)=>{
  const userRes = users.map((e)=>{
    return {username: e.username, _id: e._id}
  })
  res.json(userRes)
})

//create exercise
app.post('/api/users/:id/exercises', (req,res)=>{
  const userId = req.params.id;

  const user = users.find((e)=>e._id == userId);

  const desc = req.body.description
  const duration = parseInt(req.body.duration)
  let date;
  if(req.body.date){
    date = new Date(req.body.date);
  }else{
    date = new Date();
  }
  const exercise = new Exercise(desc, duration, date)
  user.log.push(exercise)

  res.json({
    _id: user._id,
    username: user.username,
    date: date.toDateString(),
    duration: duration,
    description: desc
  })

})

//get user log
app.get('/api/users/:id/logs', (req, res)=>{
  const userId = req.params.id;
  const user = users.find((e)=>e._id == userId);
  let from;
  let to;
  let filteredLogs = user.log
  user.count = user.log.length
  if(req.query.from){
    from = new Date(req.query.from)
    filteredLogs = filteredLogs.filter((e)=> e.date >= from)
  }
  if(req.query.to){
    to = new Date(req.query.to)
    filteredLogs = filteredLogs.filter((e)=> e.date <= to)
  }
  if(req.query.limit){
    filteredLogs = filteredLogs.slice(0, req.query.limit)
  }
  filteredLogs = filteredLogs.map((e)=>new Exercise(e.description, e.duration, e.date.toDateString()))


  res.json({
    _id: user._id,
    username: user.username,
    count: filteredLogs.length,
    log: filteredLogs
  })

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
