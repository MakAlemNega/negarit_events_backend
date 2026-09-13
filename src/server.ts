import "dotenv/config";
import Express = require("express");

import connectDB from "./db";
import router from "./routes/index";
import eventRouter from "./routes/events";
const app = Express();
const PORT = 7777;

connectDB();
app.use(Express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(router);

app.use("/api/events", eventRouter);
