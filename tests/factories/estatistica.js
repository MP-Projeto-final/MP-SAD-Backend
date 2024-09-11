import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; 

const Estatistica = sequelize.define('Estatistica', {
  origem_cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origem_estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_doacoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
});

export default Estatistica;
