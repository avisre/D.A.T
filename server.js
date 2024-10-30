

// Import required Node.js modules and libraries
const express = require('express'); // Import the Express web framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connectivity
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const session = require('express-session'); // Middleware for handling sessions
const passport = require('passport'); // Passport for user authentication
const LocalStrategy = require('passport-local').Strategy; // Passport's LocalStrategy for username/password authentication
const bcrypt = require('bcrypt'); // Library for password hashing
const path = require('path'); // Node.js module for handling file paths
const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Define the port number for the server to listen on
const axios = require('axios'); // Library for making HTTP requests
const { render } = require('ejs')

// Set up the view engine and views directory for rendering HTML templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the 'body-parser' middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// Set up session middleware with a secret key
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport middleware for handling authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect to an online MongoDB instance named 'stockApp'
mongoose.connect('mongodb+srv://project:project@cluster0.kos1k7l.mongodb.net/stockApp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

// Define the data schema for the 'Stock' and 'User' collections in MongoDB
const stockSchema = new mongoose.Schema({
    symbol: String,
    qty: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Define the schema for the contact form data
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
});

// Method for validating user passwords using bcrypt made with knowledge gained from reading documentation about bcrypt
// // Dan Arias (2018). Hashing in Action: Understanding bcrypt. [online] Auth0 - Blog. 
// Available at: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/. 
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create models for the 'Stock' and 'User' collections
const Stock = mongoose.model('Stock', stockSchema);
const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);
// Configure Passport to use the LocalStrategy for user authentication
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!(await user.validatePassword(password))) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize and deserialize user objects for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Define a route for handling the root URL ('/') made with input gleaned from
// MongoDB Crash Course (2021). YouTube. 28 September. Available at: https://www.youtube.com/watch?v=ofme2o29ngU 
// (Accessed: 04 September 2023). 
app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const stocks = await Stock.find({ user: req.user._id });

        // Fetch stock values using Alpha Vantage API
        const apiKey = '6VWT72JNHHLBF3MH';
        const stockPromises = stocks.map(async stock => {
            const symbol = stock.symbol;
            const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

            try {
                const response = await axios.get(apiUrl);
                const data = response.data;
                const latestTime = data["Meta Data"]["3. Last Refreshed"];
                const latestValue = data["Time Series (5min)"][latestTime]["1. open"];

                stock.symbolValue = parseFloat(latestValue);
            } catch (error) {
                console.error(`Error fetching stock value for ${symbol}:`, error.message);
                stock.symbolValue = 0; // Set a default value on error
            }

            return stock;
        });

        const updatedStocks = await Promise.all(stockPromises);

        // Render the 'index' template with the stock data requested by the user
        res.render('index', { stocks: updatedStocks });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// ... (Continuing from the previous code)

// Define another route for handling the root URL ('/') - this seems to be a duplicate
// It should be noted that only one of these route handlers will be executed since they both handle the same URL.
// made with knowledge gained from tutorial Jayatilake, N. (2023) How to get started with mongodb in 10 minutes, 
// freeCodeCamp.org. Available at: https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/ (Accessed: 27 August 2023). 
app.get('/', ensureAuthenticated, async (req, res) => {
    // ensureAuthenticated is a middle ware function that ensures that users who are not signed in will be redirected to 
    // login page and that only users who are autneticated gets access
    try {
        const stocks = await Stock.find({ user: req.user._id });
        if (!Stock.find) {
            res.send('username does not exist kindly register a new account');
        }
        // the Stock.find( ) is a mongoose method to find the stocks of a user with a specific user id from mongodb
        // database

        // Calculate chart data and create a chart (not included in the code, likely handled by a front-end library)
        const chartLabels = stocks.map(stock => stock.symbol);
        // chartLabels maps over all the data in the stock database of the user and retreives the stock symbol
        const chartData = stocks.map(stock => stock.qty * stock.symbolValue);
        // chartLabels maps over all the data in the stock database of the user and retreives the stock price and multiplies it
        //  with the quantity of stock entered by the user

        // Render the 'index' template with additional chart data
        res.render('index', { stocks, chartLabels, chartData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/contact',ensureAuthenticated, async (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ success: true, message: 'Your message has been received. We will get back to you shortly.' });
    } catch (err) {
        console.error('Error saving contact form data:', err);
        res.status(500).json({ error: 'An error occurred while saving your message. Please try again later.' });
    }
});


// Define a route for adding stocks to a user's portfolio
app.post('/addStock', ensureAuthenticated, async (req, res) => {
    const { symbol, qty } = req.body;
    // destructures the data from the body object and retreives only the symbol of the stock 
    // the user entered and the quantity
    try {
        const userStocks = await Stock.find({ user: req.user._id });
        if (userStocks.length >= 5) {
            // code for loop to limit user stock entries to 5.
            return res.status(400).send('Maximum stock limit reached');
        }

        // Create a new stock record associated with the current user
        await Stock.create({ symbol, qty, user: req.user._id });

        // Redirect the user back to the root URL ('/')
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route for deleting stocks from a user's portfolio
app.post('/deleteStock', ensureAuthenticated, async (req, res) => {
    const { id } = req.body;
    try {
        // Find and delete a stock record by its ID
        await Stock.findByIdAndDelete(id);

        // Redirect the user back to the root URL ('/')
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route for handling user login attempts
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

// Define a route for displaying the login form
app.get('/login', (req, res) => {
    res.render('login');
});

// Define a route for displaying the registration form
app.get('/register', (req, res) => {
    res.render('register');
});

// Define a route for handling user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash the user's password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record with the hashed password
        await User.create({ username, password: hashedPassword });

        // Redirect the user to the login page after successful registration
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Handle the form data here, e.g., save it to a database or send an email

    console.log(`Contact form submitted:
      Name: ${name}
      Email: ${email}
      Message: ${message}`);

    res.json({ success: true, message: 'Message sent successfully!' });
});
// Define a route for user logout
app.get('/logout', function (req, res, next) {
    // Call the 'req.logout' function, provided by Passport, to log the user out
    req.logout(function (err) {
        if (err) { return next(err); } // Handle any potential errors during logout
        res.redirect('/'); // Redirect the user to the root URL ('/') after successful logout
    });
});

// Middleware function to ensure that a user is authenticated before accessing certain routes
function ensureAuthenticated(req, res, next) {
    // Check if the user is authenticated using Passport's 'req.isAuthenticated' function
    if (req.isAuthenticated()) {
        return next(); // If authenticated, allow the user to access the next middleware or route
    }
    // If not authenticated, redirect the user to the login page
    res.redirect('/login');
}

// Define a route for fetching a user's stock portfolio
app.get('/stocks', async (req, res) => {
    try {
        if (!req.session.user) {
            // Check if there is no user session, indicating the user is not logged in
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Retrieve the user object from the session
        const user = req.session.user;

        // Find and retrieve stocks associated with the user's ID from the database
        const stocks = await Stock.find({ user: user._id });

        // Respond with the retrieved stock data in JSON format
        res.json(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        // Handle any errors during stock retrieval and respond with an error message
        res.status(500).json({ error: 'Error fetching stock data.' });
    }
});

// Define another route for fetching all stocks (potentially for a different purpose)
app.get('/stocks', async (req, res) => {
    try {
        // Retrieve all stocks from the database
        const stocks = await Stock.find();

        // Respond with the retrieved stock data in JSON format
        res.json(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        // Handle any errors during stock retrieval and respond with an error message
        res.status(500).json({ error: 'Error fetching stock data.' });
    }
});// Define various routes for different URLs

// Route for '/index' redirects to the root URL ('/')
app.get('/index', (req, res) => {
    res.redirect('/');
});

// Route for '/api' serves an HTML file located in the 'views' directory
app.get('/api', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'api.html');
    res.sendFile(filePath);
});

// Route for '/news' serves an HTML file located in the 'views' directory
app.get('/news', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'news.html');
    res.sendFile(filePath);
});

// Route for '/sitemap' serves an HTML file located in the 'views' directory
app.get('/sitemap', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'sitemap.html');
    res.sendFile(filePath);
});

// Route for '/asian' serves an HTML file located in the 'views' directory
app.get('/asian', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'asian.html');
    res.sendFile(filePath);
});

// Route for '/land' serves an HTML file located in the 'views' directory
app.get('/land', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'landing.html');
    res.sendFile(filePath);
});

// Route for '/video' serves an HTML file located in the 'views' directory
app.get('/video', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'video.html');
    res.sendFile(filePath);
});

// Route for '/logout' destroys the user session and redirects to the root URL ('/')
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy the user's session data
    res.redirect('/'); // Redirect the user to the root URL
});

// Middleware for serving JavaScript files under the '/js' path with the correct content type
app.use('/js', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
});

// Serve static JavaScript files from the 'public/js' directory
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Serve static assets from the 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route for '/video' renders an HTML template named 'video'
app.get('/video', (req, res) => {
    res.render('video');
});

// Start the server and listen on the specified port (PORT)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
