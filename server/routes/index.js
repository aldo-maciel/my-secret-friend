const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const htmlCreator = require('html-creator');
const fs = require("fs");

const upload = multer({dest: path.join('..', 'dist', 'uploads')});

router.get("/", function (req, res) {
  res.json('working')
});
router.post("/upload", upload.single('file'), function (req, res) {
  res.send(`/uploads/${req.file.filename}`);
})
router.post("/", function (req, res) {
  const member = req.body;

  const html = new htmlCreator([
    {
      type: 'head',
      content: [{type: 'title', content: 'MY::SECRET::FRIEND'}]
    },
    {
      type: 'body',
      attributes: {style: 'display: flex; width: 100vw; height: 100vh; justify-content: center; padding: 10px; text-align: center;'},
      content: [
        {
          type: 'div',
          content: [
            {
              type: 'div',
              content: `Seu Amigo Secreto:`,
              attributes: {style: 'font-size: 25px;'},
            },
            {
              type: 'div',
              content: member.name,
              attributes: {style: 'font-size: 35px; margin: 15px; width: 100%'},
            },
            member.image ? {
              type: 'img',
              attributes: {src: `${ req.protocol }://${ req.hostname }/${member.image}`},
            } : {},
          ],
        },
      ],
    },
  ]);

  const fileName = `${Math.random().toString(36) + Date.now().toString(36)}.html`;
  fs.writeFileSync(path.join(__dirname, '..', '..', 'dist', fileName), html.renderHTML());

  res.send(fileName);
})

module.exports = router;
