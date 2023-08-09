const express = require('express')
const axios = require ('axios')
const app = express()
app.use(express.json())

const eventos = []

app.post('/eventos', async (req, res) => {
  // {tipo: LembreteCriado, payload: { id: 1, texto: "Fazer cafe"}}
  const evento = req.body
  eventos.push(evento)
  console.log(evento)

  try{
    //direcionando o evento para o mss de lembretes
    await axios.post('http://localhost:4000/eventos', evento)
  }
  catch(e){
    console.log('Mss lembretes indisponível')
  }

  try{
    //direcionando o evento para o mss de observações
    await axios.post('http://localhost:5000/eventos', evento);
  }
  catch(e){
    console.log('Mss observações indisponível')
  }

  try{
    //direcionando o evento para o mss de observações
    await axios.post('http://localhost:5000/eventos', evento);
  }
  catch(e){
    console.log('Mss observações indisponível')
  }

  try{
    //direcionando o evento para o mss de consulta
    await axios.post('http://localhost:6000/eventos', evento)
  }
  catch(e){
    console.log('Mss consulta indisponível')
  }
  
  try{
    //direcionando o evento para o mss de classificação
    await axios.post('http://localhost:7000/eventos', evento)
  }
  catch(e){
    console.log('Mss classificação indisponível')
  }
  
  res.status(200).send({msg: 'ok'})
})

app.get('/eventos', (req, res) => {
  res.send(eventos)
})

app.listen(
  10000, 
  () => console.log(`Barramento. 10000`)
)