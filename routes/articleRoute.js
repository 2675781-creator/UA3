import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  addArticle,
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
  .get("/", getAllArticle)
  .get("/:id_article", getArticleProfile)
  .post("/", createArticleValidation, validate, addArticle)
  .delete("/:id_article", authorizeRoles("admin"), authMiddleware, deleteArticle)
  .put("/:id_article", updateArticleValidation, validate, updateArticle);

export default articleRoute;