const User=require('../model/userModel');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const sec_key="secretkey";
const qr=require('qrcode');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    service: 'gmail',
    auth: {
        user: 'prince.raj@indicchain.com', 
        pass: 'jpvgsvbrkxqngzpi', 
    },
});

let otpdata = { otp: null, timestamp: null };

const generateotp = () => {
    const digits = "0123456789";
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    otpdata = { otp: otp, timestamp: Date.now() };
};


const isOTPValid = () => {
    if (!otpdata.otp || !otpdata.timestamp) {
        return false;
    }
    const currentTime = Date.now();
    return currentTime - otpdata.timestamp < 60000;
};

const securePassword = async (password) => {
  try {
      const passhash = await bcryptjs.hash(password, 10);
      return passhash;
  } catch (err) {
      throw new Error(err.message);
  }
};

const create_user = async (req, res) => {
    try {
      const item = await User.findOne({ useremail: req.body.useremail });
      if (item) {
        res.status(200).send('User already exists!');
      } else {
        const user = new User(req.body);
        const result = await user.save();
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  

const login_user=async (req,res)=>{
   const {email,password}=req.body;

   const user={
      useremail:email,
      userpassword:password
   }

   const token=await jwt.sign({user},sec_key);
   const data=await User.findOne({useremail:email});
   if(data){
    if(password===data.userpassword){
        res.status(200).send({success:true,msg:"login successfully!",token});
    }
    else{
        console.log(password);
        console.log(data.password)
        res.status(200).send('Invalid password!');
    }
   }
   else{
    res.status(200).send('Invalid User Id!');
   }
}

const test=async(req,res)=>{
    res.status(200).send('verified by tester!');
}

let validotp=''
const forget_password=async(req,res)=>{
 generateotp();
 validotp=otpdata.otp;

 const {email}=req.body;

 const mailOptions = {             
    from: 'prince.raj@indicchain.com', 
    to: email, 
    subject: 'forget Password Otp Mail', 
    text:`this message regarding otp: ${validotp}`,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error occurred: ', error);
        res.send('Error occurred while sending email');
    } else {
        console.log('Email sent: ' + info.response);
    }
});

  res.status(200).send(`Your One-Time OTP is: ${validotp} and email send successfully`);

}

const reset_password = async (req, res) => {
    const { otp, password, email } = req.body;
    const isValid = isOTPValid(); 
    if (isValid) {
      if (otp === validotp) {
        try {
          const user = await User.findOneAndUpdate(
            { useremail: email },
            {
              $set: {
                userpassword: password,
              },
            },
            { new: true }
          );
          res.status(200).send(user);
        } catch (error) {
          res.status(500).send(error.message);
        }
      } else {
        res.status(200).send('OTP is invalid!');
      }
    } else {
      res.status(200).send('OTP has expired!');
    }
  };

  const search_user= async (req, res) => {
    let age=parseInt(req.params.key);
    if(!isNaN(age)){
        const data = await User.find({userage:age});
        res.json(data);
    }
    else{
        const data = await User.find({
            $or: [
                { "username": { $regex: req.params.key} }, 
                { "usercity": { $regex: req.params.key} },
            ]
        });
        res.json(data);
    }
}

  
const update_user=async(req,res)=>{
  const {email}=req.body;
  const result=await User.findOneAndUpdate({useremail:email},{
    $set:{
      userage:req.body.age,
      usercity:req.body.city,
      username:req.body.name
    }
  });

  res.status(200).send(result);
}

const paginate = async (req, res) => {
  const { page, sort } = req.body; // Using req.query to retrieve data from the query string

  let user_data;
  let skip;
  if (page <= 1) {
    skip = 0;
  } else {
    skip = (page - 1) * 2;
  }

  if (sort) {
    let usersort;
    if (sort === 'name') {
      usersort = {
        username: 1,
      };
    } else if (sort === '_id') {
      usersort = {
        _id: 1,
      };
    }
    user_data = await User.find().sort(usersort).skip(skip).limit(2);
  } else {
    user_data = await User.find().skip(skip).limit(2);
  }
  res.status(200).send(user_data);
};

const create_qr=async(req,res)=>{
  const url ="www.instagram.com"
  qr.toDataURL(url,(err,qrurl)=>{
      if(err){
          res.status(500).json(err)
      }else{
          res.send(`
              <!DOCTYPE HTML>
              <html>
              <img src="${qrurl}">
              </html>
          `)
      }
  })
}


module.exports={
    create_user,
    login_user,
    test,
    forget_password,
    reset_password,
    search_user,
    update_user,
    paginate,
    create_qr
}