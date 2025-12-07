import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addEmploye,
  addEmployeForm,
  deleteEmploye,
  editEmployeForm,
  getAllEmploye,
  getEmployeProfile,
  updateEmploye,
} from "../controllers/employeControllers.js";

import {
  createEmployeValidation,
  updateEmployeValidation,
} from "../validations/employeValidator.js";

import validate from "../middlewares/validationResult.js";

const employeRoute = Router();

employeRoute
  .get("/", getAllEmploye)
  .get("/add-employe", addEmployeForm)
  .get("/:id_employe/edit", editEmployeForm)
  .get("/:id_employe", getEmployeProfile)
  .post("/", createEmployeValidation, validate, addEmploye)
  .put("/:id_employe", updateEmployeValidation, validate, updateEmploye)
  .delete("/:id_employe", authorizeRoles("admin"), deleteEmploye)
  
export default employeRoute;