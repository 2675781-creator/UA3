import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addEmprunt,
  addEmpruntForm,
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
  .get("/list-emprunt", authorizeRoles("employe"), getAllEmprunt)
  .get("/add-emprunt", addEmpruntForm)
  .get("/client/:id_client", authorizeRoles("admin"),  getEmpruntsByClient)
  .get("/article/:id_article", getEmpruntsByArticle)
  .post("/", createEmpruntValidation, validate, addEmprunt)
  .put("/:id_client/:id_article", updateEmpruntValidation, validate, updateEmprunt)
  .delete("/:id_client/:id_article", authorizeRoles("admin"), deleteEmprunt)
  
export default empruntRoute;