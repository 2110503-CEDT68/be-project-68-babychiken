const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser')

dotenv.config({path : './config/config.env'});

const app = express();
app.use(express.json());
app.use(cookieParser());
const carRentals = require('./routes/carRentals');
const auth = require('./routes/auth');
const rents = require('./routes/rents');
app.use('/api/v1/carRentals',carRentals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/rents',rents);

app.set('query parser','extended');

const PORT = process.env.PORT || 5000; //change to 5003 in macOS
const server  = app.listen(PORT,console.log('Server is running in : ', process.env.NODE_ENV,' mode_on_port : ', PORT));

process.on('unhandledRejection', ( err,promise) => {
    console.log(`Error:${err.message}`);
    server.close(()=>process.exit(1));
})

