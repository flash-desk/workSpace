import mongoose from "mongoose";
import validator from "validator";
import userRoles from "../../utils/roles.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "not valid email"],
    },
    passwordHash: {
      type: String,
      required: [true, "password is required"],
      select: false,
    }, 
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.CUSTOMER,
      required: [true, "role is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },


    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ deletedAt: 1 });

function excludeSoftDeleted() {
  if (this.getFilter().deletedAt === undefined) {
    this.where({ deletedAt: null });
  }
}
userSchema.pre(/^find/, excludeSoftDeleted);

const User = mongoose.model("User", userSchema);
export default User;
