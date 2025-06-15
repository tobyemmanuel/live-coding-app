import { Router } from "express";
import RolesController from "../controllers/roles-controller";

const roleRouter = Router();

roleRouter.get("/role", RolesController.getRoles);
roleRouter.post("/role", RolesController.createRole);
roleRouter.put("/role/:id", RolesController.updateRole);
roleRouter.delete("/role/:id", RolesController.deleteRole);
roleRouter.get("/role/:id", RolesController.getRoleById);
