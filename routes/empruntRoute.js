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
  editEmpruntForm
} from "../controllers/empruntControllers.js";

import {
  createEmpruntValidation,
  updateEmpruntValidation,
} from "../validations/empruntValidator.js";

import {
  requireAuth, requireRole
} from "../middlewares/pageAuthMiddleware.js"
import validate from "../middlewares/validationResult.js";
import { format } from "mysql2";

const empruntRoute = Router();

empruntRoute
  .get("/", requireAuth, getAllEmprunt)
  .get("/add-emprunt", requireRole("admin"), addEmpruntForm)
  .get("/:id_client/:id_article/edit", requireRole("admin"), editEmpruntForm)
  .get("/client/:id_client", requireRole("admin"),  getEmpruntsByClient)
  .get("/article/:id_article", requireAuth, getEmpruntsByArticle)
  .post("/", requireAuth, createEmpruntValidation, validate, addEmprunt)
  .put("/:id_client/:id_article", requireAuth, updateEmpruntValidation, validate, updateEmprunt)
  .delete("/:id_client/:id_article", requireRole("admin"), deleteEmprunt);

export default empruntRoute;