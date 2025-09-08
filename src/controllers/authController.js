const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, role, legalName, dob, phoneNumber, aadharNumber, address } = req.body;
    console.log(`📝 REGISTRATION ATTEMPT for email: ${email}, role: ${role}`);

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`❌ REGISTRATION FAILED: User already exists for email: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log(`✅ EMAIL AVAILABLE: Proceeding with registration for ${email}`);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      email,
      password: hashedPassword,
      role,
      legalName,
      dob,
      phoneNumber,
      aadharNumber,
      address
    });

    console.log(`✅ USER CREATED: ${user.email}, Role: ${user.role}, ID: ${user._id}`);

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        legalName: user.legalName
      }
    };

    console.log(`🚀 REGISTRATION SUCCESS: User created and token generated for ${email}`);

    res.status(201).json(responseData);
  } catch (error) {
    console.error('💥 REGISTRATION ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 LOGIN ATTEMPT for email: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ LOGIN FAILED: User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`✅ USER FOUND: ${user.email}, Role: ${user.role}, ID: ${user._id}`);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ LOGIN FAILED: Invalid password for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`✅ PASSWORD MATCH: Login successful for ${email}`);

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    console.log(`🎟️ TOKEN GENERATED: ${token.substring(0, 20)}...`);

    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        legalName: user.legalName
      }
    };

    console.log(`🚀 LOGIN SUCCESS: Sending response for ${email}`, responseData.user);

    res.json(responseData);
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};