<template>
  <BaseCard>
    <template #header><h2>CU-06B — Ingreso a Clase</h2></template>

    <form class="row" @submit.prevent="onRegister">
      <!-- Buscar miembro -->
      <div style="flex:1">
        <label>Buscar Miembro (DNI / Nombre / Apellido)</label>
        <input v-model="qMember" @input="searchMember" type="text" placeholder="Buscar..." />
        <ul v-if="resultsMember.length" style="max-height:150px;overflow:auto;margin:6px 0;padding:6px;border:1px solid #eee">
          <li v-for="r in resultsMember" :key="r.id" style="padding:6px;cursor:pointer" @click="selectMember(r)">
            {{ r.dni }} — {{ r.nombre }} {{ r.apellido }}
          </li>
        </ul>
      </div>

      <!-- Buscar clase -->
      <div style="flex:1">
        <label>Seleccionar Clase</label>
        <select v-model="selectedClass">
          <option disabled value="">Seleccione una clase</option>
          <option v-for="c in classes" :key="c.id" :value="c">
            {{ c.nombre }} ({{ c.hora_inicio }})
          </option>
        </select>
      </div>

      <!-- Miembro seleccionado -->
      <div style="flex:1">
        <label>Miembro seleccionado</label>
        <div v-if="selectedMember" style="display:flex;align-items:center;gap:8px">
          <button title="Deseleccionar" class="btn ghost" style="padding:6px 8px;min-width:32px" @click="deselectMember">✕</button>
          <div>{{ selectedMember.dni }} — {{ selectedMember.nombre }} {{ selectedMember.apellido }}</div>
        </div>
        <div v-else style="color:#666">Ninguno</div>
      </div>
    </form>

    <template #footer>
      <button class="btn primary" @click="onRegister">Registrar ingreso</button>
      <button class="btn" @click="exportCsv">Exportar CSV</button>
    </template>
  </BaseCard>

  <!-- Listado de ingresos -->
  <BaseCard>
    <template #header><h3>Ingresos a Clases Recientes</h3></template>
    <table class="table">
      <thead>
        <tr>
          <th>Fecha y hora</th>
          <th>Miembro</th>
          <th>DNI</th>
          <th>Clase</th>
          <th>Hora inicio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!items.length">
          <td colspan="5" style="text-align:center;color:var(--muted)">No hay ingresos registrados</td>
        </tr>
        <tr v-else v-for="i in items" :key="i.id">
          <td>{{ formatDate(i.fecha_hora) }}</td>
          <td>{{ i.miembro?.nombre }} {{ i.miembro?.apellido }}</td>
          <td>{{ i.miembro?.dni }}</td>
          <td>{{ i.clase?.nombre }}</td>
          <td>{{ i.clase?.hora_inicio }}</td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import BaseCard from '../components/ui/BaseCard.vue'
import * as api from '../services/attendance_class.js'

const qMember = ref('')
const resultsMember = ref([])
const selectedMember = ref(null)
const selectedClass = ref('')
const items = ref([])
const classes = ref([])

onMounted(async () => {
  await fetchItems()
  await fetchClasses()
})

async function fetchItems() {
  items.value = await api.listAll()
}

async function fetchClasses() {
  const cApi = await import('../services/classes.js')
  classes.value = await cApi.listAll()
}

// Buscar miembros
let searchTimeout = null
async function searchMember() {
  clearTimeout(searchTimeout)
  if (!qMember.value || qMember.value.length < 2) {
    resultsMember.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    const membersApi = await import('../services/members.js')
    const members = await membersApi.listAll({ q: qMember.value })
    const term = qMember.value.toLowerCase()
    resultsMember.value = members.filter(m => {
      const haystack = [m.dni, m.nombre, m.apellido].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, 300)
}

function selectMember(m) {
  selectedMember.value = m
  resultsMember.value = []
  qMember.value = ''
}

function deselectMember() {
  selectedMember.value = null
}

// Registrar ingreso con SweetAlert2
async function onRegister() {
  if (!selectedMember.value) {
    return Swal.fire('Atención', 'Seleccione un miembro antes de registrar el ingreso.', 'warning')
  }
  if (!selectedClass.value) {
    return Swal.fire('Atención', 'Seleccione una clase antes de registrar el ingreso.', 'warning')
  }

  const confirm = await Swal.fire({
    title: 'Confirmar registro',
    text: `¿Registrar ingreso de ${selectedMember.value.nombre} ${selectedMember.value.apellido} a la clase ${selectedClass.value.nombre}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'Cancelar',
  })

  if (!confirm.isConfirmed) return

  const payload = {
    id_miembro: selectedMember.value.id,
    id_clase: selectedClass.value.id
  }

  try {
    const r = await api.createOne(payload)
    items.value.unshift(r.ingreso || r)
    selectedMember.value = null
    selectedClass.value = ''
    Swal.fire('Éxito', 'Ingreso registrado correctamente.', 'success')
  } catch (e) {
    console.error(e)
    Swal.fire('Error', e?.response?.data?.error || e.message, 'error')
  }
}

// Exportar CSV
function exportCsv() {
  const rows = [
    ['fecha_hora', 'miembro', 'dni', 'clase', 'hora_inicio'],
    ...items.value.map(i => [
      i.fecha_hora,
      `${i.miembro?.nombre || ''} ${i.miembro?.apellido || ''}`,
      i.miembro?.dni || '',
      i.clase?.nombre || '',
      i.clase?.hora_inicio || ''
    ])
  ]
  const csv = rows.map(r => r.map(x => `"${String(x).replaceAll('"','""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: 'ingresos_clases.csv' })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt)) return '—'
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = dt.getFullYear()
  const hh = String(dt.getHours()).padStart(2, '0')
  const min = String(dt.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}
</script>
