const Joi = require('joi');
const express = require('express');
//imports
const App = express();

App.use(express.json());
// App.use(express.urlencoded({ extended: true }))

const libMovie = [
    { id: 1, name: 'avanger', actor: 'frank' },
    { id: 2, name: 'exorcism', actor: 'frank' },
    { id: 3, name: 'merry jane', actor: 'frank' },
    { id: 4, name: 'Iron Man', actor: 'Doweny Jr' }
];

function validate(movie) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(32).required(),
        actor: Joi.string().min(3).max(32).required()
    });
    return Joi.validate(movie, schema);
}

App.get('/', (req, res) => {
    res.send("welcome to movie app");
});
//get movie
App.get('/api/geners/:id', (req, res) => {
    const movie = libMovie.find(c => c.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('no movie found with given id');
    else
        res.send(movie);
});

//get movie list
App.get('/api/geners/', (req, res) => {
    res.send(libMovie);
});

//put movie into database
App.post('/api/geners/', (req, res) => {
const {error} = validate(req.body);
if(error) return res.send(error.details[0].message);

const movie = {
    id:libMovie.length+1,
    name:req.body.name,
    actor:req.body.actor
};

libMovie.push(movie);
res.send(movie);
});

//
App.delete('/api/geners/:id', (req, res) => {
    const movie = libMovie.find(c => c.id === parseInt(req.params.id));
    if(!movie)return res.status(404).send('No record found with given id');
    let ind = libMovie.indexOf(movie);
    libMovie.splice(ind,1);
    res.send(movie);
});

//
App.post('/api/geners/:id', (req, res) => {
    const movie = libMovie.find(c => c.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('No record found with given id');
    const {error} = validate(req.body);
    if(error) return res.send(error.details[0].message);
    
    let index = libMovie.indexOf(movie);

    movie.name =req.body.name;
    movie.actor =req.body.actor;

    libMovie[index]=movie;
});

const port = process.env.PORT || 3000;
App.listen(port);
console.log(`server started at ${port} ....`);
