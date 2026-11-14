import { z } from "zod";
import userRoles from "../../utils/roles.js";

// Admin/super_admin are never creatable here. Staff accounts are created by owners via the workspace module.
const STAFF_CREATABLE_ROLES = [
  userRoles.OWNER,
  userRoles.SUPPORT,
  userRoles.MODERATOR,
];

export const createStaffSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  role: z.enum(STAFF_CREATABLE_ROLES),
});
