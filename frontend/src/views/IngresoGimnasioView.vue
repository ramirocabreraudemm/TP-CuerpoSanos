<template>
  <BaseCard>
    <template #header><h2>CU-06 — Ingreso Gimnasio</h2></template>
    <form class="row" @submit.prevent="onRegister">
      <div><label>Identificación</label><input v-model="identificacion" type="text" placeholder="DNI o código" required /></div>
      <div><label>Modo</label>
        <select v-model="modo">
          <option value="manual">Manual</option>
          <option value="qr">QR</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>
      <div><label>Fecha/Hora</label><input v-model="fecha" type="datetime-local" /></div>
    </form>
    <template #footer>
      <button class="btn primary" @click="onRegister">Registrar</button>
      <button class="btn" @click="exportCsv">Exportar CSV</button>
    </template>
  </BaseCard>

  <BaseCard>
    <template #header><h3>Ingresos recientes</h3></template>
    <table class="table">
      <thead><tr><th>Fecha</th><th>ID</th><th>Modo</th></tr></thead>
      <tbody>
        <tr v-for="i in items" :key="i.id">
          <td>{{ i.fecha }}</td><td>{{ i.identificacion }}</td><td>{{ i.modo }}</td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import * as api from '../services/attendance_gym.js'
const identificacion = ref('')
const modo = ref('manual')
const fecha = ref(new Date().toISOString().slice(0,16))
const items = ref([])
async function fetch(){ items.value = await api.listAll() }
onMounted(fetch)
async function onRegister(){
  const payload = { identificacion: identificacion.value, modo: modo.value, fecha: new Date().toISOString() }
  const r = await api.createOne(payload); items.value.unshift(r); identificacion.value=''
}
function exportCsv(){
  const rows = [['fecha','identificacion','modo'], ...items.value.map(i=>[i.fecha,i.identificacion,i.modo])]
  const csv = rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: 'ingresos.csv' })
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
}
</script>
