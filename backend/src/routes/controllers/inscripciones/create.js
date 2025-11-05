const { Inscripcion, Miembro, Clase } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id_miembro, id_clase, fecha_inscripcion } = req.body;

    if (!id_miembro || !id_clase) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: id_miembro o id_clase' });
    }

    // Verificar existencia
    const miembro = await Miembro.findByPk(id_miembro);
    const clase = await Clase.findByPk(id_clase);

    if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    // Verificar duplicado
    const existente = await Inscripcion.findOne({ where: { id_miembro, id_clase } });
    if (existente) {
      return res.status(409).json({ error: 'El miembro ya está inscripto en esta clase' });
    }

    // Verificar cupo
    const cantidadInscriptos = await Inscripcion.count({ where: { id_clase } });
    if (cantidadInscriptos >= clase.cupo_maximo) {
      return res.status(400).json({ error: 'No hay cupos disponibles en esta clase' });
    }

    const inscripcion = await Inscripcion.create({
      id_miembro,
      id_clase,
      fecha_inscripcion: fecha_inscripcion || new Date()
    });

    res.status(201).json({
      message: 'Inscripción creada exitosamente',
      inscripcion
    });
  } catch (error) {
    console.error('Error al crear inscripción:', error);
    res.status(500).json({ error: 'No se pudo registrar la inscripción' });
  }
};
