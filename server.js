// Import Modules
const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

// Import Routes
const users = require('./routes/user');
const calendar = require('./routes/calendar');
const events = require('./routes/event');
const invitations = require('./routes/invitation');
const patientFeatures = require('./routes/patientFeature');


// Import DB URI
const { mongoURI } = require('./config');

// PORT
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./middlewares/passport")(passport);

//Use Routes
app.use('/',users);
app.use('/',calendar);
app.use('/',events);
app.use('/',invitations);
app.use('/',patientFeatures);

//Start Server
app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
})