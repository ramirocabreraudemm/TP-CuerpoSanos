<template>
  <BaseCard>
    <template #header>
      <h2>Reporte de Asistencia</h2>
      <div class="inline">
        <label>Desde</label><input v-model="f.desde" type="date" />
        <label>Hasta</label><input v-model="f.hasta" type="date" />
        <label>Dimensión</label>
        <select v-model="f.dimension"><option value="miembro">Miembro</option><option value="clase">Clase</option><option value="actividad">Actividad</option></select>
        <button class="btn" @click="fetch">Aplicar</button>
      </div>
    </template>
    <table class="table">
      <thead><tr><th>Fecha</th><th>Dimensión</th><th>Identificador</th></tr></thead>
      <tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.fecha }}</td><td>{{ r.dimension }}</td><td>{{ r.identificador }}</td></tr></tbody>
    </table>
  </BaseCard>
</template>
<script setup>
import { reactive, ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { attendance } from '../services/reports.js'
const f = reactive({ desde:'', hasta:'', dimension:'miembro' })
const rows = ref([])
async function fetch(){ rows.value = await attendance(f) }
</script>
