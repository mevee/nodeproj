const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const express = require('express');
const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const App = express();

App.set('view engine','pug');
App.set('views','/views');

console.log('Application name:'+config.get('name'));
console.log('Mail Server:'+config.get('mail.host'));
console.log('Server password:'+config.get('mail.password'));


const s = process.env.NODE_ENV;
console.log(s);
console.log(App.get('env'))

App.use(express.json());
App.use(helmet());
if(App.get('env')==='development'){
App.use(morgan('tiny'))
startupDebugger('morgan is enabled');
} 

dbDebugger('Connected to database');
App.use(express.urlencoded({ extended: true }));

const library = [
    { id: 1, name: 'GODAM', author: 'Munshi prem chander' },
    { id: 2, name: 'REDSOAKS', author: 'EDWERD MAYA' },
    { id: 3, name: 'THE MONK WHO SOLD EVERYTHING', author: 'ROBIN SHARMA' },
    { id: 4, name: 'DISCOVERY OF INDIA', author: 'JAWAHARLAL NEHRU' }
];

App.get('/', (req, res) => {
    
    res.render('index',{title:'Vikeshs Express App',message:'hellow world'});
    // res.send('wel come library');
});

App.get('/api/library/', (req, res) => {
    return res.send(library);
});

App.get('/api/library/:id', (req, res) => {
    const book = library.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.send('no book found with given id');
    return res.send(book);
});

App.post('/api/library/', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);
    const index = library.length;
    const book = {
        id:library.length + 1,
        name:req.body.name,
        author:req.body.author
    };
    library.push(book);
    return res.send(book);
});

App.put('/api/library/:id',(req,res)=>{
const book = library.find(c=>c.id===parseInt(req.params.id))
if(!book) return res.send('No book is find with given id');
const {error} =validate(req.body);
if(error) return res.send(error.details[0].message);
book.name=req.body.name;
book.author=req.body.author;
res.send(book);
});

App.delete('/api/library/:id',(req,res)=>{
const book =library.find(b=>b.id===parseInt(req.params.id));
if(!book) return res.send('No book is find with given id');
const index = library.indexOf(book);
library.splice(index,1);
return res.send(book);
});

function validate(book) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(35).required(),
        author: Joi.string().min(3).max(35).required()
    });
    return Joi.validate(book, schema);
}

const port = process.env.PORT | 3000;
App.listen(port);
console.log(`listing at port ${port}`);


