import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addClient,
  deleteClient,
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
  .get("/:id_client", getClientProfile)
  .post("/", createClientValidation, validate, addClient)
  .put("/:id_client", updateClientValidation, validate, updateClient)
  .delete("/:id_client", authorizeRoles("admin"), deleteClient);

export default clientRoute;