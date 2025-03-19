import express from 'express';
import bcrypt from 'bcrypt';
import { User, Product } from '../src/config.js';

const router = express.Router();

// Add login route
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// Add signup route
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Add cart route
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

// Seller page route
router.get('/seller', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('seller', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username, // Ensure this matches the form field name
        password: req.body.password
    };

    // checking if user exists
    const existingUser = await User.findOne({ username: data.username });

    if (existingUser) {
        res.send("User already exists. Choose a different name");
    } else {
        // hash the password using bcrypt
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashPassword;

        const userdata = await User.create(data);
        console.log(userdata);
        res.send("User registered successfully");
    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ username: req.body.username });
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
router.post('/add-to-cart', (req, res) => {
    const productId = req.body.productId;
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push({ id: productId, name: productName, price: productPrice });
    res.send('Product added to cart');
});

// Add product route
router.post('/add-product', async (req, res) => {
    const { name, price, amount } = req.body;
    const product = new Product({ name, price, amount });
    await product.save();
    res.redirect('/seller');
});

// Delete product route
router.post('/delete-product', async (req, res) => {
    const { productId } = req.body;
    await Product.findByIdAndDelete(productId);
    res.redirect('/seller');
});

export default router;