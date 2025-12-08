import Categorie from "../modeles/Categorie.js";

// Lecture de la liste des catégories
export async function getAllCategorie(req, res) {
  try {
    const categories = await Categorie.findAll();
   /* res.status(200).json({
      message: "Liste de toutes les catégories",
      data: categories,
    });*/
    return res.render('categories/list-categorie', {
      title: 'Liste des catégories',
      categories: categories
    })
  } catch (error) {
    res.status(500).send("Erreur serveur :" + error.message );
  }
}

export const addCategorieForm = async (req, res) => {

  try {
    return res.render("categories/add-categorie", {
      title: "Ajouter une catégorie",
      errors: {},
      oldInput: {}
    })
  }
  catch(error) {
    res.status(400).send("Erreur lors de l'ajout : " + error.message)
  }
}


export const deleteCategorieForm = async (req, res) => {
  const { id_categorie } =req.params
  try {
    await Categorie.destroy({
      where: { id_categorie}
    });
    res.redirect("/categories")
  }
  catch(error) {
    res.status(400).send("Erreur suppresion : " + error.message)
  }
}

export const editCategorieForm = async (req, res) => {
  const {id_categorie} =req.params
  try{

    const categorie = await Categorie.findByPk(id_categorie)

    if (!categorie) {
      res.redirect("/categories")
    }

    return res.render("categories/edit-categorie", {
      categorie: categorie,
      title: "Modifier une catégorie",
      errors: {}
    })    
  
  } catch(error){
    res.status(500).send("Erreur modification : " + error.message)
  }
}


// Création d'une catégorie
export const addCategorie = async (req, res) => {
  const newCategorie = req.body;

  try {
    const categorie = await Categorie.create(newCategorie);
    res.redirect("/categories")
    /*res.status(201).json({
      message: "Catégorie ajoutée avec succès",
      data: categorie,
    });*/
  } catch (error) {
    return res.status(400).render("categories/add-categorie", {
      title: "AJouter une catégorie",
      errors: [{msg: error.message}],
      oldInput: req.body
    })
    //res.status(400).json({ message: error.message });
  }
};

// Suppression d'une catégorie
export const deleteCategorie = async (req, res) => {
  const { id_categorie } = req.params;

  if (!id_categorie) {
    /*return res
      .status(400)
      .json({ error: true, message: "L'id de la catégorie est requis" });*/
    return res.redirect("/categories");
  }

  try {
    const nbDeleted = await Categorie.destroy({ where: { id_categorie } });

    if (nbDeleted === 0) {
      res.redirect("/categories")
      /*
      return res.status(404).json({
        message: `Aucune catégorie trouvée avec l'id ${id_categorie}`,
      });*/
    }
    return res.redirect("/categories");

    /*res.status(200).json({
      message: `La catégorie ${id_categorie} a été supprimée avec succès`,
    });*/
  } catch (error) {
    res.status(500).send("Erreur serveur : " + error.message );
  }
};

// Voir le profil d'une catégorie par son id
export const getCategorieProfile = async (req, res) => {
  const { id_categorie } = req.params;

  try {
    const categorie = await Categorie.findByPk(id_categorie);

    if (!categorie) {
      /*return res.status(404).json({
        message: `Aucune catégorie trouvée avec l'id ${id_categorie}`,
      });*/
      return res.redirect('/categories');
    }
    res.render("categories/profil-categorie", {categorie})
    /*res.status(200).json({
      message: "Profil d'une catégorie",
      data: categorie
    });*/
  } catch (error) {
    res.status(500).send("Erreur : " + error.message );
  }
};

// Mise à jour d'une catégorie
export const updateCategorie = async (req, res) => {
  const { id_categorie } = req.params;
  const updatedCategorie = req.body;

  /*if (!id_categorie) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de la catégorie est requis" });
  }*/

  try {
    const [nbUpdated] = await Categorie.update(updatedCategorie, {
      where: { id_categorie },
    });

    if (nbUpdated === 0) {
      /*return res.status(404).json({
        message: `Aucune catégorie trouvée avec l'id ${id_categorie}`,
      });*/
      return res.redirect("/categories");
    }

    //const categorie = await Categorie.findByPk(id_categorie);
    
    /*res.status(200).json({
      message: `Catégorie ${id_categorie} mise à jour avec succès`,
      data: categorie,
    });*/
    return res.redirect("/categories");
  } catch (error) {
    res.status(500).send("Erreur serveur : "+ error.message );
  }
}
