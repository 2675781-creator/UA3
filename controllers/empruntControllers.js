import Article from "../modeles/Article.js"
import Client from "../modeles/Client.js"
import Emprunt from "../modeles/Emprunt.js"

//Lecture de la listes des emprunts
export async function getAllEmprunt(req, res) {
    try{
        const emprunts = await Emprunt.findAll()
        //res.status(200).json({message:"liste de tous les emprunts", data: emprunts})
        return res.render("emprunts/list-emprunt", {
          message: "Liste des emprunts",
          emprunts
        })
    }
    
    catch(error){
        res.status(404).send("Erreur serveur: " + error.message)
    }
}

//Formulaire pour créer un emprunt


export const addEmpruntForm = async (req, res) => {

  try {
    return res.render("emprunts/add-emprunt", {
      title: "Ajouter un emprunt",
      errors: {},
      oldInput: {}
    })
  }
  catch(error) {
    res.status(400).send("Erreur serveur : " + error.message)
  }
}


// Création d'un emprunt

export const addEmprunt= async (req, res) =>{
    const newEmprunt = req.body

    try{
      const emprunt = await Emprunt.create(newEmprunt)
      return res.redirect("/emprunts")
      //res.status(201).json({message: "Emprunt ajouté avec succes", data: emprunt})
    }
    catch(error){
      return res.status(400).render("emprunts/add-emprunt", {
          message: "Erreur lors de l'ajout de l'emprunt.",
          errors: [{msg: error.message}],
          oldInput: req.body
      })
    //res.status(400).json({message:error.message})
  
}
}

//suppression d'un Emprunt
export const deleteEmprunt = async(req, res) => {
    const {id_client, id_article} = req.params
    if (!id_client || !id_article) {
        //return res.status(400).json({error:true, message: "id_client et id_article sont requis"});
        return res.redirect("/emprunts");
    }
    try {
        const result = await Emprunt.destroy({where: {id_client, id_article}});
        
        res.redirect("/emprunts")
        //res.status(200).json({message: `L'emprunt a été supprimé avec succes`})
    }
    catch(error){
        res.status(500).send("Erreur suppression: "+ error.message);
    }
}

export const editEmpruntForm = async (req, res) => {
  const {id_client, id_article} = req.params

  try{
    const emprunt = await Emprunt.findOne({ where: {id_client, id_article}})
    
    if (!emprunt) {
      return res.status(404).redirect("/emprunts")
    }

    const clients = await Client.findAll()
    const articles = await Article.findAll()

    return res.render("emprunts/edit-emprunt", {
      title: "modifier un emprunt",
      emprunt,
      clients, 
      articles,
      errors: {},
      oldInput: {}
    });

  } catch(error) {
    res.status(500).send("Erreur serveur lors du chargement due formulaire d'édition: "+error.message)
  }
}

//voir un emprunt par son numéro
export const getEmpruntStatut = async (req, res) => {
    const {id_client, id_article} = req.params;
    try{
        const emprunt = await Emprunt.findOne({ where: {id_client, id_article}
        });
        if (!emprunt){
            //return res.status(400).json({message:"Emprunt introuvable"})
            return res.redirect("/emprunts");
        }

        return res.render("./emprunts/profil-emprunt", {emprunt})
        //res.status(200).json({message:"statut d'un emprunt", data:emprunt})
    }
    catch(error){
        res.status(404).send("Erreur serveur: "+error.message);
    }
}

//mise a jour d'un Emprunt
export const updateEmprunt = async (req, res) => {
    //:Es anciens IDs sont dans req.params. LEs nouvelles données (incluant ptentiellement de nouveaux IDs) sont dans req.body
    const old_id_client = req.params.id_client; //URL
    const old_id_article = req.params.id_article; //URL
    const updatedEmprunt = req.body;
    
    if (!old_id_client || !old_id_article){
        //return res.status(400).json({error:true, message: "L'id du client et l'id de l'article est requis"});
        return res.status(400).redirect("/emprunts");
    }
    try {
        const emprunt = await Emprunt.findOne({
            where : {id_client: old_id_client, id_article: old_id_article}
        });

        if (!emprunt){
          return res.status(404).send("Emprunt non trouvé");
        }

        // mettre a jour l'instance avec les nouvelle données
        emprunt.set(updatedEmprunt);

        //Sauvegarder l'instance
        await emprunt.save()

        res.redirect("/emprunts")
        //res.status(200).json({message: "Emprunt mis a jour",result});
    }
    catch(error){
      console.error("ERREUR DE MISE À JOUR CATCHÉE:", error.name || error.message)
      const clients = await Client.findAll()
      const articles = await Article.findAll()
      const emprunt = await Emprunt.findOne({ where: {id_client: old_id_client, id_article: old_id_article}})
      
      //console.error("Erreur Sequelize lors de la mise à jour:", error)
      
      //console.error("Type d'erreur Sequelize:", error.name || 'Inconnu');

      return res.status(400).render("emprunts/edit-emprunt", {
        title: "Modifier un emprunt",
        emprunt: emprunt || {id_client: old_id_client, id_article: old_id_article},
        clients,
        articles,
        errors: { general: error.message},
        oldInput: req.body
      })
      
      //res.status(404).send("Erreur mise à jour: "+ error.message);
    }
}

export const getAllEmprunts = async (req, res) => {
  try {
    const emprunts = await Emprunt.findAll();
    res.json(emprunts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmpruntsByClient = async (req, res) => {
  try {
    const emprunts = await Emprunt.findAll({
      where: { id_client: req.params.id_client },
    });
    res.json(emprunts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmpruntsByArticle = async (req, res) => {
  try {
    const emprunts = await Emprunt.findAll({
      where: { id_article: req.params.id_article },
    });
    res.json(emprunts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
