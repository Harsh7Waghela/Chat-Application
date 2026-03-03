const socket = io();
let myUsername = '';

// ── Join Chat ──
document.getElementById('join-btn').addEventListener('click', joinChat);
document.getElementById('username-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') joinChat();
});

function joinChat() {
  const name = document.getElementById('username-input').value.trim();
  if (!name) return;

  myUsername = name;
  socket.emit('join', name);

  document.getElementById('join-screen').style.display = 'none';
  document.getElementById('chat-screen').style.display = 'flex';
  document.getElementById('msg-input').focus();
}

// ── Send Message ──
document.getElementById('send-btn').addEventListener('click', sendMsg);
document.getElementById('msg-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMsg();
});

function sendMsg() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text) return;
  socket.emit('message', text);
  input.value = '';
}

// ── Receive Message ──
socket.on('message', (msg) => {
  const box = document.getElementById('messages');
  const div = document.createElement('div');

  if (msg.type === 'system') {
    div.className = 'msg system';
    div.innerHTML = `<div class="msg-bubble">${msg.text}</div>`;
  } else {
    const isMe = msg.user === myUsername;
    div.className = `msg ${isMe ? 'me' : 'other'}`;
    div.innerHTML = `
      <div class="msg-meta">${isMe ? '' : msg.user + ' · '}${msg.time}</div>
      <div class="msg-bubble">${msg.text}</div>
    `;
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
});

// ── Online Count ──
socket.on('userCount', (count) => {
  document.getElementById('user-count').textContent = count;
});