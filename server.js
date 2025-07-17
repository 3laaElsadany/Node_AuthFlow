const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require("passport");
const session = require("express-session");

dotenv.config();
require('./config/db');
require('./config/passport');

const app = express();
const authRoutes = require('./routes/auth.routes');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));