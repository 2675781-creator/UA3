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

router.get("/", afficherListeArticles);
router.get("/new", afficherFormNewArticle);        
router.post("/new", creerArticleDepuisPage);    
router.get("/:id_article", afficherProfilArticle);
router.get("/:id_article/edit", afficherFormEditArticle);

// SAUVEGARDE du formulaire d'édition
router.post("/:id_article/edit", mettreAJourArticleDepuisPage);   

router.post("/:id_article/delete", supprimerArticleDepuisPage);

export default router;