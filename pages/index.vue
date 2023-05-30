<template>
  <div>
    <h1>Welcome to the Chat App!</h1>
    <div v-if="!joined">
      <input type="text" v-model="username" placeholder="Username" />
      <button @click="joinChatRoom">Join Chat Room</button>
    </div>
    <div v-else>
      <h2>Chat Room: {{ room }}</h2>
      <div v-for="message in messages" :key="message.id">
        <strong>{{ message.username }}:</strong> {{ message.text }}
      </div>
      <input type="text" v-model="newMessage" placeholder="Type your message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      joined: false,
      username: '',
      room: 'chatroom',
      messages: [],
      newMessage: '',
      socket: null,
    };
  },
  methods: {
    joinChatRoom() {
      this.joined = true;
      this.socket = io(); // Connect to the Socket.io server

      this.socket.emit('joinRoom', this.room); // Join the chat room

      this.socket.on('message', (data) => {
        this.messages.push(data); // Receive new messages
      });
    },
    sendMessage() {
      const messageData = {
        room: this.room,
        username: this.username,
        text: this.newMessage,
      };

      this.socket.emit('chatMessage', messageData); // Send the message
      this.messages.push(messageData); // Agregar el mensaje enviado localmente a la lista de mensajes

      this.newMessage = ''; // Clear the input field
    },
  },
  created() {
    this.socket = io('http://localhost:3000'); // Conectar al servidor Socket.io

    this.socket.emit('joinRoom', this.room); // Unirse a la sala de chat

    this.socket.on('message', (data) => {
      this.messages.push(data); // Recibir nuevos mensajes
    });
  },
}
</script>
<style src="../styles/styles.css"></style>