import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures content
// import wakeDyno from 'woke-dyno'; // Keep Heroku dynos awake
import accountRoutes from './server/api/routes/account.js';
import emailRoutes from './server/api/routes/email.js';

// import nodemailer
import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "jd075651@gmail.com",
//     pass: "john@129"
//   }
// });

// const options = {
//   from: "jd075651@gmail.com",
//   to: "mansidevadiga57@gmail.com",
//   subject: "Sending email with nodemailer",
//   text: "wow! That's simple!"
// };

// transporter.sendMail(options, function (err, info) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Sent: " + info.messageId);
// })

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lamar61@ethereal.email',// generated ethereal user
      pass: 'Wb9kc35yNwVrzag4YY', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <lamar61@ethereal.email>', // sender address
    to: "jd075651@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);



// initialize app
const app = express();
const origin = '*';


// middlewares
dotenv.config(); // protected variables
app.use(cors({ origin })); // enables http requests on react development server
app.use(express.json({ limit: '10mb', extended: false })); // body parser
app.use(express.urlencoded({ limit: '1mb', extended: false })); // url parser
app.use(morgan('common')); // logs requests

// configure db
const MONGO_URI = process.env.MONGO_URI;
const DEPRECATED_FIX = { useNewUrlParser: true, useUnifiedTopology: true, };

// connect to db
mongoose
  .connect(MONGO_URI, DEPRECATED_FIX)
  .catch((error) => console.log('❌ MongoDB connection error', error)); // listen for errors on initial connection

const db = mongoose.connection;
db.on('connected', () => console.log('✅ MongoDB connected')); // connected
db.on('disconnected', () => console.log('❌ MongoDB disconnected')); // disconnected
db.on('error', (error) => console.log('❌ MongoDB connection error', error)); // listen for errors during the session

// routes
app.get('/', (request, response, next) => response.status(200).json('MERN Gmail clone'));
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/email', emailRoutes);

// server is listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port: ${PORT}`);

});
