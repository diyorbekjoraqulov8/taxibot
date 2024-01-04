const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(express.json())

require('./bot/bot')

// axios.defaults.baseURL = process.env.GOOGLE_MAPS_API_URL
let one1 = 1

async function dev() {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      app.listen(process.env.PORT, ()=> {
        console.log('Server is running');
      })
    })
    .catch((error) => console.log(error))

    setInterval(() => {
      console.log(`result is ${one1}`);
      one1++
    }, 360000);
  } catch (error) {
    console.log(error);
  }
}
dev()