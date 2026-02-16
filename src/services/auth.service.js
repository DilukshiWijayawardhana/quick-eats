const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const OTPService = require("./otp.service");
const jwt = require("jsonwebtoken");
const {
  NotFoundError,
  AppError,
} = require("../middlewares/error/custom.error");

class AuthService {
  static async findByEmail(email) {
    const user = await prisma.customers.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static signToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static async signup({ email, name, mobile }) {
    try {
      const existingUser = await prisma.customers.findFirst({
        where: {
          OR: [{ email: email }, { mobile: mobile }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("A user with this email already exists.");
        } else if (existingUser.mobile === mobile) {
          throw new Error("A user with this mobile number already exists.");
        }
      }

      const newUser = await prisma.customers.create({
        data: {
          name,
          email,
          mobile,
        },
      });

      return newUser;
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  static async signIn(mobile, otp) {
    const isValid = await OTPService.verifyOTP(mobile, otp);

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }

    return this.generateToken(mobile);
  }

  static generateToken(mobile) {
    return jwt.sign({ mobile }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static async refreshToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mobile = decoded.mobile;
    const user = await prisma.customers.findUnique({
      where: { mobile },
    });

    if (!user) {
      throw new AppError("User Not Found", 406);
    }

    const expTimestamp = decoded.exp * 1000;
    const currentTime = Date.now();

    const threeMinutes = 3 * 60 * 1000;
    const timeUntilExpiry = expTimestamp - currentTime;

    if (timeUntilExpiry <= threeMinutes && timeUntilExpiry > 0) {
      return this.generateToken(mobile);
    } else if (timeUntilExpiry <= 0) {
      throw new Error("Token has expired");
    } else {
      return token;
    }
  }
}

module.exports = AuthService;
