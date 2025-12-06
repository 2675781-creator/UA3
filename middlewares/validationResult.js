import { validationResult } from "express-validator";
import Article from "../modeles/Article.js";
import Categorie from "../modeles/Categorie.js"
import Auteur from "../modeles/Auteur.js"
import Employe from "../modeles/Employe.js";

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("Recu :", req.body)

  if (!errors.isEmpty()) {
    /* return res.status(400).json({
      errors: errors.array()

    });*/
    // Déterminer la vue en fonciton de la route
    let view;
    let extraData = {};

    if (req.originalUrl.startsWith("/clients")) {
      view = "./clients/add-client";
      const articles = await Article.findAll();
      extraData.articles = articles;
    }
    else if(req.originalUrl.startsWith("/articles")) {
      view = "./articles/add-article";
      const categories = await Categorie.findAll()
      const auteurs = await Auteur.findAll()
      const employes = await Employe.findAll()
      extraData.categories = categories;
      extraData.auteurs = auteurs;
      extraData.employes = employes;
    }
    else if(req.originalUrl.startsWith("/emprunts")) {
      view = "./emprunts/add-emprunt";
    }
    else if(req.originalUrl.startsWith("/auteurs")) {
      view = "./auteurs/add-auteur";
    }
    else if(req.originalUrl.startsWith("/categories")) {
      view = "./categories/add-categorie";
    }
    else if(req.originalUrl.startsWith("/employes")) {
      view = "./employes/add-employe";
    }
    return res.status(400).render(view, {
      errors: errors.array(),
      oldInput: req.body,
      ...extraData
    })
  }
  next();
};

export default validate;