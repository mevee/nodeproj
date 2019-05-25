const exp = require('express');
const Joi = require('joi');

const app = exp();
app.use(exp.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' }
];

app.get('/', (req, res) => {
    res.send('hellow world');
});


app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

//get single course api
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given Id not found');
    else res.send(course);
});

//get list course api
app.get('/api/allcourses/', (req, res) => {
    if (courses.length > 0) return res.send(courses);
    else res.status(404).send('No courses available');
});

//delete a record
app.delete('/api/course/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course with given id not found');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);

});

//update a course endpoint
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given Id not found');
    
    const { error } = validateCourse(req.body); //object destructuring
    if (error) return res.status(400).send(error.details[0].message);
    
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}

//add  new course
app.post('/api/courses/', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port);
console.log(`listening at ${port}...`)