import express from "express";
import fs from "fs";
import path from "path";
import avatarSchema from "./avatar.schema.js";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { isParent, isChild } from "./roles.js";
import { BasicStrategy } from "passport-http";
import bcrypt from "bcrypt";
import Joi from "joi";

const avatarsFilePath = path.join(process.cwd(), "avatars.json");
const usersFilePath = path.join(process.cwd(), "users.json");

const app = express();

passport.use(
  new BasicStrategy(async function (userid, password, done) {
    try {
      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
      const user = users.find((user) => user.userName === userid);
      if (user) {
        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
          done(null, user);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
})

app.use("/api/*", passport.authenticate("basic", { session: false }));

app.post("/api/avatars", isParent, (req, res) => {
  const { error, value } = avatarSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const avatars = getAvatars();

  const avatar = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...value,
  };

  avatars.push(avatar);

  saveAvatars(avatars);

  res.setHeader("Location", `/api/avatars/${avatar.id}`);
  res.status(201).json(avatar);
});

app.get("/api/avatars", isChild, (req, res) => {
  const avatars = getAvatars();

  res.json(avatars);
});

app.get(`/api/avatars/:id`, isChild, (req, res) => {
  const avatars = getAvatars();
  const avatar = avatars.find((avatar) => avatar.id === req.params.id);

  if (!avatar) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  res.json(avatar);
});

app.put(`/api/avatars/:id`, isParent, (req, res) => {
  const avatars = getAvatars();
  const avatar = avatars.find((avatar) => avatar.id === Number(req.params.id));

  if (!avatar) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  const { error, value } = avatarSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  avatar.characterName = value.characterName;
  avatar.childAge = value.childAge;
  avatar.skinColor = value.skinColor;
  avatar.hairstyle = value.hairstyle;
  avatar.headShape = value.headShape;
  avatar.upperClothing = value.upperClothing;
  avatar.lowerClothing = value.lowerClothing;

  saveAvatars(avatars);

  res.sendStatus(204);
});

app.delete(`/api/avatars/:id`, isParent, (req, res) => {
  const avatars = getAvatars();
  const avatarIndex = avatars.findIndex(
    (avatar) => avatar.id === Number(req.params.id)
  );

  if (avatarIndex === -1) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  avatars.splice(avatarIndex, 1);

  saveAvatars(avatars);

  res.sendStatus(204);
});

const createUserSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(Joi.string().valid("parent", "child")).required(),
});

app.post("/api/users", isParent, (req, res) => {
  const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const user = {
    id: uuidv4(),
    ...value,
  };

  users.push(user);

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.setHeader("Location", `/api/users/${user.id}`);
  res.status(201).json(user);
});

function getAvatars() {
  if (!fs.existsSync(avatarsFilePath)) {
    fs.writeFileSync(avatarsFilePath, "[]");
  }

  return JSON.parse(fs.readFileSync(avatarsFilePath));
}

function saveAvatars(avatars) {
  fs.writeFileSync(avatarsFilePath, JSON.stringify(avatars, null, 2));
}

if (process.argv[1].includes("main.js")) {
  app.listen(3000);
}

export default app;
