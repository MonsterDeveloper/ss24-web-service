import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.post("/api/avatars", (req, res) => {
  const avatars = getAvatars();

  const avatar = {
    id: new Date().getTime(),
    avatarName: req.body.avatarName,
    childAge: Number(req.body.childAge),
    skinColor: req.body.skinColor,
    hairstyle: req.body.hairstyle,
    headShape: req.body.headShape,
    upperClothing: req.body.upperClothing,
    lowerClothing: req.body.lowerClothing,
    createdAt: new Date().toISOString(),
  };

  avatars.push(avatar);

  saveAvatars(avatars);

  res.setHeader("Location", `/api/avatars/${avatar.id}`)
  res.status(201).json(avatar);
});

app.get("/api/avatars", (req, res) => {
  const avatars = getAvatars();

  res.json(avatars);
});

app.get(`/api/avatars/:id`, (req, res) => {
  const avatars = getAvatars();
  const avatar = avatars.find((avatar) => avatar.id === Number(req.params.id));

  if (!avatar) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  res.json(avatar);
});

app.put(`/api/avatars/:id`, (req, res) => {
  const avatars = getAvatars();
  const avatar = avatars.find((avatar) => avatar.id === Number(req.params.id));

  if (!avatar) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  avatar.characterName = req.body.name;
  avatar.childAge = Number(req.body.age);
  avatar.skinColor = req.body.color;
  avatar.hairstyle = req.body.hairstyle;
  avatar.headShape = req.body.headShape;
  avatar.upperClothing = req.body.upperClothing;
  avatar.lowerClothing = req.body.lowerClothing;

  saveAvatars(avatars);

  res.sendStatus(204);
});

app.delete(`/api/avatars/:id`, (req, res) => {
  const avatars = getAvatars();
  const avatarIndex = avatars.findIndex((avatar) => avatar.id === Number(req.params.id));

  if (avatarIndex === -1) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  avatars.splice(avatarIndex, 1);

  saveAvatars(avatars);

  res.sendStatus(204);
});

function getAvatars() {
  if (!fs.existsSync(`${__dirname}/avatars.json`)) {
    fs.writeFileSync(`${__dirname}/avatars.json`, "[]");
  }

  return JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`));
}

function saveAvatars(avatars) {
  fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatars, null, 2));
}

if (process.argv[1].includes("main.js")) {
  app.listen(3000);
}

export default app;