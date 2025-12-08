import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addClient,
  addClientForm,
  deleteClient,
  editClientForm,
  getAllClient,
  getClientProfile,
  updateClient,
} from "../controllers/clientControllers.js";

import {
  createClientValidation,
  updateClientValidation,
} from "../validations/clientValidator.js";

import validate from "../middlewares/validationResult.js";

const clientRoute = Router();

clientRoute
  .get("/", getAllClient)
  .get("/add-client", addClientForm)
  .get("/:id_client/edit", editClientForm)
  .get("/:id_client", getClientProfile)
  .post("/", createClientValidation, validate, addClient)
  .put("/:id_client", updateClientValidation, validate, updateClient)
  .delete("/:id_client", deleteClient)
  
//authorizeRoles("admin"),
export default clientRoute;