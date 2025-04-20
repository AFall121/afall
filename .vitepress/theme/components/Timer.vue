<script setup lang="ts">
import { ref,onMounted} from 'vue'
    const currentDateTime = ref(formatDate(new Date()))
    function formatDate(date){
        const YY = date.getFullYear()
        const MM = String(date.getMonth()+1).padStart(2,'0')
        const DD = String(date.getDate()).padStart(2,'0')
        const hh = String(date.getHours()).padStart(2,'0')
        const mm = String(date.getMinutes()).padStart(2,'0')
        const ss = String(date.getSeconds()).padStart(2,'0')
        return `${YY}/${MM}/${DD} ${hh}:${mm}:${ss}`
    }

    onMounted(()=>{
        setInterval(()=>{
            currentDateTime.value = formatDate(new Date())
        },1000)
    });
</script>

<template>
    <div class="clock">{{ currentDateTime }}</div>
</template>

<style>

</style>