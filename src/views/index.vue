<template>
    <workflow />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import workflow from '@/components/workflow/index.vue'
onMounted(async () => {
    console.log("BASE_URL=======", import.meta.env.BASE_URL);
    console.log("VITE_APP_BASE_API=======", import.meta.env.VITE_APP_BASE_API);
    console.log("VITE_HOME_PATH=======", import.meta.env.VITE_HOME_PATH);
    // const mockjson = NodeUtils.createStartNode();
    // const data = FormatDisplayUtils.getToTree(mockjson.data); 
});
</script>