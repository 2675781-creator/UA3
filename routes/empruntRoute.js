import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addEmprunt,
  deleteEmprunt,
  getAllEmprunt,
  getEmpruntsByArticle,
  getEmpruntsByClient,
  updateEmprunt,
} from "../controllers/empruntControllers.js";

import {
  createEmpruntValidation,
  updateEmpruntValidation,
} from "../validations/empruntValidator.js";

import validate from "../middlewares/validationResult.js";

const empruntRoute = Router();

empruntRoute
  .get("/", authorizeRoles("employe"), getAllEmprunt)
  .get("/client/:id_client", authorizeRoles("admin"),  getEmpruntsByClient)
  .get("/article/:id_article", getEmpruntsByArticle)
  .post("/", createEmpruntValidation, validate, addEmprunt)
  .put("/:id", updateEmpruntValidation, validate, updateEmprunt)
  .delete("/:id", authorizeRoles("admin"), deleteEmprunt);

export default empruntRoute;