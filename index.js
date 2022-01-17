import express from 'express';
import { engine } from 'express-handlebars';
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();

app.use(express.static('public'))
app.use(bodyParser.json())

app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set("views", "./views");

const PORT = process.env.PORT || 3000

const API = 'https://6419-177-62-248-18.ngrok.io'

app.get('/', async (req, res) => {
    const restaurantes = await fetch(`${API}/api/restaurantes/123`)
    .then((response) => response.json())
    .then(data => data)
    .catch(err => console.log(err))

    res.render('home', {
        restaurantes: restaurantes
    })
})

app.get('/:restaurante', async function(req, res) {
    const {restaurante} = req.params
    const {adicionado} = req.query

    let chave
    let state

    await fetch(`${API}/api/aberto/${restaurante}`)
    .then(response => response.text())
    .then(response => {
        chave = response.split(';')[0]
        state = response.split(';')[1]
        /*
        if (response.message) {
            res.send('<h1>Restaurante fechado!</h1>')
            return
        }
        return response
        */
    })
    .catch(err => console.log(err))

    console.log('Chave: ' + chave)
    console.log('State: ' + state)

    let restaurantes = await fetch(`${API}/api/restaurantes/123`)
    .then(response => response.json())
    .then(response => response)
    .catch(err => console.log(err))

    let infoRestaurante = []

    restaurantes.forEach(async (e) => {
        if (restaurante === e.RestauranteApelido) {
            //infoRestaurante = await fetch(`https://bb4f-200-170-124-158.ngrok.io/api/menu/${restaurante}/123`)
            await fetch(`${API}/api/menu/${restaurante}/${chave}`)
            .then(response => response.json())
            .then(response => {

                infoRestaurante = response

                let endereco = infoRestaurante[0].Endereco
                let telefone = infoRestaurante[0].Telefone
                let mensagemDestaque = infoRestaurante[0].MensagemDestaque
                let descricao = infoRestaurante[0].Descricao
                let podeDelivery = infoRestaurante[0].PossuiDelivery
                let podeRetirar = infoRestaurante[0].PossuiRetira
                let formasPagamento = infoRestaurante[0].FormasPagamento.split(';')
                let foto = infoRestaurante[0].Foto

                res.render('restaurant', {
                    grupos: infoRestaurante[0].grupos,
                    restaurante: infoRestaurante[0].NomeRestaurante,
                    state: state === 'ABERTO' ? "aberto": "fechado",
                    endereco: endereco,
                    telefone: telefone,
                    mensagemDestaque: 'Hoje não temos o delivery',
                    descricao: descricao,
                    podeDelivery: podeDelivery === 'true' ? true : false,
                    podeRetirar: podeRetirar === 'true' ? true : false,
                    formasPagamento: formasPagamento,
                    adicionado: adicionado,
                    foto: foto
                })
            })
            .catch(err => console.log(err))
        }
    })
})

app.get('/:restaurante/pedido', async (req, res) => {
    const {elemento} = req.query
    const {restaurante} = req.params
    console.log(elemento)
    let produtos = []

    let chave
    let state

    await fetch(`${API}/api/aberto/${restaurante}`)
    .then(response => response.text())
    .then(response => {
        chave = response.split(';')[0]
        state = response.split(';')[1]
    })
    .catch(err => console.log(err))

    console.log(chave)

    await fetch(`${API}/api/menu/${restaurante}/${chave}`)
    .then(response => response.json())
    .then(data => {
        produtos = data

        let produtoSelecionado = {}
        let promocao = false

        produtos[0].grupos.forEach(grupo => {
            if (grupo.grupo === 'Promoção') {
                grupo.produtos_em_promocao.forEach(produto => {
                    if (produto.nome_produto === elemento ) {
                        produtoSelecionado = {...produto}
                        promocao = produto.promocao === 'false' ? false : true
                    }
                })
            } else {
                grupo.produtos.forEach(produto => {
                    if (produto.nome_produto === elemento ) {
                        produtoSelecionado = {...produto}
                        console.log(produtoSelecionado)
                        promocao = produto.promocao === 'false' ? false : true
                    }
                })
            }
        })

        console.log(Object.keys(produtoSelecionado))
        console.log(produtoSelecionado)
        console.log(produtoSelecionado.grupoComplemento)

        res.render('food', {
            gruposComplementos: produtoSelecionado.grupoComplemento,
            produtoSelecionado: produtoSelecionado,
            temPromocao: promocao
        })
    })
    .catch(err => console.log(err))
})

app.get('/api/restaurante', async (req, res) => {
    const {restaurante} = req.query

    let restaurantes = await fetch(`${API}/api/restaurantes/123`)
    .then(response => response.json())
    .then(response => response)

    restaurantes.forEach(async (e) => {
        if (restaurante === e.RestauranteApelido) {
            await fetch(`${API}/api/menu/${restaurante}/chave`)
            .then(response => response.json())
            .then(response => res.send(response))
            .catch(err => console.log(err))
        }
    })
})

app.get('/api/restaurantes', async (req, res) => {
    await fetch(`${API}/api/restaurantes/123`)
    .then(response => response.json())
    .then(response => res.send(response))
})

app.get('/api/send', async (req, res) => {
    const {pedido} = req.query
    const {restaurante} = req.query

    let chave
    let state

    await fetch(`${API}/api/aberto/${restaurante}`)
    .then(response => response.text())
    .then(response => {
        chave = response.split(';')[0]
        state = response.split(';')[1]
    })
    .catch(err => console.log(err))


    let pedidoEncoded = encodeURIComponent(pedido)
    console.log(pedidoEncoded)
    await fetch(`${API}/api/pedido/${restaurante}/${chave}/${pedidoEncoded}`)
    .then(res => res.text())
    .then(response => res.send(response))
    .catch(er => console.log(er))

})

app.listen(PORT)