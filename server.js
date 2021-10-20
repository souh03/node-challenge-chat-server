const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store"..
//We will start with one message in the array..
//Note: messages will be lost when Glitch restarts our server..
let messages = [welcomeMessage];



const getMessageById = (req, res) => {
  const messageId = parseInt(req.params.id);
    const message = messages.find(a => a.id === messageId)
    if (message) {
        res.send(message)
    } else {
        res.status(404).send('Message not found')
    }
};

const saveNewMessage = (req, res) => {
  const newMessage = req.body;
  const maxId = Math.max(...messages.map((q) => q.id));
  newMessage.id = maxId + 1;
  if (newMessage.from.length === 0 || newMessage.text.length === 0) {
    res.status(400).send("All fields are mandatory")
  } else {
  messages.push(newMessage)};
  res.status(201).send(newMessage);
}


const deleteMessageById = (req, res) => {
  const messageId = parseInt(req.params.id);
  const jsonMessage = messages.find((q) => q.id === messageId);
  if (jsonMessage) {
    messages = messages.filter((q) => q.id != messageId);
    res.status(200).send(jsonMessage);
  } else {
    res.status(404).send("Did not find message with id " + messageId);
  }
}

const searchFunction = (req, res) => {
  const searchTerm = req.query.text;
  const match = messages.filter(message => message.text.toLowerCase().includes(searchTerm.toLowerCase()));
  res.send(match);
}

const displayLatestMessages = (req, res) => {
  const lastTen = messages.slice(-10);
    res.send(lastTen);
}

app.get('/messages', (req, res) => {
  res.send(messages)
});
app.get('/messages/latest', displayLatestMessages);
app.get('/messages/search', searchFunction);
app.get('/messages/:id', getMessageById);
app.post('/messages', saveNewMessage);
app.delete('/messages/:id', deleteMessageById);




app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
   console.log("Listening on port 3000")
  });
