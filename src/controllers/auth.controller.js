const OTPService = require("../services/otp.service");
const AuthService = require("../services/auth.service");

exports.signUp = async (req, res, next) => {
  try {
    await AuthService.signup(req.body);
    res.json("success");
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    const token = await AuthService.signIn(mobile, otp);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.requestOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    await OTPService.generateOTP(mobile);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in generating OTP:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res
        .status(401)
        .json({ status: "fail", message: "Token is missing or invalid" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const newToken = await AuthService.refreshToken(token);
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
};
