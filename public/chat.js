document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chatMessages');
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const displayNameInput = document.getElementById('displayName');
  const sendBtn = document.getElementById('sendBtn');

  if (!chatMessages || !chatBox || !chatInput || !displayNameInput || !sendBtn) return;

  // ===== Pusher Setup =====
  Pusher.logToConsole = true;
  const pusher = new Pusher('b7d05dcc13df522efbbc', { cluster: 'us2' });
  const channel = pusher.subscribe('Veilian-CHAT-Z8');

  channel.bind('new-message', data => {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${data.displayName}: ${data.message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // ===== Send message =====
  function sendMessage() {
    const name = displayNameInput.value.trim() || 'Anon';
    const message = chatInput.value.trim();
    if (!message) return;

    fetch('/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name, message })
    })
    .then(res => res.text())
    .then(() => { chatInput.value = ''; })
    .catch(err => console.error('[CLIENT] fetch error:', err));
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  // ===== Toggle open/close =====
  let chatOpen = true;
  chatBox.addEventListener('dblclick', () => {
    chatOpen = !chatOpen;
    const inputWrapper = document.getElementById('chatInputWrapper');
    chatMessages.style.display = chatOpen ? 'block' : 'none';
    if (inputWrapper) inputWrapper.style.display = chatOpen ? 'flex' : 'none';
  });
});
