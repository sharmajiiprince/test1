const express=require('express');
const app=new express();
const mongoose=require('mongoose');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// mongoose.connect('mongodb+srv://princeraj:princeraj@cluster0.ubqgau4.mongodb.net/?retryWrites=true&w=majority').then(()=>{
//     console.log('db connect !')
// }).catch((err)=>{
//     console.log(err);
// });

mongoose.connect('mongodb://127.0.0.1:27017/test').then(console.log('connect db!'));


app.use(express.json());
const userroute=require('./routes/userRoute');
const subjectroute=require('./routes/subjectRoute');

app.use('/',userroute);
app.use('/',subjectroute);
app.use(express.static("views"));

const users = require('./user.json');

app.get("/loginuser", async (req, res) => {
    let { id, pass } = req.query;
    const user = users.find((user) => user.id === id);
    if (user && user.password === pass) {
        return res.cookie("id", id).send({ success: true });
    }
    throw false;
});

app.get("/check", (req, res) => {
    const id = req.cookies.id;
    if (id) {
        // Implement your 2FA logic here
        return res.send({ success: true, message: 'Authenticated with 2FA.' });
    } else {
        return res.send({ success: false, message: 'Not authenticated.' });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie('id');
    return res.send({ success: true, message: 'Logged out successfully.' });
});

app.use(fileUpload({
    useTempFiles: true
}))

//make a configuration
cloudinary.config({
    cloud_name: 'dhffctosr',
    api_key: '573332159696654',
    api_secret: 'tGZNFt5F-Aya0273xJ9ptXM0_v8'
});

app.post("/create-cloundry", async (req, res) => {
    console.log(req.body);
    if (!req.files || !req.files.photo) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
        }
        let data = new Product({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            age: req.body.age,
            city: req.body.city,
            password: req.body.password,
            token: req.body.token,
            otp: req.body.otp,
            imagePath: result.url,
        });
        let info = await data.save();
        return res.status(200).json({ message: 'File uploaded to Cloudinary', result });
    });
});

app.listen(3000,()=>{
    console.log('port running!');
})