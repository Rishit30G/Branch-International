const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
require('dotenv').config();
const User = require("./models/usersMessage");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const script_path = path.join(__dirname, "../templates/scripts");
app.use("/scripts", express.static(script_path));

const template_path = path.join(__dirname, "../templates/views");
const static_path = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(static_path);
const chatHistory = [];


app.get("/", async (req, res) => {
  try {
    const data = await User.find({});
    res.render("index", {
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.get("/api", async (req, res) => {
  try {
    const data = await User.find({});
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}); 

app.post('/api/save-message', async (req, res) => {
  const message = req.body;
  chatHistory.push(message);

  if((chatHistory.length % 2) != 0){
    try{
      const usersMessage = new User(message); 
      await usersMessage.save();
      // console.log("Message saved");
    }
    catch(err){
      console.log(err);
      res.status(500).send(err.message);
    }
  }
  res.status(200).send('Message saved');
});

app.get('/api/get-chat-history', (req, res) => {
  res.json(chatHistory);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
