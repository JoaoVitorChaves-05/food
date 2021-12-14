import express, { json } from 'express';
import { engine } from 'express-handlebars';
import fetch from "node-fetch";
import queryString from 'query-string';

const app = express();

app.use(express.static('public'))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set("views", "./views");

const PORT = process.env.PORT || 3000

app.get('/', async (req, res) => {
    const restaurantes = await fetch('http://192.168.15.21:3000/api/restaurantes')
    .then(res => res.json())
    .then(data => data)
    console.log(restaurantes)
    res.render('home', {
        restaurantes: restaurantes
    })
})

app.get('/:restaurante', async function(req, res) {
    const {restaurante} = req.params

    let infoRestaurante = []
    await fetch('http://192.168.15.21:3000/api/restaurante?restaurante=' + restaurante)
    .then(response => response.json())
    .then(data => infoRestaurante = data)

    let endereco = infoRestaurante[0].Endereco
    let telefone = infoRestaurante[0].Telefone
    let mensagemDestaque = infoRestaurante[0].MensagemDestaque
    let descricao = infoRestaurante[0].Descricao
    let podeDelivery = infoRestaurante[0].PodeDelivery
    let podeRetirar = infoRestaurante[0].PodeRetirar

    res.render('restaurant', {
        grupos: infoRestaurante[0].grupos,
        restaurante: infoRestaurante[0].NomeRestaurante,
        state: infoRestaurante[0].RestauranteAberto ? "aberto": "fechado",
        endereco: endereco,
        telefone: telefone,
        mensagemDestaque: mensagemDestaque,
        descricao: descricao,
        podeDelivery: podeDelivery,
        podeRetirar: podeRetirar,
    })
})

app.get('/:restaurante/pedido', async (req, res) => {
    const {elemento} = req.query
    const {restaurante} = req.params
    console.log(elemento)
    let produtos = []
    await fetch('http://192.168.15.21:3000/api/restaurante?restaurante=' + restaurante)
    .then(response => response.json())
    .then(data => produtos = data)

    let produtoSelecionado = {}
    let promocao = false

    produtos[0].grupos.forEach(grupo => {
        if (grupo.grupo === 'Promoção') {
            grupo.produtos_em_promocao.forEach(produto => {
                if (produto.nome_produto === elemento ) {
                    produtoSelecionado = {...produto}
                    promocao = produto.promocao === 'N' ? false : true
                }
            })
        } else {
            grupo.produtos.forEach(produto => {
                if (produto.nome_produto === elemento ) {
                    produtoSelecionado = {...produto}
                    console.log(produtoSelecionado)
                    promocao = produto.promocao === 'N' ? false : true
                }
            })
        }
    })

    console.log(Object.keys(produtoSelecionado))
    console.log(produtoSelecionado.gruposComplemento)

    res.render('food', {
        gruposComplementos: produtoSelecionado.gruposComplemento,
        produtoSelecionado: produtoSelecionado,
        temPromocao: promocao
    })
    /*
    let currentGroup = ''

    const gruposComplementos = []

    let produtoSelecionado = produtos[0].produtos.filter(produto => produto.nome_produto === elemento)
    
    produtoSelecionado[0].adicionais.forEach(adicional => {
        if (adicional.grupo_complemento !== currentGroup) {
            currentGroup = adicional.grupo_complemento
            gruposComplementos.push({grupo_complemento: adicional.grupo_complemento, adicionais: null, min: null, max: null})
        }
    })

    gruposComplementos.forEach(grupo => {
        let grupoComplemento = produtoSelecionado[0].adicionais.filter(adicional => adicional.grupo_complemento === grupo.grupo_complemento)
        grupo.adicionais = grupoComplemento
    })

    produtoSelecionado[0].vl_venda = produtoSelecionado[0].vl_venda.toFixed(2)
    produtoSelecionado[0].vl_venda = produtoSelecionado[0].vl_venda.replace('.', ',')

    gruposComplementos[0].max = produtoSelecionado[0].Max
    gruposComplementos[0].min = produtoSelecionado[0].Min

    console.log(gruposComplementos)
    res.render('food', {
        gruposComplementos: gruposComplementos,
        produtoSelecionado: produtoSelecionado[0]
    })
    */
})

app.get('/api/restaurante', (req, res) => {
    const {restaurante} = req.query

    if (restaurante === 'bar') {
        res.sendFile('D:/Projetos/Trabalho/dkFood - Backend/arquivos json/estruturaBase.json')
    }
    
    if (restaurante === 'pastel') {
        res.sendFile('D:/Projetos/Trabalho/dkFood - Backend/arquivos json/estruturaBase2.json')
    }
})

app.get('/api/restaurantes', (req, res) => {
    res.sendFile('D:/Projetos/Trabalho/dkFood - Backend/arquivos json/restaurantes.json')
})

app.listen(PORT)