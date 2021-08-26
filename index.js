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
    title: {
        type: String,
        required: true,
    }, 
    details: String,
})

const Task = mongoose.model('Task', taskSchema);

app.set('view engine', 'ejs')
app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    let tasks = await Task.find({});
    res.render('tasks', { tasks });
})

app.get('/new', (req, res) => {
    res.render('new');
})

app.get('/edit/:id', async (req, res) => {
    let { id } = req.params;
    let task = await Task.findById(id);
    console.log(task);
    res.render('edit', { task });
})

app.delete('/delete/:id', async (req, res) => {
    let { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/');
})

app.put('/', async (req, res) => {
    let { id } = req.params;
    let { title, details } = req.body;
    console.log(title, details);
    await Task.updateOne({id}, { title, details }, { runValidators: true });
    res.redirect('/');
})

app.post('/', async (req, res) => {
    let { title, details } = req.body;
    let task = Task({title, details});
    await task.save();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})
