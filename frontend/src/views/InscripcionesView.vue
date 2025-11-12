<template>
  <div class="grid">
    <BaseCard>
      <template #header>
        <h2>CU-07 — Inscripciones</h2>
      </template>

      <form class="row" @submit.prevent="onCreate">
        <div>
          <label>Miembro</label>
          <select v-model="form.id_miembro" required>
            <option value="">Seleccione un miembro</option>
            <option v-for="m in miembros" :key="m.id" :value="m.id">
              {{ m.nombre }} {{ m.apellido }} (DNI: {{ m.dni }})
            </option>
          </select>
        </div>

        <div>
          <label>Clase</label>
          <select v-model="form.id_clase" required>
            <option value="">Seleccione una clase</option>
            <option v-for="c in clases" :key="c.id" :value="c.id">
              {{ c.nombre }} — {{ c.dias?.join(', ') }}
            </option>
          </select>
        </div>

        <button type="submit">Inscribir</button>
      </form>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h3>Inscripciones registradas</h3>
      </template>

      <table>
        <thead>
          <tr>
            <th>Miembro</th>
            <th>Clase</th>
            <th>Fecha de inscripción</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ins in inscripciones"
            :key="`${ins.id_miembro}-${ins.id_clase}`"
          >
            <td>{{ ins.miembro }}</td>
            <td>{{ ins.clase.nombre }} ({{ ins.clase.dias?.join(', ') }})</td>
            <td>{{ ins.fecha_inscripcion }}</td>
            <td>
              <button @click="onDelete(ins)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { listAll, createOne, deleteOne, listMiembros, listClases } from '../services/inscripciones.js'

// Datos reactivos
const miembros = ref([])
const clases = ref([])
const inscripciones = ref([])
const form = ref({
  id_miembro: '',
  id_clase: ''
})

// 🔹 Cargar datos iniciales
const fetchData = async () => {
  const [m, c, i] = await Promise.all([listMiembros(), listClases(), listAll()])
  miembros.value = m
  clases.value = c
  inscripciones.value = i
}

// 🔹 Crear inscripción con SweetAlert
const onCreate = async () => {
  try {
    if (!form.value.id_miembro || !form.value.id_clase) return

    const confirm = await Swal.fire({
      title: '¿Confirmar inscripción?',
      text: 'Se agregará una nueva inscripción.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, inscribir',
      cancelButtonText: 'Cancelar'
    })

    if (!confirm.isConfirmed) return

    await createOne(form.value)
    await fetchData()

    Swal.fire({
      icon: 'success',
      title: '¡Inscripción creada!',
      text: 'La inscripción fue registrada correctamente.',
      timer: 2000,
      showConfirmButton: false
    })

    form.value.id_miembro = ''
    form.value.id_clase = ''
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo crear la inscripción.'
    })
  }
}

// 🔹 Eliminar inscripción con confirmación SweetAlert
const onDelete = async (ins) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar inscripción?',
    text: `¿Seguro que querés eliminar la inscripción de ${ins.miembro} en ${ins.clase.nombre}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    await deleteOne(`${ins.id_miembro}/${ins.id_clase}`)
    await fetchData()

    Swal.fire({
      icon: 'success',
      title: 'Inscripción eliminada',
      text: 'La inscripción fue eliminada correctamente.',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.error || 'No se pudo eliminar la inscripción.'
    })
  }
}

onMounted(fetchData)
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
