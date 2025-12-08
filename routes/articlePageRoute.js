import { Router } from "express";
import {
  afficherListeArticles,
  afficherFormEditArticle,
  supprimerArticleDepuisPage,
  afficherProfilArticle,
  mettreAJourArticleDepuisPage,  
  afficherFormNewArticle,     
  creerArticleDepuisPage,     
} from "../controllers/articlePageController.js";

const router = Router();

//route spécifiques
router.get("/add-article", afficherFormNewArticle);        
router.post("/add-article", creerArticleDepuisPage);    
router.get("/:id_article/edit", afficherFormEditArticle);
router.post("/:id_article/edit", mettreAJourArticleDepuisPage);
router.post("/:id_article/delete", supprimerArticleDepuisPage)

//route principal
router.get("/", afficherListeArticles);
router.get("/:id_article", afficherProfilArticle);


export default router;