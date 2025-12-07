import { validationResult } from "express-validator";
import Article from "../modeles/Article.js";
import Categorie from "../modeles/Categorie.js"
import Auteur from "../modeles/Auteur.js"
import Employe from "../modeles/Employe.js";
import Client from "../modeles/Client.js";

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

    let view;
    let extraData = {errors: errorMap, oldData: req.body};

    if (req.originalUrl.startsWith("/clients")) {
      const articles = await Article.findAll();
      
      extraData.articles = articles;
      
      if (req.method === 'PUT' || req.query._method === 'PUT'){
          view = "clients/edit-client";

          // Récupérer l'ID à partir des paramètres (ex: /clients/123)
          const id_client = req.params.id_client; 
            
          // Récupérer l'objet client original
          const client = await Client.findByPk(id_client);
            
          // Passer l'objet client original à la vue
          extraData.client = client;
      }
      else{
        view = "clients/add-client";
        // Pour l'ajout, votre vue utilise 'oldInput', donc on passe 'oldInput'
        extraData.oldInput = req.body; 
        // NOTE: Vous devrez ajuster votre vue 'add-client.ejs' pour utiliser 'errors' au lieu de la structure d'erreur actuelle.
      }
    }
    
    else if(req.originalUrl.startsWith("/articles")) {
      
        const categories = await Categorie.findAll()
        const auteurs = await Auteur.findAll()
        const employes = await Employe.findAll()
        extraData.categories = categories;
        extraData.auteurs = auteurs;
        extraData.employes = employes;
        // Si c'est une requête PUT (Modification)
        if (req.method === 'PUT' || req.query._method === 'PUT') {
            view = "articles/edit-article";
            // Il faudrait ici récupérer l'objet article original (comme on a fait pour le client)
            // extraData.article = await Article.findByPk(req.params.id_article);
        } else { // Sinon (POST pour l'ajout)
            view = "articles/add-article";
            extraData.oldInput = req.body; 
        }

    
    }
    else if(req.originalUrl.startsWith("/emprunts")) {
      view = "emprunts/add-emprunt";
    }
    else if(req.originalUrl.startsWith("/auteurs")) {
      view = "auteurs/add-auteur";
    }
    else if(req.originalUrl.startsWith("/categories")) {
      view = "categories/add-categorie";
    }
    else if(req.originalUrl.startsWith("/employes")) {
      view = "employes/add-employe";
    }
    // 3. Rendre la vue
    if (!view) {
        // Si aucune vue n'est définie (route inconnue ou non gérée)
        return res.status(400).json({ errors: errors.array(), message: "Erreur de validation non gérée" });
    }

    return res.status(400).render(view, {
      
      ...extraData,
      title: "Erreur de validation" // Ajoutez un titre par défaut
    })
  
}

export default validate;