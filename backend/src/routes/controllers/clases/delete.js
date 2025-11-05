const { Clase, ClaseDia } = require('../../../models');

module.exports = async (req, res) => {
  const t = await Clase.sequelize.transaction();
  try {
    const { id } = req.params;
    const clase = await Clase.findByPk(id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    await ClaseDia.destroy({ where: { id_clase: id }, transaction: t });
    await clase.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar clase:', error);
    res.status(500).json({ error: 'No se pudo eliminar la clase' });
  }
};
