import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Categorie = database.define('Categorie', {
    id_categorie: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement:true},
    nom_categorie: {type: DataTypes.STRING, allowNull: false},
    description: DataTypes.STRING
}, 
{
    timestamps:false
});

export default Categorie