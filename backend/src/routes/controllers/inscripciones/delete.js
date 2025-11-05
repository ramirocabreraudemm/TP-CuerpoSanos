const { Inscripcion, Miembro } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni_miembro, id_clase } = req.params;

    // Buscar miembro por DNI
    const miembro = await Miembro.findOne({ where: { dni: dni_miembro } });
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado con ese DNI' });
    }

    // Buscar inscripción
    const inscripcion = await Inscripcion.findOne({
      where: { id_miembro: miembro.id, id_clase }
    });
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada para este miembro y clase' });
    }

    await inscripcion.destroy();
    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'No se pudo eliminar la inscripción' });
  }
};
