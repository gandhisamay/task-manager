const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost:27017/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const taskSchema = new mongoose.Schema({
    tasks: [{
        title: {
            type: String,
            required: true,
        }, details: String
    }],
})

const Task = mongoose.model('Task', taskSchema);

let user = Task({tasks:[]});

app.set('view engine', 'ejs')
app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    let data = await Task.find({});
    for(let dat of data){
        console.log(dat.tasks[0].title);
    }
    res.render('tasks', { data });
})

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/', async (req, res) => {
    let { title, details } = req.body;
    user.tasks.push({title, details})
    await user.save();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})
