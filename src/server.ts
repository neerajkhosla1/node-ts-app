import app from './app'
import mongoose from "mongoose";
import config from './config';

const port = parseInt(process.env.PORT || '3001')

const server = new app().Start(port)
  .then(async (port) => {
    // Print the code activity. Prints 110
    console.log(`Server running on port ${port}`)
    try {
      await mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true });
      console.info(`Connected to mongoose!`);
    } catch (err) {
      console.error(`Unable to connect to Mongo!`, err);
    }
  })
  .catch(error => {
    console.log(error)
    process.exit(1);
  });

export default server;