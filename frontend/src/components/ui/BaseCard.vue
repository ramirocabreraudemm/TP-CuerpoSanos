<template>
  <div class="card">
    <div v-if="$slots.header" class="hd"><slot name="header" /></div>
    <div class="bd"><slot /></div>
    <div v-if="$slots.footer" class="ft"><slot name="footer" /></div>
  </div>
</template>
<script setup></script>
