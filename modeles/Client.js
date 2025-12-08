import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Client = database.define('Client', {
    id_client: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement:true},
    nom: {type: DataTypes.STRING, allowNull: false},
    prenom: {type: DataTypes.STRING, allowNull: false},
    article_prefere: {type: DataTypes.STRING, allowNull:false},
    id_article: {type: DataTypes.INTEGER, allowNull:false, references: {model: "Articles", key: 'id_article'}}
},
{
    timestamps:false
}
)

export default Client