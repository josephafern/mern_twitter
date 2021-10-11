const express = require("express");
const mongoose = require('mongoose');
const app = express();
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const User = require('./models/User');
const passport = require('passport');
var cors = require('cors');

app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

app.use("/api/users", users);
app.use("/api/tweets", tweets);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.get("/", (req, res) => {
    const user = new User({
        handle: 'joey',
        email: 'joey.a.fern@gmail.com',
        password: '123456'
    })
    user.save();
    res.send("Hello Warld");
});
