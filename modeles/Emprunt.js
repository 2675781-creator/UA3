import database from '../config/connection.js';
import { DataTypes} from "sequelize";


const Emprunt = database.define('Emprunt', {
    id_client: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
    id_article: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
    date_emprunt: DataTypes.DATEONLY,
    date_retour: {type: DataTypes.DATEONLY, allowNull: true}
}, {
    timestamps: false
})

export default Emprunt