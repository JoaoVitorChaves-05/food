const items = document.querySelectorAll(".menu-item")
items.forEach(e => e.addEventListener("click", () => {
    const produto = e.children[1].children[0]
    //const grupo = e
    const state = document.querySelector("#state")
    window.location.href += `/pedido?state=${state.innerHTML}` + "&elemento=" + encodeURIComponent(produto.innerHTML) + "&restaurante=" + window.location.href.split('/')[window.location.href.split('/').length - 1]
}))

const validateForm = (type) => {
    let inputs = document.forms["userInfo"]

    if (type === "E"){
        for (let i = 0; i < inputs.length; i++) {
            console.log(inputs[i])
            if (inputs[i].value === "" && i !== 6) {
                alert("Ainda faltam dados!")
                return false
            }
            if (i === 9) {
                const selected = (() => {
                    for ( var i = 0 ; i < inputs[9].length; i++ ) {
                        opt = inputs[9][i];
                        if (opt.selected === true) {
                            break;
                        }
                    }
                    return opt;
                })()
                console.log(selected)
                console.log(typeof selected.value)
                if (selected.value != 'null') {
                    return true;
                } else {
                    alert("Ainda faltam dados!")
                    return false
                }
            }
        }
    }
    else {
        for (let i = 0; i < inputs.length; i++) {
            console.log(inputs[i])
            if (inputs[i].value === "" && i !== 6) {
                alert("Ainda faltam dados!")
                return false
            }
            if (i === 2) {
                const selected = (() => {
                    for ( var i = 0 ; i < inputs[2].length; i++ ) {
                        opt = inputs[2][i];
                        if (opt.selected === true) {
                            break;
                        }
                    }
                    return opt;
                })()
                console.log(selected)
                console.log(typeof selected.value)
                if (selected.value != 'null') {
                    return true;
                } else {
                    alert("Ainda faltam dados!")
                    return false
                }
            }
        }
    }
}

const backButton = document.querySelector(".back-button")
backButton.addEventListener("click", () => window.history.back())

const confirmButton = document.querySelector(".confirm-button")
confirmButton.addEventListener("click", async () => {

    let type
    if (document.querySelector('.active-button').lastElementChild.innerHTML === 'Delivery')
        type = 'E'
    else
        type = 'R'
    
    if (!validateForm(type))
        return 

    const state = document.querySelector("#state")

    if (sessionStorage.pedido && JSON.parse(sessionStorage.pedido).pedido[0] !== null) {
        if (state.innerHTML === "aberto") {
            let pedido = JSON.parse(sessionStorage.pedido).pedido
            window.alert("Ao confirmar seu pedido iremos abrir uma conversa via WhatsApp com a loja. É muito importante não fechar essa conversa")
            //console.log(pedido)
            
            sessionStorage.setItem('pedido', JSON.stringify([]))
            updateStateModal(false)

            let numeroPedido
            let date = new Date()

            let info = [{
                data_pedido: date.getFullYear() + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate()).padStart(2, '0') + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.000Z' 
            }]

            let form = document.forms["userInfo"]

            if ((() => {
                if (document.querySelector('.active-button').lastElementChild.innerHTML === 'Delivery')
                    return 'E'
                return 'R'
            })() === 'E') {
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
                        console.log(pedido)
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
                .catch((error) => console.log(error))

                console.log('numero do pedido: ' + numeroPedido)
    
                let message = ``
    
                message += 'Pedido No: ' + numeroPedido.split(' ')[3] + '\n'
                message += 'Data/Hora: ' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + '\n'
                message += `*Valor: R$ ${info[0].vl_pedido.toFixed(2).replace('.', ',')}*\n\n`
                message += form[0].name + ': ' + form[0].value + '\n'
                message += form[1].name + ': ' + form[1].value + '\n'
                message += 'Método de pagamento: ' + (() => {
                    for ( var i = 0 ; i < form[9].length; i++ ) {
                        opt = form[9][i];
                        if (opt.selected === true) {
                            break;
                        }
                    }
                    return opt.value;
                })() + '\n'
                message += '_____________\n'
                message += (info[0].retira_entrega === 'E' ? '*DELIVERY*\n' + form[2].name + ': ' +  form[2].value + '\n' + form[3].name + ': ' +  form[3].value + '\n' + form[4].name + ': ' +  form[4].value + '\n' + form[5].name + ': ' +  form[5].value + '\n' + form[6].name + ': ' +  form[6].value + '\n' + form[7].name + ': ' +  form[7].value + '\n' + form[8].name + ': ' +  form[8].value + '\n': '*RETIRA*\n' + form[0].name + ': ' +  form[0].value + '\n' + form[1].name + ': ' +  form[1].value + '\n') + '_____________\n\n'
                message += 'PRODUTOS\n\n'
                
                for (let i = 0; i < pedido.length; i++) {
                    message += pedido[i].id_produto + ') ' + '*' + pedido[i].nome_produto + '*' + ` [Cód: ${pedido[i].codigo_pesquisa}]` + '\n'
                    message += pedido[i].unidade + ' ' + pedido[i].qtde + ' X R$ ' + pedido[i].vl_unitario.toFixed(2).replace('.', ',') + '\n'
                    message += 'Complementos:\n'
                    for (let j = 0; j < pedido[i].complementos.length; j++) {
                        message += '+ ' + pedido[i].complementos[j].nome_complemento + ' R$ ' + pedido[i].complementos[j].vl_complemento.toFixed(2).replace('.', ',') + ' x ' + pedido[i].complementos[j].qtde_complemento + '\n'
                    }
                    message += '= Subtotal: R$ ' + pedido[i].vl_total.toFixed(2).replace('.', ',')+ '\n'
                    message += 'Obs: ' + pedido[i].obs + '\n'
                    message += '\n'
                }
    
                message += '\n'
                message += '*ATENÇÃO*\n'
                message += 'Aguarde a confirmação do estabelecimento e o cálculo do frete'
                window.location.href = "https://wa.me/5512997932718?text=" + encodeURIComponent(message)
            } else {
                info[0] = {
                    ...info[0],
                    nome_cliente: form[0].value,
                    telefone: form[1].value,
                    retira_entrega: (() => {
                        if (document.querySelector('.active-button').lastElementChild.innerHTML === 'Delivery')
                            return 'E'
                        return 'R'
                    })(),
                    vl_pedido: (() => {
                        let value = 0.00
                        console.log(pedido)
                        pedido.forEach(e => {
                            console.log(e.vl_total)
                            let newValue = e.vl_total
                            value += parseFloat(newValue)
                        })
                        return value
                    })(),
                    forma_pagamento: (() => {
                        for ( var i = 0 ; i < form[2].length; i++ ) {
                            let opt = form[2][i];
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
                .then((response) => console.log(response))

                console.log(numeroPedido)

                let message = ''

                message += 'Pedido No: ' + numeroPedido.split(' ')[3] + '\n'
                message += 'Data/Hora: ' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + '\n'
                message += `*Valor: R$ ${info[0].vl_pedido.toFixed(2).replace('.', ',')}*\n\n`
                message += 'Nome' + ': ' + form[0].value + '\n'
                message += 'Celular' + ': ' + form[1].value + '\n'
                message += '_____\n\n'
                message += 'RETIRA\n'
                message += '_____\n\n'
                message += 'PRODUTOS\n\n'

                for (let i = 0; i < pedido.length; i++) {
                    message += pedido[i].id_produto + ') ' + '*' + pedido[i].nome_produto + '*' + ` [Cód: ${pedido[i].codigo_pesquisa}]` + '\n'
                    message += pedido[i].unidade + ' ' + pedido[i].qtde + ' X R$ ' + pedido[i].vl_unitario.toFixed(2).replace('.', ',') + '\n'
                    message += 'Complementos:\n'
                    for (let j = 0; j < pedido[i].complementos.length; j++) {
                        message += '+ ' + pedido[i].complementos[j].nome_complemento + ' R$ ' + pedido[i].complementos[j].vl_complemento.toFixed(2).replace('.', ',') + ' x ' + pedido[i].complementos[j].qtde_complemento + '\n'
                    }
                    message += '= Subtotal: R$ ' + pedido[i].vl_total.toFixed(2).replace('.', ',')+ '\n'
                    message += 'Obs: ' + pedido[i].obs + '\n'
                    message += '\n'
                }
    
                message += '\n'
                message += '*ATENÇÃO*\n'
                message += 'Aguarde a confirmação do estabelecimento e o cálculo do frete'
            
                window.location.href = "https://wa.me/5512997932718?text=" + encodeURIComponent(message)
            }
        } else {
            window.alert("O Restaurante está fechado!")
        }
    } else {
        window.alert("Adicione algum produto na sacola!")
        updateStateModal(false)
    }
})