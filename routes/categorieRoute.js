import { Router } from "express";
//import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { requireAuth, requireRole } from "../middlewares/pageAuthMiddleware.js";
import {
  addCategorie,
  deleteCategorie,
  editCategorieForm,
  getAllCategorie,
  getCategorieProfile,
  updateCategorie,
  addCategorieForm,
} from "../controllers/categorieControllers.js";

import {
  createCategorieValidation,
  updateCategorieValidation,
} from "../validations/categorieValidator.js";

import validate from "../middlewares/validationResult.js";

const categorieRoute = Router();

categorieRoute
  .get("/", requireAuth, getAllCategorie)
  .get("/add-categorie", requireRole("admin"), addCategorieForm)
  .get("/:id_categorie/edit", requireRole("admin") ,editCategorieForm)
  .get("/:id_categorie", requireAuth, getCategorieProfile)
  .post("/", requireRole("admin"), createCategorieValidation, validate, addCategorie)
  .put("/:id_categorie", requireRole("admin"), updateCategorieValidation, validate, updateCategorie)
  .delete("/:id_categorie", requireRole("admin"), /*authorizeRoles("admin"),*/ deleteCategorie);

export default categorieRoute;