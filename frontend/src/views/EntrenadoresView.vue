<template>
  <div class="grid">
    <BaseCard>
      <template #header><h2>CU-05 — Entrenadores</h2></template>
      <form class="row" @submit.prevent="onSave">
        <div><label>Nombre</label><input v-model="form.nombre" type="text" placeholder=""/></div>
        <div><label>Email</label><input v-model="form.email" type="email" placeholder=""/></div>
        <div><label>Teléfono</label><input v-model="form.telefono" type="text" placeholder=""/></div>
        <div><label>Nacimiento</label><input v-model="form.fechaNacimiento" type="date" placeholder=""/></div>
        <div><label>Inicio</label><input v-model="form.fechaInicio" type="date" placeholder=""/></div>
        <div><label>Foto (URL)</label><input v-model="form.foto" type="text" placeholder="https://…"/></div>
      </form>
      <template #footer>
        <button class="btn primary" @click="onSave">Guardar</button>
        <button v-if="form.id" class="btn" @click="onUpdate">Modificar</button>
        <button v-if="form.id" class="btn error" @click="onDelete">Eliminar</button>
      </template>
    </BaseCard>
    <BaseCard>
      <template #header>
        <h3>Listado</h3>
        <Toolbar>
          <input v-model="q" type="text" placeholder="Buscar..." @input="fetch">
          <button class="btn" @click="clear">Limpiar</button>
          <button class="btn" @click="window.print()">Imprimir</button>
        </Toolbar>
      </template>
      <table class="table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th></tr></thead>
        <tbody>
          <tr v-for="row in items" :key="row.id" @click="fill(row)" style="cursor:pointer">
            <td>{{ row.nombre }}</td>
              <td>{{ row.email }}</td>
              <td>{{ row.telefono }}</td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import Toolbar from '../components/ui/Toolbar.vue'
import * as api from '../services/trainers.js'
const q = ref('')
const items = ref([])
const form = ref({})
async function fetch(){ items.value = await api.listAll({ q: q.value }) }
function clear(){ q.value=''; fetch() }
function fill(row){ form.value = { ...row } }
async function onSave(){ const created = await api.createOne({ ...form.value, id: undefined }); items.value.unshift(created); form.value = {} }
async function onUpdate(){ if(!form.value.id) return; const upd = await api.updateOne(form.value.id, { ...form.value }); const i = items.value.findIndex(x=>x.id===upd.id); if(i>-1) items.value[i]=upd }
async function onDelete(){ if(!form.value.id) return; await api.deleteOne(form.value.id); items.value = items.value.filter(x=>x.id!==form.value.id); form.value = {} }
onMounted(fetch)
</script>
