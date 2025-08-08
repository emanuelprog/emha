<template>
  <q-layout view="hhh lpR fFf">
    <AppNavbar />
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import AppFooter from 'src/components/AppFooter.vue';
import AppNavbar from 'src/components/AppNavbar.vue';
</script>

<style scoped>
.q-page-container {
  padding-bottom: 0 !important;
}
</style>
