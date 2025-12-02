import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addArticle,
  addArticleForm,
  deleteArticle,
  getAllArticle,
  getArticleProfile,
  updateArticle,
} from "../controllers/articleControllers.js";

import {
  createArticleValidation,
  updateArticleValidation,
} from "../validations/articleValidator.js";

import validate from "../middlewares/validationResult.js";

const articleRoute = Router();

articleRoute
  .get("/list-article", getAllArticle)
  .get("/add-article", addArticleForm)
  .get("/:id_article", getArticleProfile)
  .post("/add-article", createArticleValidation, validate, addArticle)
  .delete("/:id_article", authorizeRoles("admin"), authMiddleware, deleteArticle)
  .put("/:id_article", updateArticleValidation, validate, updateArticle);

export default articleRoute;