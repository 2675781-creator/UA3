import database from '../config/connection.js';
import { DataTypes} from "sequelize";

const Auteur = database.define('Auteur', {
    id_auteur: {type: DataTypes.INTEGER, allowNull: false, unique:true, primaryKey:true, autoIncrement:true},
    nom: {type: DataTypes.STRING, allowNull: false},
    prenom: {type: DataTypes.STRING, allowNull: false},
    age: {type: DataTypes.INTEGER, allowNull: false},
    nationalite: {type: DataTypes.STRING, allowNull: false},
    langue: {type: DataTypes.STRING, allowNull: false}
}, {
    timestamps: false
});

export default Auteur