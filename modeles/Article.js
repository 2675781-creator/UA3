import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Article = database.define('Article', {
    id_article: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement:true}, //J'ai enlevé unique: true, car 'id_article' est une clé primaire et unique: true est redondant
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