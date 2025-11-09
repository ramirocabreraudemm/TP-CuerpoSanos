<template>
  <BaseCard>
    <template #header>
      <h2>Reporte de Ingresos</h2>
      <div class="inline">
        <label>Desde</label><input v-model="f.desde" type="date" />
        <label>Hasta</label><input v-model="f.hasta" type="date" />
        <label>Método</label>
        <select v-model="f.metodo"><option value="">Todos</option><option>Efectivo</option><option>MP</option><option>Tarjeta</option></select>
        <button class="btn" @click="fetch">Aplicar</button>
      </div>
    </template>
    <table class="table">
      <thead><tr><th>Fecha</th><th>Miembro</th><th>Método</th><th>Monto</th></tr></thead>
      <tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.fecha }}</td><td>{{ r.memberId }}</td><td>{{ r.metodo }}</td><td>{{ r.monto }}</td></tr></tbody>
      <tfoot><tr><th colspan="3" style="text-align:right">Total</th><th>{{ total }}</th></tr></tfoot>
    </table>
  </BaseCard>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { income } from '../services/reports.js'
const f = reactive({ desde:'', hasta:'', metodo:'' })
const rows = ref([])
const total = computed(()=> rows.value.reduce((a,b)=> a + (Number(b.monto)||0), 0))
async function fetch(){ rows.value = await income(f) }
</script>
