import Article from "../modeles/Article.js";

// Lecture de la liste des articles
export async function getAllArticle(req, res) {
  try {
    const articles = await Article.findAll();
    res.status(200).json({ message: "Liste de tous les articles", data: articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Création d'un article
export const addArticle = async (req, res) => {
  const newArticle = req.body;

  try {
    // Vérifier si un article avec le même titre existe déjà
    const existing = await Article.findOne({ where: { titre: newArticle.titre } });
    if (existing) {
      return res.status(400).json({
        message: "Un article avec ce titre existe déjà.",
      });
    }

    const article = await Article.create(newArticle);
    res.status(201).json({
      message: "Article ajouté avec succès",
      data: article,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Un article avec ce titre existe déjà.",
      });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Suppression d'un article
export const deleteArticle = async (req, res) => {
  const { id_article } = req.params;

  if (!id_article) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'article est requis" });
  }

  try {
    const nbDeleted = await Article.destroy({ where: { id_article } });

    if (nbDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Aucun article trouvé avec l'id ${id_article}` });
    }

    res
      .status(200)
      .json({ message: `L'article ${id_article} a été supprimé avec succès` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Voir le profil d'un article par son numéro
export const getArticleProfile = async (req, res) => {
  const { id_article } = req.params;

  try {
    const article = await Article.findByPk(id_article);

    if (!article) {
      return res
        .status(404)
        .json({ message: `Aucun article trouvé avec l'id ${id_article}` });
    }

    res.status(200).json({ message: "Profil d'un article", data: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour d'un article
export const updateArticle = async (req, res) => {
  const { id_article } = req.params;
  const updatedArticle = {
    titre: req.body.titre,
    date_publication: req.body.date_publication,
    status: req.body.status,
    quantite: req.body.quantite,
    id_auteur: req.body.id_auteur,
    id_categorie: req.body.id_categorie,
    id_employe: req.body.id_employe,
  };

  if (!id_article) {
    return res
      .status(400)
      .json({ error: true, message: "L'id de l'article est requis" });
  }

  try {
    const [nbUpdated] = await Article.update(updatedArticle, {
      where: { id_article },
    });

    if (nbUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Aucun article trouvé avec l'id ${id_article}` });
    }

    const article = await Article.findByPk(id_article);
    res.status(200).json({
      message: `Article ${id_article} mis à jour avec succès`,
      data: article,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
