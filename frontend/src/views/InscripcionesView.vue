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
          <tr v-for="ins in inscripciones" :key="`${ins.id_miembro}-${ins.id_clase}`">
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
import { listAll, createOne, deleteOne, listMiembros, listClases } from '../services/inscripciones.js'

const miembros = ref([])
const clases = ref([])
const inscripciones = ref([])
const form = ref({
  id_miembro: '',
  id_clase: ''
})

const fetchData = async () => {
  const [m, c, i] = await Promise.all([
    listMiembros(),
    listClases(),
    listAll()
  ])
  miembros.value = m
  clases.value = c
  inscripciones.value = i
}

const onCreate = async () => {
  if (!form.value.id_miembro || !form.value.id_clase) return
  await createOne(form.value)
  await fetchData()
  form.value.id_miembro = ''
  form.value.id_clase = ''
}

const onDelete = async (ins) => {
  if (confirm('¿Eliminar inscripción?')) {
    await deleteOne(`${ins.id_miembro}/${ins.id_clase}`)
    await fetchData()
  }
}

onMounted(fetchData)
</script>
