import { Router } from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addCategorie,
  deleteCategorie,
  getAllCategorie,
  getCategorieProfile,
  updateCategorie,
} from "../controllers/categorieControllers.js";

import {
  createCategorieValidation,
  updateCategorieValidation,
} from "../validations/categorieValidator.js";

import validate from "../middlewares/validationResult.js";

const categorieRoute = Router();

categorieRoute
  .get("/", getAllCategorie)
  .get("/:id_categorie", getCategorieProfile)
  .post("/", createCategorieValidation, validate, addCategorie)
  .put("/:id_categorie", updateCategorieValidation, validate, updateCategorie)
  .delete("/:id_categorie", authorizeRoles("admin"), deleteCategorie);

export default categorieRoute;