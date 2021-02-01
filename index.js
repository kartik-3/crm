require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routers/userRouter");
const loginRouter = require("./routers/loginRouter");
const leadsRouter = require("./routers/leadsRouter");
const servicesRouter = require("./routers/servicesRouter");

const app = express();
app.set("port", process.env.PORT || 5000);

const corsOptions = {
  credentials: true,
  // origin: "domainname"
};

app
  .use(cookieParser())
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use("/user", userRouter)
  .use("/login", loginRouter)
  .use("/leads", leadsRouter)
  .use("/services", servicesRouter)
  .listen(app.get("port"));
