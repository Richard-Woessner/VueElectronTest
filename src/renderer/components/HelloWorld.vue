<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const docText = ref('')

const filePath = "\\\\cinfs05p.ws.wsfgrp.net\\ENTERPRISE_VOL1\\GRPS\\RPA\\RichardW\\vuetest.txt";

const loadDoc = async () => {
  

  window.electronAPI.getFile(filePath).then((doc) => {
    docText.value = doc
  });

//   console.log(doc)

//   docText.value = doc
}

onMounted(() => {
  window.electronAPI.onFileChange(filePath, (eventType, filename) => {
    if (eventType === 'change') {
      loadDoc()
    }
  })
})

// onUnmounted(() => {
//   if (cleanup) {
//     cleanup()
//   }
// })


</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="increment()">count is {{ count }}</button>
    <button type="button" @click="decrement()">-1</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
    <div class="card">
    <div>
        <button type="button" @click="loadDoc()">Load Document</button>
        <p>{{ docText }}</p>
    </div>
  </div>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
