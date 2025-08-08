<template>
  <div>
    <h1>Chat Support MVP</h1>
    <div class="chat-box">
      <div v-for="msg in messages" :key="msg._id">
        <strong>{{ msg.sender }}:</strong> {{ msg.message }}
      </div>
    </div>
    <input v-model="newMessage" placeholder="Type message..." @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'
import axios from 'axios'

const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:5000'
const socket = io(apiUrl)

const messages = ref([])
const newMessage = ref('')
const sender = prompt('Enter your name (User or Agent)') || 'User'

const ticketId = ref('')

// If user, start ticket
if (sender === 'User') {
  socket.emit('start_ticket', { user: sender })
  socket.on('ticket_started', ({ ticketId: id }) => {
    ticketId.value = id
  })
} else {
  // For agent, join ticket manually for now
  ticketId.value = prompt('Enter ticket ID to join')
  socket.emit('join_ticket', { ticketId: ticketId.value })
}

socket.on('receive_message', (data) => {
  if (data.ticketId === ticketId.value) {
    messages.value.push(data)
  }
})

const sendMessage = () => {
  if (newMessage.value.trim()) {
    socket.emit('send_message', {
      sender,
      message: newMessage.value,
      ticketId: ticketId.value
    })
    newMessage.value = ''
  }
}

onMounted(async () => {
  if (ticketId.value) {
    const res = await axios.get(`${apiUrl}/messages`)
    messages.value = res.data.filter(msg => msg.ticketId === ticketId.value)
  }
})


</script>

<style>
.chat-box {
  border: 1px solid #ccc;
  height: 400px;
  overflow-y: scroll;
  padding: 10px;
}
</style>
