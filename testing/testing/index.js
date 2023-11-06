const express=require('express');
const app=new express();
const mongoose=require('mongoose');
const fs = require('fs');
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


app.listen(3000,()=>{
    console.log('port running!');
})