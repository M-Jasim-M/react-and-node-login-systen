const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const MongoDBStore = require('connect-mongodb-session')(session);
// const session = require('express-session');
const User = require('./Schema'); // Adjust the path as needed
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


const app = express();
const port = 5000;

// Middleware to handle JSON data
app.use(express.json());
// app.use(cors());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("uploads"));

// Connect to MongoDB
mongoose.connect('mongodb+srv://jasimwazir098:khan!!!@cluster0.bbx0tzz.mongodb.net/three', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Store uploaded images in the 'uploads' directory
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });




// Endpoint for file upload
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Use port 587 for TLS (587 is the standard port for secure SMTP)
  secure: false,
  auth: {
    user: 'webdeveloper4888@gmail.com', // Change to your email address
    pass: 'ltiaryitzoskbjbj', // Change to your email password
  },
});

// ...

// Endpoint for file upload
// app.post('/signup', upload.single('profileImage'), async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
// console.log(req.body);
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       // Email already exists, send an error response
//       return res.status(400).json({ success: false, message: 'Email already exists.' });
//     }

//     const profileImage = req.file ? req.file.path : '';
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate a 6-digit verification code
//     const verificationCode = generateVerificationCode();

//     // Save the verification code in the user's document in the database
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       verificationCode,
//     });
//     await user.save();

//     // Send the verification code to the user's email
//     await sendVerificationEmail(email, verificationCode);

//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'An error occurred.' });
//   }
// });
app.post('/signup', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Email already exists, send an error response
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    // const image = new Image({ img: file.filename });
    const image = file.filename;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image,
      verificationCode,
      isVerified: false,
    });
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});



// Generate a random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send the verification email
async function sendVerificationEmail(toEmail, code) {
  const mailOptions = {
    from: 'webdeveloper4888@gmail.com', // Change to your email address
    to: toEmail,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

app.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;
 console.log(req.body)
    // Find the user by the verification code in your database
    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      // Invalid verification code
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.json({ success: true, message: 'Email verification successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});


app.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Generate a new 6-digit verification code
    const newVerificationCode = generateVerificationCode();

    // Update the user's verification code in the database
    user.verificationCode = newVerificationCode;
    user.isVerified = false; // Mark as not verified
    await user.save();

    // Send the new verification code to the user's email
    await sendVerificationEmail(email, newVerificationCode);

    res.json({ success: true, message: 'New verification code sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});


function generateResetToken() {
  const length = 32; // Adjust the length of the token as needed
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}

// Endpoint for initiating password reset
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Generate a unique reset token
    const resetToken = generateResetToken();

    // Save the reset token and its expiration time in the user's document
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the reset email to the user with a link to the reset page
    const resetLink = `http://localhost:3000/reset?token=${resetToken}`;
    // await sendPasswordResetEmail(email,resetLink );
    await sendVerificationEmail(email, resetLink);
    res.json({ success: true, message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});

// ...
// Make sure to adjust the generateResetToken function according to your requirements, including the desired length and character set for the reset token.


app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
console.log(req.body)
    // Find the user by the reset token in your database
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    // Update the user's password with the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});


const store = new MongoDBStore({
  uri: 'mongodb+srv://jasimwazir098:khan!!!@cluster0.bbx0tzz.mongodb.net/three',
  collection: 'sessions', // Name of the collection to store sessions
});

// Initialize the express-session middleware with the store
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secret key
    resave: false,
    saveUninitialized: false,
    store: store, // Use the MongoDBStore for session storage
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session expires in 24 hours (adjust as needed)
    },
  })
);



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Email not verified. Please verify your email.' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // If the login is successful, store user data in the session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      // You can include other user-related data here as needed
    };
    // console.log(req.sessionID);
    // localStorage.setItem('sessionId', req.sessionID);
    res.json({ success: true, message: 'Login successful.', user: req.sessionID ,data: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});

// Endpoint to retrieve session data
// app.get('/get-session', (req, res) => {
//   // Check if a session ID is provided in the request query
//   const sessionId = req.query.sessionId;

// console.log(req.query.sessionId)

// console.log(sessionId);
//   if (!sessionId) {
//     return res.status(400).json({ success: false, message: 'Session ID is required.' });
//   }

//   // Retrieve the session data from the database using the session ID
//   store.get(sessionId, (err, sessionData) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: 'An error occurred.' });
//     }

//     if (!sessionData) {
//       return res.status(404).json({ success: false, message: 'Session not found.' });
//     }

//     // Send the session data to the frontend
//     res.json({ success: true, session: sessionData });
//   });
// });

// const verifySession = async (req, res, next) => {
//   const sessionID = req.headers.authorization && req.headers.authorization.split(' ')[1];
//  console.log(sessionID);
//   if (!sessionID) {
//     return res.status(401).json({ success: false, message: 'Session ID not provided.' });
//   }

//   // Use the `get` method to retrieve the session by session ID
//   store.get(sessionID, (err, session) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: 'An error occurred while retrieving the session.' });
//     }

//     if (!session) {
//       console.log({ success: false, message: 'Invalid session ID.' })

//       return res.status(401).json({ success: true, message: 'Invalid session ID.' });
//     }

//     // Session is valid, you can proceed with the protected operation
//     next();
//   });
// };


// app.get('/protected-api-endpoint', verifySession, (req, res) => {
//   // This code will only execute if the session ID is valid
//   res.json({ success: true, message: 'Access granted.' });
//   console.log({ success: true, message: 'Access granted.' });
// });

// Endpoint to get the logged-in user's data
app.get('/api/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Query your MongoDB or database to find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // If user found, send the user data in the response
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});


app.put('/update-profile', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update user data if new values are provided
    if (name) {
      existingUser.name = name;
    }

    // Check if a profileImage file was uploaded
    if (req.file) {
      // Save the filename to the user's profileImage field
      existingUser.image = req.file.filename;
    }
console.log(req.file);
    // Save the updated user data in the database
    await existingUser.save();

    res.json({ success: true, message: 'User data updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: '198481959782373',
      clientSecret: '49251a8abafa33e96eeec32d9148fa65',
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        // Extract data from the profile object with fallback values
        const name = profile.displayName || 'No Name';
        const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : 'No Email';
        const image = (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : '';

        // Log user data and tokens
        console.log('Received user data from Facebook:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Image:', image);
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        User.findOne({ email }).then((existingUser) => {
          if (existingUser) {
            // Update the Facebook access token
            existingUser.facebookAccessToken = accessToken;
            existingUser.save().then((user) => {
              done(null, user);
            });
          } else {
            const newUser = new User({
              name,
              email,
              image,
              facebookAccessToken: accessToken,
              // isVerified: { type: Boolean, default: true },
            });
            newUser.save().then((user) => {
              done(null, user);
            });
          }
        });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect as needed.
  res.redirect('http://localhost:3000/google');
  // res.redirect('http://localhost:3000/dash');
  // res.redirect('/api/user')
});

app.get('/api/user', (req, res) => {
  // Check if a user is authenticated
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  return res.status(401).json({ message: 'Unauthorized' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
