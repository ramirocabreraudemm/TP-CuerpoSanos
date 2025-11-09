<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-07 — Registrar Pago</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>ID Miembro</label><input v-model="form.memberId" type="text" placeholder="uuid o DNI" /></div>
        <div><label>Tipo</label><select v-model="form.tipo"><option>Membresia</option><option>Clase</option></select></div>
        <div><label>Método</label><select v-model="form.metodo"><option>Efectivo</option><option>MP</option><option>Tarjeta</option></select></div>
        <div><label>Monto</label><input v-model.number="form.monto" type="number" min="0" step="0.01" /></div>
        <div><label>Fecha</label><input v-model="form.fecha" type="date" /></div>
        <div><label>Observaciones</label><input v-model="form.observaciones" type="text" /></div>
      </form>
      <template #footer><button class="btn primary" @click="onSave">Guardar pago</button></template>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h3>Pagos</h3>
        <div class="inline">
          <input v-model="filters.q" type="text" placeholder="Buscar..." @input="fetch" />
          <button class="btn" @click="fetch">Actualizar</button>
        </div>
      </template>
      <table class="table">
        <thead><tr><th>Fecha</th><th>Miembro</th><th>Tipo</th><th>Método</th><th>Monto</th></tr></thead>
        <tbody><tr v-for="p in items" :key="p.id"><td>{{ p.fecha }}</td><td>{{ p.memberId }}</td><td>{{ p.tipo }}</td><td>{{ p.metodo }}</td><td>{{ p.monto }}</td></tr></tbody>
      </table>
    </BaseCard>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import * as api from '../services/payments.js'
const form = reactive({ memberId:'', tipo:'Membresia', metodo:'Efectivo', monto:0, fecha:new Date().toISOString().slice(0,10), observaciones:'' })
const items = ref([])
const filters = reactive({ q:'' })
async function fetch(){ items.value = await api.listAll(filters) }
async function onSave(){ const r = await api.createOne({ ...form }); items.value.unshift(r) }
onMounted(fetch)
</script>
