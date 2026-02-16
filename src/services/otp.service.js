const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { post } = require("axios");
const { AppError } = require("../middlewares/error/custom.error");

class OTPService {
  static async generateOTP(mobile) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const createdAt = new Date();

    const user = await prisma.customers.findUnique({
      where: { mobile },
    });

    if (!user) {
      throw new AppError("User Not Found", 406);
    }

    await prisma.otp.create({
      data: {
        mobile,
        otp: otp.toString(),
        created_at: createdAt,
        expires_at: expiresAt,
      },
    });

    const url =
      "http://communication.platform.api.dev.quickeats.lk/api/send-sms";

    const data = {
      mobile: mobile,
      otp: otp,
    };

    await post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async verifyOTP(mobile, otp) {
    try {
      const currentTime = new Date();

      const otpEntry = await prisma.otp.findFirst({
        where: {
          mobile,
          otp,
          expires_at: {
            gt: currentTime,
          },
        },
      });

      if (!otpEntry) {
        return false;
      }

      await prisma.otp.delete({
        where: { id: otpEntry.id },
      });

      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  }
}

module.exports = OTPService;
