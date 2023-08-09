const express = require ('express')
const axios = require('axios')
const app = express()
app.use(express.json())

const lembretes = {}
let idAtual = 0
//GET localhost:4000/lembretes
app.get('/lembretes', (req, res) => {
  res.json(lembretes)
})

//POST localhost:4000/lembretes
// {"texto": "Fazer café"}
/*
{
  "1": {
    "id": 1,
    "texto": "Café"
  },
  "2": {
    "id": 2,
    "texto": "Cinema"
  }
} 
*/
app.post('/lembretes', async (req, res) => {
  idAtual++;
  const { texto } = req.body
  lembretes[idAtual] = {
    id: idAtual, texto
  }
  await axios.post(
    'http://localhost:10000/eventos',
    {
      tipo: 'LembreteCriado',
      dados: {
        id: idAtual, texto
      },
    }
  )
  res.status(201).send(lembretes[idAtual])
})

app.post('/eventos', (req, res) => {
  console.log(req.body)
  res.status(200).send({msg: 'ok'})  
})

app.listen(4000, () => {
  console.log(`Lembretes. Porta 4000.`)
})


