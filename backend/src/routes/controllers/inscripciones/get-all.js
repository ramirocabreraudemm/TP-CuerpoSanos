const { Inscripcion, Miembro, Clase, ClaseDia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        {
          model: Miembro,
          as: 'miembro',
          attributes: ['nombre', 'apellido', 'dni']
        },
        {
          model: Clase,
          as: 'clase',
          attributes: ['id', 'nombre', 'hora_inicio', 'duracion_minutos'],
          include: [
            {
              model: ClaseDia,
              as: 'dias',
              attributes: ['dia_semana']
            }
          ]
        }
      ],
      order: [['fecha_inscripcion', 'DESC']]
    });

    if (!inscripciones.length) {
      return res.status(404).json({ message: 'No hay inscripciones registradas' });
    }

    // Formateo del resultado final
    const resultado = inscripciones.map(i => ({
      id_clase: i.id_clase,
      id_miembro: i.id_miembro,
      fecha_inscripcion: i.fecha_inscripcion,
      miembro: i.miembro
        ? `${i.miembro.nombre} ${i.miembro.apellido} (DNI: ${i.miembro.dni})`
        : null,
      clase: i.clase
        ? {
            id: i.clase.id,
            nombre: i.clase.nombre,
            hora_inicio: i.clase.hora_inicio,
            duracion_minutos: i.clase.duracion_minutos,
            dias: i.clase.dias?.map(d => d.dia_semana) || []
          }
        : null
    }));

    res.status(200).json(resultado);

  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    res.status(500).json({
      error: 'Error interno al obtener las inscripciones',
      detalles: error.message
    });
  }
};
