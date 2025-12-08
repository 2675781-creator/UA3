import { validationResult } from "express-validator";
import Article from "../modeles/Article.js";
import Categorie from "../modeles/Categorie.js"
import Auteur from "../modeles/Auteur.js"
import Employe from "../modeles/Employe.js";
import Client from "../modeles/Client.js";

async function fetchRelatedData(route, isEdit) {
    let data = {};
    if (route.startsWith("/articles") || route.startsWith("/emprunts") || route.startsWith("/clients")) {
      
      data.categories = await Categorie.findAll();
      data.auteurs = await Auteur.findAll();
      data.employes = await Employe.findAll();
      data.articles = await Article.findAll();
    }
    if(route.startsWith("/emprunts")) {
      data.clients = await Client.findAll();
    }
    return data;
}

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("Recu :", req.body)

  if (errors.isEmpty()) {

    return next();
  }
    /* return res.status(400).json({
      errors: errors.array()

    });*/
    // Déterminer la vue en fonciton de la route
   
    
    // Transformer les erreurs pour un affichage facile dans EJS
    // Votre EJS attend un objet { nom: message } pour la modification
    const errorMap = errors.array().reduce((acc, error) => {
        // Utiliser error.path (nom du champ) comme clé
        acc[error.path] = error.msg;
        return acc;
    }, {});

    const isPut = req.method === 'PUT' || req.query._method === 'PUT';
    const routePath = req.originalUrl.split('?')[0]; //nettoi le chemin de la route

    const idParam = req.params[Object.keys(req.params)[0]]

    let view;
    let extraData = {errors: errorMap, oldInput: req.body, title: "Erreur de validation"};

    extraData = {...extraData, ...(await fetchRelatedData(routePath))}
    
    if (routePath.startsWith("/clients")) {
      view = isPut ? "clients/edit-client" : "clients/add-client";

      if (isPut){

        // Pour l'ajout, votre vue utilise 'oldInput', donc on passe 'oldInput'
        extraData.client = await Client.findAllByPK(idParam); 
      
      }
    }
    
    else if(routePath.startsWith("/articles")) {
        view = isPut ? "clients/edit-client" : "clients/add-client"
        // Si c'est une requête PUT (Modification)
        if (isPut){
          extraData.article = await Article.findByPk(idParam);
        }
    }

    else if(routePath.startsWith("/emprunts")) {
      view = isPut ? "emprunts/edit-emprunt" : "emprunts/add-emprunt";
        if (isPut){

        }
    }
    else if(routePath.startsWith("/auteurs")) {
      view = isPut ? "auteurs/edit-auteur" : "auteurs/add-auteur";
      if (isPut){
        extraData.auteur = await Auteur.findByPk(idParam);
      }
    }
    else if(routePath.startsWith("/categories")) {
      view = isPut ? "categories/edit-categorie" : "categories/add-categorie";
      if (isPut){
        extraData.Categorie = await Categorie.findByPk(idParam);
      }
    }
    else if(routePath.startsWith("/employes")) {
      view = isPut ? "employes/edit-employe" : "employes/add-employe";
      if (isPut){
        extraData.employe = await Employe.findByPk(idParam);
      }
    }
    // 3. Rendre la vue
    if (!view) {
        // Si aucune vue n'est définie (route inconnue ou non gérée)
        return res.status(400).json({ errors: errors.array(), message: "Erreur de validation non gérée" });
    }

    return res.status(400).render(view, extraData)
  
}

export default validate;