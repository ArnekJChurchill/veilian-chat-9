const express = require('express');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

const pusher = new Pusher({
  appId: "2080160",
  key: "b7d05dcc13df522efbbc",
  secret: "4064ce2fc0ac5596d506",
  cluster: "us2",
  useTLS: true
});

// Endpoint to broadcast messages
app.post('/message', (req, res) => {
  const { displayName, message } = req.body;
  if (!displayName || !message) return res.status(400).send("Missing fields");

  pusher.trigger("Veilian-CHAT-Z8", "new-message", { displayName, message });
  res.status(200).send("Message sent");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Veilian Chat server running on port ${PORT}`));
