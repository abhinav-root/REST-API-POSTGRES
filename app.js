const express = require("express");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
const cors = require("cors");
const routes = require("./routes/");
const { sequelize } = require("./models/");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({});

  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");

  // middlewares
  app.use(express.json());
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(
    session({
      name: "sid",
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      resave: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  //include routes
  app.use("/api", routes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
};

main().catch((err) => console.log(err));
