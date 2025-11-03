import { Router } from "express";
import RolesController from "../controllers/roles-controller";

const role = Router();
role.get("/role", RolesController.getRoles);
role.post("/role", RolesController.createRole);
role.put("/role/:id", RolesController.updateRole);
role.delete("/role/:id", RolesController.deleteRole);
role.get("/role/:id", RolesController.getRoleById);

export default role;
