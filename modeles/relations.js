import Auteur from "./Auteur.js";
import Article from "./Article.js";
import Categorie from "./Categorie.js";
import Client from "./Client.js";
import Employe from "./Employe.js";
import Emprunt from "./Emprunt.js";
import "./User.js";

// un auteur a plusieurs articles
Auteur.hasMany(Article, {
  foreignKey: "id_auteur",
  as: "Articles",
});
Article.belongsTo(Auteur, {
  foreignKey: "id_auteur",
  as: "Auteur",
});

// une catégorie a plusieurs articles
Categorie.hasMany(Article, {
  foreignKey: "id_categorie",
  as: "Articles",
});
Article.belongsTo(Categorie, {
  foreignKey: "id_categorie",
  as: "Categorie",
});

// un employé gère plusieurs articles
Employe.hasMany(Article, {
  foreignKey: "id_employe",
  as: "ArticlesGeres",
});
Article.belongsTo(Employe, {
  foreignKey: "id_employe",
  as: "Employe",
});

// plusieurs emprunts appartiennent à un client
Client.hasMany(Emprunt, {
  foreignKey: "id_client",
  as: "Emprunts",
});
Emprunt.belongsTo(Client, {
  foreignKey: "id_client",
  as: "Client",
});

// plusieurs emprunts pour un article
Article.hasMany(Emprunt, {
  foreignKey: "id_article",
  as: "Emprunts",
});
Emprunt.belongsTo(Article, {
  foreignKey: "id_article",
  as: "Article",
});

export { Auteur, Article, Categorie, Client, Employe, Emprunt };