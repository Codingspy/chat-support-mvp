<template>
  <div>
    <h2>Agent Dashboard</h2>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.ticketId">
        {{ ticket.ticketId }} - {{ ticket.user }} - {{ ticket.status }}
        <button @click="closeTicket(ticket.ticketId)" v-if="ticket.status === 'open'">Close</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VUE_APP_API_URL
const tickets = ref([])

const loadTickets = async () => {
  const res = await axios.get(`${apiUrl}/tickets`)
  tickets.value = res.data
}

const closeTicket = async (ticketId) => {
  await axios.post(`${apiUrl}/tickets/${ticketId}/close`)
  loadTickets()
}

onMounted(() => {
  loadTickets()
})
</script>
