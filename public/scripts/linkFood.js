const items = document.querySelectorAll(".menu-item")
items.forEach(e => e.addEventListener("click", () => {
    const produto = e.children[1].children[0]
    //const grupo = e
    const state = document.querySelector("#state")
    window.location.href += `/pedido?state=${state.innerHTML}` + "&elemento=" + produto.innerHTML + "&restaurante=" + window.location.href.split('/')[window.location.href.split('/').length - 1]
}))

const backButton = document.querySelector(".back-button")
backButton.addEventListener("click", () => window.history.back())

const confirmButton = document.querySelector(".confirm-button")
confirmButton.addEventListener("click", async () => {
    if (validateForm() === false) 
        return 

    const state = document.querySelector("#state")

    if (sessionStorage.pedido && JSON.parse(sessionStorage.pedido)[0] != null) {
        if (state.innerHTML === "aberto") {
            let pedido = JSON.parse(sessionStorage.pedido)
            
            sessionStorage.setItem('pedido', JSON.stringify([]))
            updateStateModal(false)

            let numeroPedido
            let date = new Date()

            let info = [{
                data_pedido: date.getFullYear() + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate()).padStart(2, '0') + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.000Z' 
            }]

            let form = document.forms["userInfo"]

            info[0] = {
                ...info[0],
                nome_cliente: form[0].value,
                telefone: form[1].value,
                retira_entrega: (() => {
                    if (document.querySelector('.active-button').lastElementChild.innerHTML === 'Delivery')
                        return 'E'
                    return 'R'
                })(),
                cep: form[2].value,
                endereco_numero: form[3].value,
                endereco: form[4].value,
                bairro: form[5].value,
                complemento: form[6].value,
                cidade: form[7].value,
                estado: form[8].value,
                vl_pedido: (() => {
                    let value = 0.00
                    pedido.forEach(e => {
                        console.log(e.vl_total)
                        let newValue = e.vl_total
                        value += parseFloat(newValue)
                    })
                    return value
                })(),
                forma_pagamento: (() => {
                    for ( var i = 0 ; i < form[9].length; i++ ) {
                        let opt = form[9][i];
                        if (opt.selected === true) {
                            break;
                        }
                    }
                    return opt.value;
                })(),
                produtos: pedido
            }
            
            await fetch('/api/send?pedido=' + encodeURIComponent(JSON.stringify(info)) + '&restaurante=' + encodeURIComponent(window.location.pathname.replace('/', '')))
            .then((response) => response.text())
            .then((response) => numeroPedido = response)

            let message = ``

            message += 'Pedido No: ' + numeroPedido.split(' ')[3] + '%0A'
            message += 'Data/Hora: ' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + '%0A'
            message += `*Valor: R$ ${info[0].vl_pedido.toFixed(2).replace('.', ',')}*%0A%0A`
            message += form[0].name + ': ' + form[0].value + '%0A'
            message += form[1].name + ': ' + form[1].value + '%0A'
            message += 'Método de pagamento: ' + (() => {
                for ( var i = 0 ; i < form[9].length; i++ ) {
                    opt = form[9][i];
                    if (opt.selected === true) {
                        break;
                    }
                }
                return opt.value;
            })() + '%0A'
            message += '_____________%0A'
            message += (info[0].retira_entrega === 'E' ? '*DELIVERY*%0A' + form[2].name + ': ' +  form[2].value + '%0A' + form[3].name + ': ' +  form[3].value + '%0A' + form[4].name + ': ' +  form[4].value + '%0A' + form[5].name + ': ' +  form[5].value + '%0A' + form[6].name + ': ' +  form[6].value + '%0A' + form[7].name + ': ' +  form[7].value + '%0A' + form[8].name + ': ' +  form[8].value + '%0A': '*RETIRA*%0A' + form[0].name + ': ' +  form[0].value + '%0A' + form[1].name + ': ' +  form[1].value + '%0A') + '_____________%0A%0A'
            message += 'PRODUTOS%0A%0A'
            
            for (let i = 0; i < pedido.length; i++) {
                message += pedido[i].id_produto + ') ' + '*' + pedido[i].nome_produto + '*' + ` [Cód: ${pedido[i].codigo_pesquisa}]` + '%0A'
                message += pedido[i].unidade + ' ' + pedido[i].qtde + ' X R$ ' + pedido[i].vl_unitario.toFixed(2).replace('.', ',') + '%0A'
                message += 'Obs: ' + pedido[i].obs + '%0A'
                message += 'Complementos:%0A'
                for (let j = 0; j < pedido[i].complementos.length; j++) {
                    message += '- ' + pedido[i].complementos[j].nome_complemento + ' R$ ' + pedido[i].complementos[j].vl_complemento.toFixed(2).replace('.', ',') + '%0A'
                }
                message += 'Subtotal: R$ ' + pedido[i].vl_total.toFixed(2).replace('.', ',')
                message += '%0A%0A'
            }

            message += '%0A'
            message += '*ATENÇÃO*%0A'
            message += 'Aguarde a confirmação do estabelecimento e o cálculo do frete'

            window.location.href = "https://wa.me/5512997932718?text=" + message

        } else {
            window.alert("O Restaurante está fechado!")
        }
    } else {
        window.alert("Adicione algum produto na sacola!")
        updateStateModal(false)
    }
    
})