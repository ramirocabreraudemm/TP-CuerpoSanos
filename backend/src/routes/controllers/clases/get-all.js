// controllers/clases/getAll.js
const { Clase, ClaseDia, Entrenador } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const clases = await Clase.findAll({
      include: [
        { model: Entrenador, as: 'entrenador', attributes: ['id','nombre', 'apellido'] },
        { model: ClaseDia, as: 'dias', attributes: ['dia_semana'] }
      ],
      order: [['id', 'ASC']]
    });

    if (!clases.length) {
      return res.status(404).json({ message: 'No hay clases registradas' });
    }

    // 🔹 Formateamos los días en un array plano
    const resultado = clases.map(c => ({
      id: c.id,
      nombre: c.nombre,
      hora_inicio: c.hora_inicio,
      duracion_minutos: c.duracion_minutos,
      cupo_maximo: c.cupo_maximo,
      entrenador: `${c.entrenador.nombre} ${c.entrenador.apellido}`,
      id_entrenador: c.entrenador.id,
      dias: c.dias.map(d => d.dia_semana)
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ error: 'No se pudo cargar la lista de clases' });
  }
};
