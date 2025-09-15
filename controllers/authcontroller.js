const accountmodel = require("../models/accountModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { MailSending } = require("../middlewares/emailMeddleware.js");
const { uniqueOTP } = require("../middlewares/uniqueMeddleware");
const {
  accountvalidate,
  loginvalidate,
} = require("../middlewares/validateMeddleware");
const {
  otptemplate,
  resetsuccess,
  registertemplate,
  logintemplate,
} = require("../middlewares/templateMeddleware");

const register = async (req, res) => {
  try {
    const { error } = accountvalidate.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const user = await accountmodel.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists",
      });
    }

    const image = `${req.protocol}://${req.get(
      "host"
    )}/public/profiles/default.png`;

    await accountmodel.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      image: image,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Registration successfully, please login",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Error Occured while registering",
    });
  }
};
const login = async (req, res) => {
  try {
    const { error } = loginvalidate.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const user = await accountmodel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    if (user.status == "inactive") {
      res.status(400).json({
        message:
          "Your account has been inactive, please reset your password to activate your account.",
      });
    }
    if (user.status == "disabled") {
      res.status(400).json({
        message:
          "Your account has been disabled, please contact the customer support.",
      });
    }
    if (user.status == "deleted") {
      res.status(400).json({
        message:
          "Your account has been temporary deleted, please contact the customer support.",
      });
    }

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    const account = await accountmodel.findById(user._id).select("-password");

    res.status(200).json({
      status: 200,
      message: "Login successful",
      token: token,
      data: account,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Error Occured while logging in",
    });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const { email } = value;

    const user = await accountmodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "This email is not registered",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const otp = await uniqueOTP();

    const options = {
      email,
      subject: "Medicare - Password Reset OTP",
      message: otptemplate(otp, user.firstname),
    };
    await MailSending(options);

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    user.otp = otp;
    user.otpexpires = expiryTime;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "OTP has been sent to your email",
      token,
    });
  } catch (err) {
    console.error("Forget password error:", err.message);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while sending OTP",
    });
  }
};
const verifyOtp = async (req, res) => {
  const user = req.user;
  try {
    const account = await accountmodel.findById(user._id);
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        status: 400,
        message: "OTP is required",
      });
    }
    if (otp.length < 6) {
      return res.status(400).json({
        status: 400,
        message: "Invalid OTP",
      });
    }
    if (!account.otp) {
      return res.status(400).json({
        status: 400,
        message: "OTP not sent, send OTP again",
      });
    }

    if (otp === account.otp) {
      if (account.otpexpires < Date.now()) {
        account.otp = undefined;
        account.otpverified = false;
        account.otpexpires = undefined;
        await account.save();
        return res.status(400).json({
          status: 400,
          message: "OTP expired",
        });
      }

      account.otpverified = true;
      await account.save();
      res.status(200).json({
        status: 200,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Invalid OTP",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Error Occured while verifying OTP",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { error } = Joi.object({
      otp: Joi.string().required(),
      newpassword: Joi.string().min(8).required().messages({
        "string.empty": "New Password is required",
      }),

      confirmnewpassword: Joi.string().min(8).required().messages({
        "string.empty": "Confirm New Password is required",
      }),
    }).validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { otp, newpassword, confirmnewpassword } = req.body;
    const user = req.user;
    const account = await accountmodel.findById(user._id);
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    if (otp !== account.otp) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request, OTP not verified",
      });
    }
    if (account.otpverified === false) {
      return res.status(400).json({
        status: 400,
        message: "OTP not verified",
      });
    }

    if (account.otpexpires < Date.now()) {
      account.otp = undefined;
      account.otpverified = false;
      account.otpexpires = undefined;
      await account.save();
      return res.status(400).json({
        status: 400,
        message: "OTP expired, please try again later",
      });
    }

    if (newpassword != confirmnewpassword) {
      res.status(400).json({
        message: "Passwords must be the same",
      });
    }

    const options = {
      email: account.email,
      subject: "Medicare - Password Reset successful",
      message: resetsuccess(account.fullname),
    };
    await MailSending(options);

    account.password = newpassword;
    account.otp = undefined;
    account.otpexpires = undefined;
    account.otpverified = false;
    await account.save();

    res.status(200).json({
      status: 200,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Error Occured while changing password",
    });
  }
};

module.exports = {
  register,
  login,
  forgetPassword,
  verifyOtp,
  resetPassword,
};
