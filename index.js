const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer')
const fs = require('fs');
const path = require('path');

const app = express();
app.use(morgan('short'));
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.set('view engine', 'ejs');
const upload = multer({dest: path.join(__dirname, 'temp')})

var posts = ['This is fist post'];
var lastId = 1;

app.get('/', (req, res) => {
    console.log(posts);
    res.render('index.ejs', {data: posts});
});

app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log(req.files, req.file, req.body)

    const imagePath = path.join(__dirname, 'public', 'images', 'avatar.jpg')
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    fs.linkSync(req.file.path, imagePath);
    fs.unlinkSync(req.file.path);

    res.redirect('/');
});

app.post('/post', (req, res) => {
    posts.push(req.body.text);
    res.redirect('/');
})

app.get('/delete-post/:index', (req, res) => {
    posts = posts.filter((post, index) => index !== +req.params.index);
    res.redirect('/');
})

app.listen(3000, () => console.log('app running on at port 3000'));