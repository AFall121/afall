<script setup lang="ts">
import Layout from 'vitepress/dist/client/theme-default/Layout.vue'
import Timer from './Timer.vue'
import Star from './Star.vue'
</script>

<template>
<Layout class="pointer">
    <template #nav-bar-content-after>
        <Timer />
    </template>
    <!-- 这里的插槽语法 只能用在template元素上,直接用在Star上不起作用 -->
    <template #layout-bottom>
        <Star />
    </template>
</Layout>
</template>

<style scoped>
.pointer { 
    /* 这里必须加上回退值pointer,否则前面的url无法正常加载指针样式,ai也不懂... */
    cursor: url('../imgs/cursor.png'),pointer;
}
</style>