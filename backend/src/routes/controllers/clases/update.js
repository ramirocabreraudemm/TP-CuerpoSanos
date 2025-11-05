const { Clase, ClaseDia } = require('../../../models');

module.exports = async (req, res) => {
  const t = await Clase.sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, hora_inicio, duracion_minutos, cupo_maximo, id_entrenador, dias } = req.body;

    const clase = await Clase.findByPk(id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    await clase.update(
      { nombre, hora_inicio, duracion_minutos, cupo_maximo, id_entrenador },
      { transaction: t }
    );

    // Actualizar días: borra y vuelve a crear
    if (dias && dias.length > 0) {
      await ClaseDia.destroy({ where: { id_clase: id }, transaction: t });
      const diasData = dias.map(dia => ({ id_clase: id, dia_semana: dia }));
      await ClaseDia.bulkCreate(diasData, { transaction: t });
    }

    await t.commit();

    res.json({ message: 'Clase actualizada correctamente', clase });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar clase:', error);
    res.status(500).json({ error: 'No se pudo actualizar la clase' });
  }
};
