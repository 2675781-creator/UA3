import Auteur from "./Auteur.js";
import Article from "./Article.js";
import Categorie from "./Categorie.js";
import Client from "./Client.js";
import Employe from "./Employe.js";
import Emprunt from "./Emprunt.js";
import "./User.js";


// un auteur a plusieurs articles
Auteur.hasMany(Article, { foreignKey: 'id_auteur' });
Article.belongsTo(Auteur, { foreignKey: 'id_auteur' });

// une catégorie a plusieurs articles
Categorie.hasMany(Article, { foreignKey: 'id_categorie' });
Article.belongsTo(Categorie, { foreignKey: 'id_categorie' });

// un employé gère plusieurs articles
Employe.hasMany(Article, { foreignKey: 'id_employe' });
Article.belongsTo(Employe, { foreignKey: 'id_employe' });

// plusieurs emprunts appartiennent à un client
Client.hasMany(Emprunt, { foreignKey: 'id_client' });
Emprunt.belongsTo(Client, { foreignKey: 'id_client' });

// plusieurs emprunts pour un article
Article.hasMany(Emprunt, { foreignKey: 'id_article' });
Emprunt.belongsTo(Article, { foreignKey: 'id_article' });

export { Auteur, Article, Categorie, Client, Employe, Emprunt };
