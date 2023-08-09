const express = require('express')
const axios = require ('axios')
const app = express()
app.use(express.json())

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.id] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsulta[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes = 
      baseConsulta[observacao.lembreteId]['observacoes']
    const indice = 
      observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao
  }
}

const baseConsulta = {}

//GET /lembretes
app.get('/lembretes', (req, res) => {
  res.send(baseConsulta)
})

//POST /eventos
app.post('/eventos', (req, res) => {
  try{
    funcoes[req.body.tipo](req.body.dados)
  }
  catch(e){}
  res.send({msg: 'ok'})
} )

app.listen( 6000, async () => {
  console.log(`Consulta. Porta 6000`)
  const resp = await axios.get('http://localhost:10000/eventos')
  resp.data.forEach((valor, indice, colecao) => {
    try{
      funcoes[valor.tipo](valor.dados)
    }
    catch(e){}
  })
})
