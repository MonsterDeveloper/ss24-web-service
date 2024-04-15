const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.post("/create-avatar", (req, res) => {
  console.log(req.body);
  res.send("Avatar created successfully");

  if (!fs.existsSync(`${__dirname}/avatars.json`)) {
    fs.writeFileSync(`${__dirname}/avatars.json`, "[]");
  }

  const avatars = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`));

  avatars.push({
    id: new Date().getTime(),
    characterName: req.body.name,
    childAge: Number(req.body.age),
    skinColor: req.body.color,
    hairstyle: req.body.hairstyle,
    headShape: req.body.headShape,
    upperClothing: req.body.upperClothing,
    lowerClothing: req.body.lowerClothing,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(`${__dirname}/avatars.json`, JSON.stringify(avatars, null, 2));
});

app.get("/avatars", (req, res) => {
  const avatars = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`));

  res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Avatars</title>
    </head>
    <body>
      <h1>Avatars</h1>
      <ol>
        ${avatars.map((avatar) => `<li><a href="/avatar/${avatar.id}">${avatar.characterName}</a></li>`).join("")}
      </ol>
    </body>
  </html>
  `)
});

app.get(`/avatar/:id`, (req, res) => {
  const avatars = JSON.parse(fs.readFileSync(`${__dirname}/avatars.json`));
  const avatar = avatars.find((avatar) => avatar.id === Number(req.params.id));

  res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${avatar.characterName}</title>
    </head>
    <body>
      <h1>${avatar.characterName}</h1>
      <p>Age: ${avatar.childAge}</p>
      <p>Skin color: ${avatar.skinColor}</p>
      <p>Hairstyle: ${avatar.hairstyle}</p>
      <p>Head shape: ${avatar.headShape}</p>
      <p>Upper clothing: ${avatar.upperClothing}</p>
      <p>Lower clothing: ${avatar.lowerClothing}</p>
      <p>Created at: ${avatar.createdAt}</p>
    </body>
  </html>
  `)
});

app.listen(3000);