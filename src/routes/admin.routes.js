import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { AuthGuard } from "../middleware/jwt-auth.guard.js";
import { SuperAdminGuard } from "../middleware/super-admin.guard.js";
const router = Router();
const controller = new AdminController();

router.post('/', controller.createAdmin)
      .get('/', controller.getAllAdmin)
      .get('/:id', controller.getAdminById)
      .patch('/:id', controller.update)
      .delete('/:id', AuthGuard, SuperAdminGuard, controller.delete)
      .post('/signin', controller.signinAdmin)

export default router;
