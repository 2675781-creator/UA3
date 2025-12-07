import Employe from "../modeles/Employe.js";

// Lecture de la liste des employes
export async function getAllEmploye(req, res) {
  try {
    const employes = await Employe.findAll();
    //res.status(200).json({ message: "liste de tous les employes", data: employes });
    res.render("./employes/list-employe", {employes})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// formulaire pour ajouter un employe
export const addEmployeForm = async (req, res) =>{
  try{
    return res.render("./employes/add-employe", {
      errors: [],
      oldInput: {}
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
    const employe = await employe.findByPk(id_employe);
  
    if (!employe) {
      return res.status(404).render("./employes/list-employe", {
        errors: [{ msg: `Aucun employe trouvé avec cette l'id ${id_employe}` }],
        employes: await Employe.findAll()
      })
    }
    return res.render("./employes/edit-employe", {
      employe,
      errors: [],
      oldInput: {}
    })
  }
  catch(error){
    res.status(500).render("./employes/list-employe", {
      errors: [{msg: error.message}],
      employes: await Employe.findAll()
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
      return res.status(400).render("./employes/add-employe", {
        errors: [{ msg: "Un employe avec ce nom existe déjà."}],
        oldInput: req.body
      })
      /*return res.status(400).json({
        message: "Un employé avec ce nom existe déjà.",
      });*/
    }
    await Employe.create(newEmploye);
    console.log("nouvel employé reçu :", newEmploye)
    return res.redirect("/employes")
    //res.status(201).json({ message: "Employe ajouté avec succès", data: employe });
  } catch (error) {
    return res.status(500).render("./employes/add-employe", {
      errors: [{ msg: error.message}],
      oldInput: req.body
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
      return res
        .status(404)
        .json({ message: `Aucun employe trouvé avec l'id ${id_employe}` });
    }
    return res.render("./employes/profile-employe", {employe})
    //res.status(200).json({ message: "Profil d'un employe", data: employe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour d'un employe
export const updateEmploye = async (req, res) => {
  const { id_employe } = req.params;
  const updatedEmploye = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    age: req.body.age,
    role: req.body.role,
    date_embauche: req.body.date_embauche,
    numero_tache: req.body.numero_tache,
  };

  if (!id_employe) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'employe est requis" });
  }

  try {
    const [nbUpdated] = await Employe.update(updatedEmploye, {
      where: { id_employe },
    });

    if (nbUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Aucun employe trouvé avec l'id ${id_employe}` });
    }

    res.redirect("/employes")
    /*res.status(200).json({
      message: `Employe ${id_employe} mis à jour avec succès`,
      data: employe,
    });*/
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
