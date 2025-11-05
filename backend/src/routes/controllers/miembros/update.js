const { Miembro, Membresia, TipoMembresia } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { dni } = req.params;
    const data = req.body;

    // ✅ Validar parámetro obligatorio
    if (!dni) {
      return res.status(400).json({ error: 'Debe especificar el DNI del miembro a actualizar' });
    }

    // 🔎 Buscar miembro existente
    const miembro = await Miembro.findOne({ where: { dni } });
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }

    // 🔹 Validar tipo de membresía si se envía
    if (data.tipo) {
      const tipoMembresia = await TipoMembresia.findByPk(data.tipo);
      if (!tipoMembresia) {
        return res.status(400).json({ error: 'Tipo de membresía inválido' });
      }
    }

    // ⚙️ Actualizar datos del miembro
    await miembro.update({
      nombre: data.nombre ?? miembro.nombre,
      apellido: data.apellido ?? miembro.apellido,
      telefono: data.telefono ?? miembro.telefono,
      email: data.email ?? miembro.email,
      fecha_nacimiento: data.fecha_nacimiento ?? miembro.fecha_nacimiento,
      fecha_registro: data.fecha_registro ?? miembro.fecha_registro,
      activo: data.activo ?? miembro.activo,
      metodo_identificacion: Array.isArray(data.metodo_identificacion)
        ? data.metodo_identificacion[0]
        : data.metodo_identificacion ?? miembro.metodo_identificacion,
      codigo_barra: data.codigo_barra ?? miembro.codigo_barra,
      huella_digital: data.huella_digital ?? miembro.huella_digital,
      foto: data.foto ?? miembro.foto
    });

    // 🔄 Actualizar o crear membresía
    if (data.tipo) {
      const membresiaExistente = await Membresia.findOne({ where: { id_miembro: miembro.id } });

      if (membresiaExistente) {
        await membresiaExistente.update({
          id_tipo: data.tipo,
          fecha_inicio: data.fecha_registro ?? membresiaExistente.fecha_inicio,
          fecha_fin: new Date(new Date(data.fecha_registro || membresiaExistente.fecha_inicio).getTime() + 30 * 24 * 60 * 60 * 1000),
          estado: data.estado ?? membresiaExistente.estado
        });
      } else {
        await Membresia.create({
          id_miembro: miembro.id,
          id_tipo: data.tipo,
          fecha_inicio: data.fecha_registro || new Date(),
          fecha_fin: new Date(new Date(data.fecha_registro || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000),
          estado: data.estado || 'activa'
        });
      }
    }

    // ✅ Respuesta exitosa
    res.status(200).json({
      message: 'Miembro actualizado correctamente',
      miembro
    });

  } catch (error) {
    console.error('Error al actualizar miembro:', error);

    // ⚠️ Errores comunes de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const detalles = error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Error de validación', detalles });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Error de integridad referencial en la base de datos' });
    }

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ error: 'Error en la base de datos', detalles: error.message });
    }

    // 🧱 Error genérico
    res.status(500).json({ error: 'No se pudo actualizar el miembro', detalles: error.message });
  }
};
