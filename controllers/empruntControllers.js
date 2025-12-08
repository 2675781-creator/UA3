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
    const {id_client, id_article} = req.params;
    const updatedEmprunt = req.body;
    
    if (!id_client || !id_article){
        //return res.status(400).json({error:true, message: "L'id du client et l'id de l'article est requis"});
        return res.redirect("/emprunts");
    }
    try {
        const [result] = await Emprunt.update(updatedEmprunt, {
            where : {id_client, id_article}
        });
        res.redirect("/emprunts")
        //res.status(200).json({message: "Emprunt mis a jour",result});
    }
    catch(error){
        res.status(404).send("Erreur mise à jour: "+ error.message);
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
