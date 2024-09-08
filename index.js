// var express = require("express");
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");

// const app = express()

// app.use(bodyParser.json())
// app.use(express.static('pages'))
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
// mongoose.connect('mongodb://127.0.0.1:27017//Database') 
// var db = mongoose.connection
// db.on('error',()=>console.log("Error in connecting to Database"))
// db.once('open',()=>console.log("connected to Database"))


// app.post("/register",(req,res)=>{
//     var name = req.body.name
//     var email = req.body.email
//     var password = req.body.password


//     var data= {
//         "name": name,
//         "email": email,
//         "password": password
//     }

//     db.collection('users').insertOne(data,(err,collection)=>{
//         if(err){
//             console.log("Error inserting record :",err);
//             return res.redirect('error.html');
//         }
//         if (!existingUser) {
            
//             console.log("User already exists with this email.");
//             return res.redirect('error.html');  // Redirect to error page for existing user
//         }
//         console.log("record inserted succesfully")
//     })
//     return res.redirect('success.html')
// })

// app.get("/",(req,res)=>{
//     res.set({
//         "Allow-access-Allow-origin": '*'
//     })
//     return res.redirect('index.html')
// }).listen(3000);

// console.log("listening on port 3000")


var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('pages')); // Static files
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); // Updated connection string

var db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Schema definition for user registration
const registrationSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true // Enforces unique email in the database
    },
    password: String
});

const User = mongoose.model("User", registrationSchema);

// Registration endpoint
app.post("/register", async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log("User with this email already exists.");
            return res.redirect('error.html'); // Redirect to error page if email already exists
        }

        // If no existing user, create a new one
        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        await newUser.save(); // Save new user to the database
        console.log("New user registered successfully");
        return res.redirect('success.html'); // Redirect to success page upon successful registration

    } catch (error) {
        console.error("Error during registration:", error);
        return res.redirect('error.html'); // Redirect to error page if something goes wrong
    }
});

// Serve index page for GET requests
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-origin": '*'
    });
    return res.redirect('index.html');
});

// Listen on the specified port
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
