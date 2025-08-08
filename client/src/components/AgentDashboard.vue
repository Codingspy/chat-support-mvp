<template>
  <div>
    <h2>Agent Dashboard</h2>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.ticketId">
        {{ ticket.ticketId }} - {{ ticket.user }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VUE_APP_API_URL
const tickets = ref([])

onMounted(async () => {
  const res = await axios.get(`${apiUrl}/tickets`)
  tickets.value = res.data
})
</script>
