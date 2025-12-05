import Article from "../modeles/Article.js";
import Auteur from "../modeles/Auteur.js";
import Categorie from "../modeles/Categorie.js";
import Employe from "../modeles/Employe.js";

// Liste
export async function afficherListeArticles(req, res, next) {
  try {
    const articles = await Article.findAll();
    res.render("articles/list-article", {
      title: "Liste des articles",
      articles,
    });
  } catch (error) {
    next(error);
  }
}

// Profil (page détail)
export async function afficherProfilArticle(req, res, next) {
  try {
    const { id_article } = req.params;
    const article = await Article.findByPk(id_article);

    if (!article) {
      return res
        .status(404)
        .render("404", { title: "Article non trouvé" });
    }

    res.render("articles/profile-article", {
      title: `Fiche de l'article : ${article.titre}`,
      article,
    });
  } catch (error) {
    next(error);
  }
}

// Formulaire d'édition
export async function afficherFormEditArticle(req, res, next) {
  try {
    const { id_article } = req.params;
    const article = await Article.findByPk(id_article);

    if (!article) {
      return res
        .status(404)
        .render("404", { title: "Article non trouvé" });
    }

    res.render("articles/edit-article", {
      title: `Modifier : ${article.titre}`,
      article,
    });
  } catch (error) {
    next(error);
  }
}

// Suppression (appelée par le <form> POST)
export async function supprimerArticleDepuisPage(req, res, next) {
  try {
    const { id_article } = req.params;
    await Article.destroy({ where: { id_article } });

    // Après suppression, on revient à la liste
    res.redirect("/articles");
  } catch (error) {
    next(error);
  }
}

// Mise à jour (appelée par le <form> POST de edit-article.ejs)
export async function mettreAJourArticleDepuisPage(req, res, next) {
  try {
    const { id_article } = req.params;
    const { titre, status, date_publication, quantite } = req.body;

    console.log("Mise à jour article", id_article, "avec", req.body);

    await Article.update(
      {
        titre,
        status,
        // adapte ce nom si ta colonne s'appelle autrement dans le modèle
        date_publication,
        quantite,
      },
      {
        where: { id_article },
      }
    );

    // Après la sauvegarde, on revient sur la fiche de l'article
    res.redirect(`/articles/${id_article}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article :", error);
    next(error);
  }
}

// Formulaire de création
export async function afficherFormNewArticle(req, res, next) {
  try {
    // Récupérer les listes pour alimenter les <select>
    const [auteurs, categories, employes] = await Promise.all([
      Auteur.findAll(),
      Categorie.findAll(),
      Employe.findAll(),
    ]);

    res.render("articles/add-article", {
      title: "Nouvel article",
      auteurs,
      categories,
      employes,
    });
  } catch (error) {
    next(error);
  }
}

export async function creerArticleDepuisPage(req, res, next) {
  try {
    const {
      titre,
      status,
      date_publication,
      quantite,
      id_auteur,
      id_categorie,
      id_employe,
    } = req.body;

    const nouvelArticle = await Article.create({
      titre,
      status,
      date_publication,
      quantite: Number(quantite),
      id_auteur: Number(id_auteur),
      id_categorie: Number(id_categorie),
      id_employe: Number(id_employe),
    });

    res.redirect(`/articles/${nouvelArticle.id_article}`);
  } catch (error) {
    // Cas typique de doublon sur un champ unique
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).render("articles/add-article", {
        title: "Nouvel article",
        erreur: "Un article avec ce titre existe déjà.",
        // il faut renvoyer les listes si tu les utilises :
        auteurs: req.auteurs || [],
        categories: req.categories || [],
        employes: req.employes || [],
      });
    }

    next(error);
  }
}