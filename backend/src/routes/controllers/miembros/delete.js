const { Miembro, Membresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔎 Buscar miembro por ID
    const miembro = await Miembro.findByPk(id);
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    // 🚫 Desactivar el miembro (activo = 0)
    await miembro.update({ activo: 0 });

    // 🔄 Si tiene membresía, marcarla como cancelada
    const membresia = await Membresia.findOne({ where: { id_miembro: miembro.id } });
    if (membresia) {
      await membresia.update({ estado: 'cancelada' });
    }

    res.status(200).json({ message: 'Miembro desactivado correctamente' });

  } catch (error) {
    console.error('Error al desactivar miembro:', error);
    res.status(500).json({ error: 'No se pudo desactivar el miembro', detalles: error.message });
  }
};
