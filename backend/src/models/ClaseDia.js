const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ClaseDia = sequelize.define('ClaseDia', {
  id_clase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  dia_semana: {
    type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'ClaseDia',
  timestamps: false
});

module.exports = ClaseDia;
