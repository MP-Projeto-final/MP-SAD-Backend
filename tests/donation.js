// donation.js (Definição de modelo)
import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Donation = sequelize.define('Donation', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_cep: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_rua: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino_complemento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  destino_bairro: {
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
  origem_cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origem_estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  // Outras opções do modelo
  timestamps: true,  // Inclui createdAt e updatedAt por padrão
  tableName: 'donations',  // Nome da tabela no banco de dados
});

export default Donation;
