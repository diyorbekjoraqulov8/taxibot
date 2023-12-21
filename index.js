const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(express.json())

require('./bot/bot')

// axios.defaults.baseURL = process.env.GOOGLE_MAPS_API_URL

async function dev() {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      app.listen(process.env.PORT, ()=> {
        console.log('Server is running');
      })
    })
    .catch((error) => console.log(error))
  } catch (error) {
    console.log(error);
  }
}
dev()