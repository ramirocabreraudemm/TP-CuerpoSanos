<template>
  <nav class="tabs wrap" role="tablist" aria-label="Casos de uso">
    <router-link
      v-for="r in tabs"
      :key="r.path"
      class="tab"
      :to="r.path"
      role="tab"
      :aria-selected="route.path === r.path ? 'true' : 'false'"
      :class="{ active: route.path === r.path }"
    >
      {{ r.meta.label }}
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const tabs = computed(() =>
  router.getRoutes()
    .filter(r => r.meta && r.meta.showInTabs)
    .sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999))
)
</script>
