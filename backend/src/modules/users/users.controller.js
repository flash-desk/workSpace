import User from "./users.model.js";
import PasswordResetToken from "../auth/models/passwordResetToken.model.js";
import httpStateText from "../../utils/httpStateText.js";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../middlewares/catchAsync.js";
import bcrypt from "bcryptjs";
import {
  saveImage,
  deleteImage,
} from "../../integrations/fileStorage.service.js";
import sanitizeUser from "../../utils/sanitizeUser.js";
import { revokeAllUserTokens } from "../auth/auth.service.js";
import { sha256, generateOpaqueToken } from "../../utils/hash.js";
import { sendStaffInviteEmail } from "../../integrations/email.service.js";
import logger from "../../utils/logger.js";
import { isValidMongoId } from "../../utils/validations.js";
import { id } from "zod/locales";

const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 min

const USER_LIST_PROJECTION = {
  __v: 0,
};
// passwordHash is select:false on the schema already, so it never comes
// back unless explicitly requested with +passwordHash.

const getAllUsers = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, USER_LIST_PROJECTION)
    .limit(limit)
    .skip(skip);
  res.json({
    status: httpStateText[200],
    data: {
      users,
    },
  });
});

const getSingleUsers = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!isValidMongoId(id)) {
    const error = AppError.create("invalid mongo id", 400, httpStateText[400]);
    return next(error);
  }
  const user = await User.findById(id, USER_LIST_PROJECTION);
  if (!user) {
    const error = AppError.create("User not found", 404, httpStateText[404]);
    return next(error);
  }
  return res.json({ status: httpStateText[200], data: user });
});

const getMe = catchAsync(async (req, res, next) => {
  
  const user = await User.findById(req.currentUser.id);
  if (!user) {
    return next(AppError.create("User not found", 404, httpStateText[404]));
  }
  res.json({
    status: httpStateText[200],
    data: {
      user: sanitizeUser(user),
      role: user.role,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
if (!isValidMongoId(id)) {
  const error = AppError.create("invalid mongo id", 400, httpStateText[400]);
  return next(error);
}

  const { firstName, lastName, phone } = req.body;

  const user = await User.findById(id);
  if (!user) {
    const error = AppError.create("User not found", 404, httpStateText[404]);
    return next(error);
  }

  if (req.file) {
    const result = await saveImage(req.file.buffer, "avatars");
    await deleteImage(user.avatarPublicId);
    user.avatarUrl = result.url;
    user.avatarPublicId = result.key;
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;

  await user.save();
  res.json({ status: httpStateText[200], data: sanitizeUser(user) });
});

// Soft delete
const deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(AppError.create("User not found", 404, httpStateText[404]));
  }

  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();
  await revokeAllUserTokens(user._id);

  res.clearCookie("refreshToken");
  res.status(200).json({
    status: httpStateText[200],
    data: {
      message: "User deleted",
    },
  });
});


const createStaff = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(
      AppError.create(
        "A user with this email already exists",
        409,
        httpStateText[409],
      ),
    );
  }

  const throwawayPassword = generateOpaqueToken(24);
  const passwordHash = await bcrypt.hash(throwawayPassword, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    role,
    isEmailVerified: true, // admin-vouched — no self email-verification loop needed
  });

  const resetToken = generateOpaqueToken();
  await PasswordResetToken.create({
    user: user._id,
    resetTokenHash: sha256(resetToken),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  try {
    await sendStaffInviteEmail(user.email, resetToken, role);
  } catch (err) {
    logger.error("Failed to send staff invite email", {
      email: user.email,
      error: err.message,
    });
  }

  res
    .status(201)
    .json({ status: httpStateText[201], data: sanitizeUser(user) });
});

export {
  getAllUsers,
  getSingleUsers,
  getMe,
  updateUser,
  deleteUser,
  createStaff,
};
