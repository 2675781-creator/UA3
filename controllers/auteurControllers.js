import Auteur from "../modeles/Auteur.js";

// Lecture de la liste des auteurs
export async function getAllAuteur(req, res) {
  try {
    const auteurs = await Auteur.findAll();
    res.status(200).json({ message: "Liste de tous les auteurs", data: auteurs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Création d'un auteur
export const addAuteur = async (req, res) => {
  const newAuteur = req.body;
  try {
    const auteur = await Auteur.create(newAuteur);
    res.status(201).json({ message: "Auteur ajouté avec succès", data: auteur });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Suppression d'un auteur
export const deleteAuteur = async (req, res) => {
  const { id_auteur } = req.params;

  if (!id_auteur) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'auteur est requis" });
  }

  try {
    const nbDeleted = await Auteur.destroy({ where: { id_auteur } });

    if (nbDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Aucun auteur trouvé avec l'id ${id_auteur}` });
    }

    res
      .status(200)
      .json({ message: `L'auteur ${id_auteur} a été supprimé avec succès` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Voir le profil d'un auteur par son numéro
export const getAuteurProfile = async (req, res) => {
  const { id_auteur } = req.params;

  try {
    const auteur = await Auteur.findByPk(id_auteur);

    if (!auteur) {
      return res
        .status(404)
        .json({ message: `Aucun auteur trouvé avec l'id ${id_auteur}` });
    }

    res.status(200).json({ message: "Profil d'un auteur", data: auteur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour d'un auteur
export const updateAuteur = async (req, res) => {
  const { id_auteur } = req.params;
  const updatedAuteur = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    age: req.body.age,
    nationalite: req.body.nationalite,
    langue: req.body.langue,
  };

  if (!id_auteur) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'auteur est requis" });
  }

  try {
    const [nbUpdated] = await Auteur.update(updatedAuteur, {
      where: { id_auteur },
    });

    if (nbUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Aucun auteur trouvé avec l'id ${id_auteur}` });
    }

    const auteur = await Auteur.findByPk(id_auteur);
    res.status(200).json({
      message: `Auteur ${id_auteur} mis à jour avec succès`,
      data: auteur,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
