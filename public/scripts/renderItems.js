const renderItems = () => {
    const itemsArea = document.querySelector('.items-area')
    itemsArea.innerHTML = ''


    if (sessionStorage.pedido) {
        /*
        {
            name: document.querySelector("h1").innerHTML,
            groupsOptions: groupsOptions,
            value: document.querySelector('#subTotal').innerHTML,
            unities: quantityText.innerHTML
        }
        */
        const items = JSON.parse(sessionStorage.pedido).filter(item => item !== null)

        if (items.length > 0) {
            for (let item of items) {
                itemsArea.innerHTML += 
                `
                <div class="item-to-buy">
                    <h2>${item.name} <span class="delete-button" onclick="deleteItem(this)"><img width="30" height="30"src="/images/botao-x.png"></span></h2>
                    <div class="info-to-buy">
                        <p>${(() => {
                            let text = ''
                            item.groupsOptions.forEach(e => text += e.name + ': ' + e.value + '<br>')
                            return text
                        })()} <br> Unidades: ${item.unities} <br>
                        Informações adicionais: ${item.additionalInfo}
                        </p>
                        <h3 class="price">${item.value}</h3>
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
                    prices.forEach(e => total += parseFloat(e.innerHTML.replace(',', '.')))   
                    total = total.toFixed(2)
                    total = total.replace('.', ',')
                    console.log(total)
                    return total
                })()}
                </h3>
            </div>
        </div>
        `
        sessionStorage.setItem('pedido', JSON.stringify(items))

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
    let items = JSON.parse(sessionStorage.pedido)

    const buttonsArray = []
    buttons.forEach(e => buttonsArray.push(e))

    const index = buttonsArray.indexOf(item)

    delete items[index]
    sessionStorage.setItem('pedido', JSON.stringify(items))
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
        let formType = `
        <input placeholder="Insira seu nome" type="text" name="Nome" id="name">
        <input placeholder="Insira seu telefone (com DDD)" type="tel" name="Celular" id="Celular">
        <div class="cep-numberHouse">
            <input placeholder="CEP" type="number" name="CEP" id="cep">
            <input placeholder="Número do endereço" type="number" name="Número do endereço" id="numberHouse">
        </div>
        <input placeholder="Endereço" type="text" name="Endereço" id="address">
        <div class="neighbor-reference">
            <input placeholder="Bairro" type="text" name="Bairro" id="neighbor">
            <input placeholder="Referência" type="text" name="Referência" id="reference">
        </div>
        <div class="city-state">
            <input placeholder="Cidade" type="text" name="Cidade" id="city">
            <input placeholder="Estado" type="text" name="Estado" id="state">    
        </div>
        <select name="Pagamento" id="payment">
            <optgroup>
                <option value="null">Forma de pagamento</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Crédito mastercard">Crédito Mastercard</option>
                <option value="Crédito visa">Crédito Visa</option>
                <option value="Débito mastercard">Débito Mastercard</option>
                <option value="Débito visa">Débito Visa</option>
            </optgroup>
        </select>`
        form.innerHTML = formType
    } else {
        let formType = 
        `
        <input placeholder="Insira seu nome" type="text" name="name" id="name">
        <input placeholder="Insira seu telefone (com DDD)" type="tel" name="Celular" id="Celular">
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

deliveryButton.addEventListener('click', () => {
    requestType = 'delivery'
    if (getFood.classList[1] === "active-button")
        getFood.classList.remove("active-button")
    deliveryButton.classList.add("active-button")
    setForm(requestType)
})

getFood.addEventListener('click', () => {
    requestType = 'retirar'
    if (deliveryButton.classList[1] === "active-button")
        deliveryButton.classList.remove("active-button")
    getFood.classList.add("active-button")
    setForm(requestType)
})
