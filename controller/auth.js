const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Publice    
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    // create token
    const token = user.getSignedJwtToken();

    sendTokenResponse(user, 200, res);
})

// @desc        login user
// @route       POST /api/v1/auth/login
// @access      Publice    
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    // check if password matchs
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    sendTokenResponse(user, 200, res);
})

// get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 100),
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
        })
}


// @desc        Get Current Logged in User
// @route       GET /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })

})
