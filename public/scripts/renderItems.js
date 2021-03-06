const renderItems = () => {
    const itemsArea = document.querySelector('.items-area')
    itemsArea.innerHTML = ''

    let params = (new URL(document.location)).searchParams;

    if (sessionStorage.pedido) {
        if (JSON.parse(sessionStorage.pedido).restaurante === document.location.pathname.replace('/', '')) {
            const items = JSON.parse(sessionStorage.pedido).pedido.filter(item => item !== null)
            console.log(items)
            if (items.length > 0) {
                for (let item of items) {
                    itemsArea.innerHTML += 
                    `
                    <div class="item-to-buy">
                        <h2>${item.nome_produto} <span class="delete-button" onclick="deleteItem(this)"><img width="30" height="30"src="/images/botao-x.png"></span></h2>
                        <div class="info-to-buy">
                            <p>${(() => {
                                let text = ''
                                item.complementos.forEach(e => text += e.nome_complemento + ': ' + 'R$ ' + e.vl_complemento.toFixed(2).replace('.', ',') + ' x ' + e.qtde_complemento + ' unidade(s)' + '<br>')
                                return text
                            })()} <br> Unidades: ${item.qtde} <br>
                            Informações adicionais: ${item.obs}
                            </p>
                            <h3 class="price">R$ ${item.vl_total.toFixed(2).replace('.', ',')}</h3>
                        </div>
                    </div>
                    `
                }

            } else {
                itemsArea.innerHTML = ''
                itemsArea.innerHTML +=
                `
                <div class="not-found">
                    <h2>Ainda não adicionou nada no carrinho!</h2>
                </div>
                `
                return
            }

            itemsArea.innerHTML += 
                `
                <div class="item-to-buy">
                    
                    <div class="areaTotal">
                        <h2>Total</h2>
                        <h3 class="totalPrice">${(() => {
                            const prices = document.querySelectorAll('.price')
                            let total = 0
                            prices.forEach(e => total += parseFloat(e.innerHTML.replace(',', '.').split(' ')[1]))   
                            total = total.toFixed(2)
                            total = total.replace('.', ',')
                            console.log(total)
                            return 'R$ ' + total
                        })()}
                        </h3>
                    </div>
                </div>
                `
            sessionStorage.setItem('pedido', JSON.stringify({restaurante: window.location.pathname.replace('/', ''), pedido: items}))
        }
        else {
            itemsArea.innerHTML = ''
            itemsArea.innerHTML +=
            `
            <div class="not-found">
                <h2>Ainda não adicionou nada no carrinho!</h2>
            </div>
            `
        }
    } else {
        itemsArea.innerHTML = ''
        itemsArea.innerHTML +=
        `
        <div class="not-found">
            <h2>Ainda não adicionou nada no carrinho!</h2>
        </div>
        `
    }
}

const deleteItem = (item) => {
    const buttons = document.querySelectorAll('.delete-button')
    let items = JSON.parse(sessionStorage.pedido).pedido

    const buttonsArray = []
    buttons.forEach(e => buttonsArray.push(e))

    const indexButton = buttonsArray.indexOf(item)

    items = items.filter((item, index) => index !== indexButton)

    for (let i = 0; i < items.length; i++) {
        items[i].id_produto = i + 1
    }

    sessionStorage.setItem('pedido', JSON.stringify({restaurante: window.location.pathname.replace('/', ''), pedido: items}))
    renderItems()
}

const modal = document.querySelector('.modal')
const popup = document.querySelector('.popup')
const html = document.querySelector('html')
const carrinho = document.querySelector('.carrinho')

const back = document.querySelector('.back-to-menu')
const confirm = document.querySelector('.confirm-button')
const form = document.querySelector('form')

const updateStateModal = (state) => {
    if (state === true) {
        html.style.overflowY = 'hidden'
        modal.style.display = 'inline'
        html.scrollTop = 0;
        popup.style.overflowY = 'scroll'
    } else {
        modal.style.display = 'none'
        html.style.overflowY = 'scroll'
        popup.style.overflowY = 'hidden'
    }
}

const updateStateForm = (type, state) => {
    if (type === 'delivery') {
        if (state === true) {
            console.log('oi')
        }
    } 
}
updateStateModal(false)

carrinho.addEventListener('click', () => {updateStateModal(true); renderItems();})
back.addEventListener('click', () => updateStateModal(false))

let requestType = 'delivery'

const setForm = (type) => { 

    if (type === "delivery") {
        let formasPagamento = document.querySelectorAll('.payment-item')
        let options = (() => {
            let options = "<option value='null'>Selecione uma forma de pagamento</option>"
            for (var i = 0; i < formasPagamento.length; i++) {
                options += `<option value="${formasPagamento[i].innerHTML}">${formasPagamento[i].innerHTML}</option>`
            }
            return options
        })()

        let formType = `
        <input placeholder="Insira seu nome" type="text" name="Nome" id="name">
        <input placeholder="Insira seu telefone (com DDD)" type="tel" name="Celular" id="Celular">
        <div class="cep-numberHouse">
            <input placeholder="CEP" onchange="checkCEP()" type="number" name="CEP" id="cep">
            <input placeholder="Número do endereço" type="number" name="Número do endereço" id="numberHouse">
        </div>
        <input placeholder="Endereço" type="text" name="Endereço" id="address">
        <div class="neighbor-reference">
            <input placeholder="Bairro" type="text" name="Bairro" id="neighbor">
            <input placeholder="Referência" type="text" name="complemento" id="reference">
        </div>
        <div class="city-state">
            <input placeholder="Cidade" type="text" name="Cidade" id="city">
            <input placeholder="Estado" type="text" name="Estado" id="uf">    
        </div>
        <select name="Pagamento" id="payment">
            <optgroup>
                ${options}
            </optgroup>
        </select>`
        form.innerHTML = formType
    } else {
        
        let formasPagamento = document.querySelectorAll('.payment-item')
        let options = (() => {
            let options = "<option value='null'>Selecione uma forma de pagamento</option>"
            for (var i = 0; i < formasPagamento.length; i++) {
                options += `<option value="${formasPagamento[i].innerHTML}">${formasPagamento[i].innerHTML}</option>`
            }
            return options
        })()

        let formType = 
        `
        <input placeholder="Insira seu nome" type="text" name="name" id="name">
        <input placeholder="Insira seu telefone (com DDD)" type="tel" name="Celular" id="Celular">
        <select name="Pagamento" id="payment">
            <optgroup>
                ${options}
            </optgroup>
        </select>
        `
        form.innerHTML = formType
    }
}



const deliveryButton = document.querySelector('.deliveryButton')
const getFood = document.querySelector('.getFood')
const buttonActive = document.querySelector('.active-button')

if (deliveryButton && getFood) {
    deliveryButton.classList.add("active-button")
    requestType = 'delivery'
    setForm(requestType)
} else if (getFood) {
    getFood.classList.add("active-button")
    requestType = 'retirar'
    setForm(requestType)
} else if (deliveryButton) {
    deliveryButton.classList.add("active-button")
    requestType = 'delivery'
    setForm(requestType)
}

if (deliveryButton) {
    deliveryButton.addEventListener('click', () => {
        requestType = 'delivery'
        if (getFood.classList[1] === "active-button")
            getFood.classList.remove("active-button")
        deliveryButton.classList.add("active-button")
        setForm(requestType)
    })
}

if (getFood) {
    getFood.addEventListener('click', () => {
        requestType = 'retirar'
        if (deliveryButton.classList[1] === "active-button")
            deliveryButton.classList.remove("active-button")
        getFood.classList.add("active-button")
        setForm(requestType)
    })
}

const checkCEP = async () => {
    const cep = document.querySelector('#cep').value

    if (cep.length == 8) {
        for (let char = 0; char < cep.length; char++) {
            if (!(() => cep[char] >= '0' && cep[char] <= '9')()) {
                return
            }
        }

        const info = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(response => response)

        if (info.erro) return

        console.log(info)

        const endereco = document.querySelector('#address')
        const bairro = document.querySelector('#neighbor')
        const cidade = document.querySelector('#city')
        const estado = document.querySelector('#uf')

        endereco.value = info.logradouro
        bairro.value = info.bairro
        cidade.value = info.localidade
        estado.value = info.uf
    }
    
}