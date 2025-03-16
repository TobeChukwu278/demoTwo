import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import collection from './config.js';
// const collection = require("./config");

const app = express();

const __dirname = path.resolve(); //simulate __dirname in ESM
app.set('views', path.join(__dirname, 'src', 'views'));
// json fformat
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));



// Use ejs as a view engine
app.set('views', path.join(__dirname, 'views')); // Corrected path
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// Set up static directory for public files

console.log("Views Directory:", app.get('views'));

// Add login route
app.get('/', (req, res) => {
    res.render('login');
});

// Add signup
app.get('/signup', (req, res) => {
    res.render('signup');
})

// Add cart to Route
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username, // Ensure this matches the form field name
        password: req.body.password
    };

    // checking if user exists
    const existingUser = await collection.findOne({ username: data.username });

    if (existingUser) {
        res.send("User already exists. Choose a different name");
    } else {
        // hash the password using bcrypt
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashPassword;

        const userdata = await collection.insertMany([data]);
        console.log(userdata);
        res.send("User registered successfully");
    }
});

// login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.username });
        if (!check) {
            return res.send("User name cannot be found. Please try another name")
        };

        // compare the password from database
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if (isPasswordMatch) {
            return res.render("home");
        } else {
            return res.send("wrong password");
        }
    } catch {
        return res.send("Wrong details")
    }
});


// Add to Cart route
app.post('/add-to-cart', (req, res) => {
    const productId = req.body.productId;
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push({ id: productId, name: productName, price: productPrice });
    res.send('Product added to cart');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});