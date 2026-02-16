const { verify } = require("jsonwebtoken");
const { findByEmail } = require("../services/auth.service");
const protect = async (req, res, next) => {
  try {
    // Allow public routes (Signup, SignIn, Request OTP, Refresh Token)
    if (
      (req.path === "/signUp" && req.method === "POST") ||
      (req.path === "/signIn" && req.method === "POST") ||
      (req.path === "/request-otp" && req.method === "POST") ||
      (req.path === "/verify-otp" && req.method === "POST") ||
      (req.path === "/refresh-token" && req.method === "POST")
    ) {
      return next();
    }

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to get access",
      });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    if (decoded.mobile) {
      req.user = { mobile: decoded.mobile };
      return next();
    }

    const user = await findByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = protect;
