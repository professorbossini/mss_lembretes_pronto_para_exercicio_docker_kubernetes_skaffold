/*
  GET /lembretes/123456/observacoes
  POST /lembretes/123456/observacoes
*/
const axios = require('axios')
const express = require('express')
const {v4: uuidv4} = require ('uuid')
const app = express()
app.use(express.json())

const observacoesPorLembreteId = {}

const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = 
      observacoesPorLembreteId[observacao.lembreteId]
    const obsParaAtualizar = 
      observacoes.find(o => o.id === observacao.id)
    obsParaAtualizar.status = observacao.status
    axios.post('http://localhost:10000/eventos', {
      tipo: 'ObservacaoAtualizada',
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status
      }  
    })
  }
}

app.get('/lembretes/:id/observacoes', (req, res) => {
  res.send(observacoesPorLembreteId[req.params.id] || [])
})
/*
{
  1: [{texto: 'obs1'}, {texto: 'obs2'}],
  2: [{texto: 'obs3'}],
  3: []
}
*/
app.post('/lembretes/:id/observacoes', async (req, res) => {
  //gerar um id de observação
  const idObs = uuidv4()
  //pegar o texto da observacao {texto: comprar o pó}
  const { texto } = req.body
  const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || []
  observacoesDoLembrete.push({id: idObs, texto, status: 'aguardando'})
  observacoesPorLembreteId[req.params.id] = observacoesDoLembrete
  await axios.post(
    'http://localhost:10000/eventos',
    {
      tipo: 'ObservacaoCriada',
      dados: {
        id: idObs, texto, lembreteId: req.params.id, status: 'aguardando'
      }
    }
  )
  res.status(201).send(observacoesDoLembrete)

})

app.post('/eventos', (req, res) => {
  try{
    funcoes[req.body.tipo](req.body.dados)
  }
  catch (e){}
  res.status(200).send({msg: 'ok'})
})

app.listen(
  5000,
  () => console.log(`Observacoes. Porta 5000`)
)