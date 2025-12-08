import { title } from "process";
import Employe from "../modeles/Employe.js";

// Lecture de la liste des employes
export async function getAllEmploye(req, res) {
  try {
    const employes = await Employe.findAll();
    //res.status(200).json({ message: "liste de tous les employes", data: employes });
    return res.render("employes/list-employe", {
      employes,
      title: "Liste des employés",
      errors: []
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// formulaire pour ajouter un employe
export const addEmployeForm = async (req, res) =>{
  try{
    return res.render("employes/add-employe", {
      errors: [],
      oldInput: {},
      title: "Ajouter un employé"
    })
  }
  catch(error){
    res.json({message:error.message})
  }
}


// formulaire pour ajouter un employe
export const editEmployeForm = async (req, res) =>{
  const { id_employe } = req.params;
  try{
    const employe = await Employe.findByPk(req.params.id_employe);
  
    if (!employe) {
      return res.status(404).render("employes/list-employe", {
        errors: [{ msg: `Aucun employe trouvé avec cette l'id ${id_employe}` }],
        employes: await Employe.findAll(),
        title: "Liste des employes"
      })
    }
    return res.render("employes/edit-employe", {
      employeData: employe,
      title: "Modifier un employe",
      errors: {},
      oldData: {}
    })
  }
  catch(error){
    res.status(500).render("employes/list-employe", {
      errors: [{msg: error.message}],
      employes: await Employe.findAll(),
      title: "Liste des employés"
    })
    //res.json({message:error.message})
  }
}


// Création d'un employe
export const addEmploye = async (req, res) => {
  const newEmploye = req.body;
  try {
    // Vérifier si un employe avec le même nom existe déjà
    const existing = await Employe.findOne({ where: { nom: newEmploye.nom } });
    if (existing) {
      return res.status(400).render("employes/add-employe", {
        errors: [{ msg: "Un employe avec ce nom existe déjà."}],
        oldInput: req.body,
        title: "Ajouter un employe"
      })
      /*return res.status(400).json({
        message: "Un employé avec ce nom existe déjà.",
      });*/
    }
    await Employe.create(newEmploye);
    //console.log("nouvel employé reçu :", newEmploye)
    return res.redirect("/employes")
    //res.status(201).json({ message: "Employe ajouté avec succès", data: employe });
  } catch (error) {
    return res.status(500).render("employes/add-employe", {
      errors: [{ msg: error.message}],
      oldInput: req.body,
      title: "Ajouter un employe"
    })
    //res.status(400).json({ message: error.message });
  }
};

// Suppression d'un employe
export const deleteEmploye = async (req, res) => {
  const { id_employe } = req.params;

  if (!id_employe) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'employe est requis" });
  }

  try {
    const nbDeleted = await Employe.destroy({ where: { id_employe } });

    if (nbDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Aucun employe trouvé avec l'id ${id_employe}` });
    }
    return res.redirect("/employes")
    /*res
      .status(200)
      .json({ message: `L'employe ${id_employe} a été supprimé avec succès` });*/
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Voir le profil d'un employe par son numéro
export const getEmployeProfile = async (req, res) => {
  const { id_employe } = req.params;

  try {
    const employe = await Employe.findByPk(id_employe);

    if (!employe) {
      return res.status(404).render("employes/list-employe", {
        errors: [{msg: "Aucun employe trouvé"}],
        employes: await Employe.findAll(),
        title: "Liste des employes"
      })
      //return res
        //.status(404)
        //.json({ message: `Aucun employe trouvé avec l'id ${id_employe}` });
    }
    return res.render("employes/profil-employe", {
      employeData: employe,
      title: "Profil de l'employe",
      errors: []
    })
    //res.status(200).json({ message: "Profil d'un employe", data: employe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour d'un employe
export const updateEmploye = async (req, res) => {
  const { id_employe } = req.params;
  const {nom, prenom, age, role, date_embauche, numero_tache} = req.body;

  let errors = {};
  if (!nom || nom.trim() === "") errors.nom = "Le nom est obligatoire";
  if (!prenom || prenom.trim() === "") errors.prenom = "Le prénom est obligatoire";

  if(Object.keys(errors).length >0){
    try{
      const employe = {id_employe, ...req.body}
      
      return res.render("employes/edit-employe", {
        title: "Modifier un employe",
        employeData: employe,
        errors,
        oldData: req.body
      });
    }catch (error) {
      return res.status(500).send("Erreur lors du chargement du formulaire : "+error.message);
    }
  }
  try {
    const updatedEmploye = {
      nom,
      prenom,
      age,
      role,
      date_embauche,
      numero_tache
    };
  
    const [nbUpdated] = await Employe.update(updatedEmploye, {
      where: { id_employe },
    });

    if (nbUpdated === 0) {
      return res.status(404).render("employes/list-employe", {
        errors: [{msg: "Aucun employe trouvé pour la mise à jour"}],
        employes: await Employe.findAll(),
        title: "Liste des employes"
      });
      //return res
       // .status(404)
       // .json({ message: `Aucun employe trouvé avec l'id ${id_employe}` });
    }

    res.redirect("/employes")
    /*res.status(200).json({
      message: `Employe ${id_employe} mis à jour avec succès`,
      data: employe,
    });*/
  } catch (error) {
    try{
      return res.status(500).render("employes/edit-employe", {
        title: "Modifier un employe",
        employeData: {id_employe, ...req.body},
        errors: {general: "Erreur base de données: "+error.message},
        oldData: req.body
      })
    }catch(err){
      return res.status(500).send("Erreur critique : "+ err.message );
    }    
  }
};
