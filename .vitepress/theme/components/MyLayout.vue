<script setup lang="ts">
import Layout from 'vitepress/dist/client/theme-default/Layout.vue'
import Timer from './Timer.vue'
</script>

<template>
<Layout class="pointer">
    <template #nav-bar-content-after>
        <Timer />
    </template>
</Layout>
</template>

<style scoped>
.pointer {
    cursor: pointer;
}
</style>