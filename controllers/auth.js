const User = require('../models/User');


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Prevent user from setting role manually
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: 'Cannot register user'
    });
  }
};



// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user (+password because select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: 'Login failed'
    });
  }
};



// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};



// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};



// Helper: Send token response
const sendTokenResponse = (user, statusCode, res) => {

  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() +
      (process.env.JWT_COOKIE_EXPIRE || 1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};