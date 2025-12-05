import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Article = database.define('Article', {
    id_article: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement:true},
    titre: {type: DataTypes.STRING, allowNull:false, unique: true},
    date_publication: DataTypes.DATEONLY,
    status : {type : DataTypes.STRING, allowNull:false},
    quantite : {type : DataTypes.INTEGER, allowNull: false},
    id_auteur : {type: DataTypes.INTEGER, allowNull:false},
    id_categorie : {type:DataTypes.INTEGER, allowNull:false},
    id_employe : {type: DataTypes.INTEGER, allowNull:false}
}, {
    timestamps:false
});

export default Article