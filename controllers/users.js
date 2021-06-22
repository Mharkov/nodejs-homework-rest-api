const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constans');
const UploadAvatar = require('../services/upload-avatars-cloud');
const EmailService = require('../services/email');
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require('../services/sender-email');

// const UploadAvatar = require('../services/upload-avatars-local');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const newUser = await Users.create(req.body);
    const { id, email, subscription, avatar, verifyToken } = newUser;
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid()
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (e) {
      console.log(e.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          id,
          name,
          email,
          subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id);
    return res.status(HttpCode.NO_CONTENT).json({
      status: 'success',
      code: HttpCode.NO_CONTENT,
    });
  } catch (e) {
    next(e);
  }
};
const current = async (req, res, next) => {
  try {
    const email = req.user.email;
    const subscription = req.user.subscription;

    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Not authorized',
      });
    }

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};
const update = async (req, res, next) => {
  const userId = req.user.id;
  try {
    await Users.updateSuscription(userId, req.body.subscription);
    const user = await Users.findById(userId);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// const avatars = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const uploads = new UploadAvatar(AVATARS_OF_USERS);
//     const avatarUrl = await uploads.saveAvatarToStatic({
//       idUser: userId,
//       pathFile: req.file.path,
//       name: req.file.filename,
//       oldFile: req.user.avatar,
//     });
//     await Users.updateAvatar(id, avatarUrl);
//     return res.json({
//       status: 'success',
//       code: HttpCode.OK,
//       data: { avatarUrl },
//     });
//   } catch (e) {
//     next(e);
//   }
// };

const avatars = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new UploadAvatar(uploadCloud);
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg
    );
    await Users.updateAvatar(id, avatarUrl, userIdImg);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};

// /auth/verify/:verificationToken
const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.verificationToken);
    if (user)
      if (user) {
        await Users.updateVerifyToken(user.id, true, null);
        return res.status(HttpCode.OK).json({
          status: 'Success',
          code: HttpCode.OK,
          message: 'Verification successfull',
        });
      }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'Error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    });
  } catch (e) {
    next(e);
  }
};

// user/verify/
const repeatSendEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { name, email, verifyToken, verify } = user;

      if (!verify) {
        try {
          const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSenderSendgrid()
          );
          await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            message: 'Verification email resubmited!',
          });
        } catch (e) {
          console.log(e.message);
          return next(e);
        }
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        nessage: 'Email has already been verified',
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'User not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  update,
  avatars,
  verify,
  repeatSendEmailVerify,
};
