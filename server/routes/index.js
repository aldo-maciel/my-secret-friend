const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const htmlCreator = require('html-creator')
const fs = require('fs')

const upload = multer({ dest: path.join('..', 'dist', 'uploads') })

router.get('/', function (req, res) {
  res.json('working')
})
router.post('/upload', upload.single('file'), function (req, res) {
  res.send(`uploads/${ req.file.filename }`)
})
router.post('/', function (req, res) {
  const member = req.body

  const html = new htmlCreator([
    {
      type: 'head',
      content: [
        { type: 'title', content: 'MY::SECRET::FRIEND' },
        {
          type: 'style',
          content: `
          .fade-element {
            opacity: 1;
            transition: opacity 1s ease-out;
            background-color: #3498db;
            color: white;
            padding: 20px;
            margin: 20px;
            text-align: center;
            font-size: 18px;
          }
          .fade-element.fading {
            opacity: 0;
          }
        `
        }
      ]
    },
    {
      type: 'body',
      attributes: { style: 'display: flex; width: 100vw; height: 100vh; justify-content: center; padding: 10px; text-align: center;' },
      content: [
        {
          type: 'div',
          content: [
            {
              type: 'div',
              content: `Seu Amigo Secreto:`,
              attributes: { style: 'font-size: 25px;' }
            },
            {
              type: 'div',
              content: member.name,
              attributes: { style: 'font-size: 35px; margin: 15px; width: 100%', id: 'nameElement', class: 'fade-element' }
            },
            member.image ? {
              type: 'img',
              attributes: { src: `${ req.protocol }://${ req.hostname }/${ member.image }`, id: 'photoElement', class: 'fade-element' }
            } : {}
          ]
        },
        {
          type: 'script',
          content: `
          setTimeout(function() {
            document.getElementById('nameElement').classList.add('fading');
            document.getElementById('photoElement').classList.add('fading');
            setTimeout(function() {
              window.location.reload();
            }, 2000);
          }, 30000);
        `
        }
      ]
    }
  ])

  const fileName = `${ Math.random().toString(36) + Date.now().toString(36) }.html`
  fs.writeFileSync(path.join(__dirname, '..', '..', 'dist', fileName), html.renderHTML())

  res.send(fileName)
})
router.get('/:html', (req, res) => {
  const filename = req.params.html
  console.log('HTML file requested:', filename)
  const htmlPath = path.join(__dirname, '..', '..', 'dist', filename)

  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send('Você já abriu o link! Não é permitido abri-ló novamente.')
  }

  res.sendFile(htmlPath)

  setTimeout(() => {
    fs.rm(htmlPath, { recursive: false }, (err) => {
      if (err) {
        console.error(`Error deleting ${ htmlPath }:`, err)
      }
    })
  }, 1000 * 35) // 35 seconds
})

module.exports = router
