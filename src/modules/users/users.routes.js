import express from "express";
const router = express.Router();

import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import checkUserOwnership from "../../middlewares/checkUserOwnership.js";
import uploadMemory from "../../middlewares/uploadMemory.js";
import validate from "../../middlewares/validate.js";
import userRoles from "../../utils/roles.js";
import { createStaffSchema } from "./users.validation.js";

import {
  getAllUsers,
  getSingleUsers,
  getMe,
  updateUser,
  deleteUser,
  createStaff,
} from "./users.controller.js";

// static routes must come before "/:id"
router.post(
  "/staff",
  authenticate,
  authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN),
  validate(createStaffSchema),
  createStaff,
);

router.get("/me", authenticate, getMe);

router
  .route("/")
  .get(
    authenticate,
    authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN, userRoles.SUPPORT),
    getAllUsers,
  );

router
  .route("/:id")
  .get(
    authenticate,
    authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN, userRoles.SUPPORT),
    getSingleUsers,
  )
  .patch(
    authenticate,
    checkUserOwnership,
    uploadMemory(2, 1).single("avatar"),
    updateUser,
  )
  .delete(authenticate, checkUserOwnership, deleteUser);

export default router;
