import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Client = database.define('Client', {
    id_client: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement:true},
    nom: {type: DataTypes.STRING, allowNull: false},
    prenom: {type: DataTypes.STRING, allowNull: false},
    article_prefere: {type: DataTypes.STRING, allowNull:false},
    numero_article: {type: DataTypes.INTEGER, allowNull:false}
},
{
    timestamps:false
}
)

export default Client