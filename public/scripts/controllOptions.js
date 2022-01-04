const groups = document.querySelectorAll(".group")
const groupsElements = []

var elementsOption = document.querySelectorAll('.options')
for (var i = 0; i < elementsOption.length; i++) {
    groupsElements.push(elementsOption[i].children)
}

var optionsPerSection = []

const maxOptions = document.querySelectorAll(".maxOptions")

const options = []

let valueOfOptions = 0.00
const initialValue = document.querySelector(".principal-price")
let unities = parseFloat(document.querySelector('#quantity').innerHTML)

let subTotal = (parseFloat(initialValue.innerHTML) + valueOfOptions) * unities

function updateSubTotal() {
    subTotal = (parseFloat(initialValue.innerHTML.replace(',', '.')) + valueOfOptions) * unities
    const subTotalElement = document.querySelector('#subTotal')
    subTotal = subTotal.toFixed(2)
    subTotal = subTotal.replace('.', ',')
    subTotalElement.innerHTML = subTotal
}

function verificar(clicked) {

    if (clicked.checked && clicked.value == 1) {
        let value = parseFloat(clicked.previousElementSibling.innerHTML.split(' ')[1].replace(',', '.'))

        valueOfOptions += value
        updateSubTotal()
        
    }

    if (clicked.checked == false && clicked.value == 1) {
        let value = parseFloat(clicked.previousElementSibling.innerHTML.split(' ')[1].replace(',', '.'))

        valueOfOptions -= value
        updateSubTotal()
    }

    for (let i = 0; i < groupsElements.length; i++) {
        var newGroup = groupsElements[i]
        if ((function () {
            for (let j = 0; j < newGroup.length; j++) {
                if (newGroup[j].lastElementChild === clicked) {
                    return true
                }
            }
            return false
        })()) {
            var Marcados = 0;
            var max = maxOptions[i].innerHTML[maxOptions[i].innerHTML.length - 2]
            for (var iLoop = 0; iLoop < newGroup.length; iLoop++) {
                //Se o número máximo de checkboxes ainda não tiver sido atingido, continua a verificação:
                if (newGroup[iLoop].lastElementChild.checked) {
                    Marcados++;
                }
                    
                if (Marcados < max) {
                //Habilitando todos os checkboxes, pois o máximo ainda não foi alcançado.
                    for (var j = 0; j < newGroup.length; j++) {
                        newGroup[j].lastElementChild.disabled = false;
                    }
                    //Caso contrário, desabilitar o checkbox;
                    //Nesse caso, é necessário percorrer todas as opções novamente, desabilitando as não checadas;
                    
                } else {
                    for (var k = 0; k < newGroup.length; k++) {
                        if(newGroup[k].lastElementChild.checked == false) {
                            newGroup[k].lastElementChild.disabled = true;
                        }
                    }
                }
            }
        }
    }
}

const addProduct = (quantity) => {
    var value = quantity.innerHTML
    value = parseInt(value, 10)
    value += 1
    quantity.innerHTML = value
}


const removeProduct = (quantity) => quantity.innerHTML > 1 ? quantity.innerHTML -= 1 : quantity

const quantityText = document.querySelector('#quantity')
const plusButton = document.querySelector('#plus-button')
const lessButton = document.querySelector('#less-button')


plusButton.addEventListener("click", () => {
    unities += 1
    addProduct(quantityText)
    updateSubTotal()
})

lessButton.addEventListener("click", () => {
    removeProduct(quantityText)
    if (unities > 1)
        unities -= 1
    updateSubTotal()
})

const backButton = document.querySelector('#back-button')
backButton.addEventListener("click", () => window.history.back())

const buyButton = document.querySelector('#add-to-buy')
buyButton.addEventListener("click", () => {
    window.alert("Produto adicionado no carrinho!")
    const groupsOptions = []
    let params = (new URL(document.location)).searchParams;
    let state = params.get("state");

    if (state === "aberto") {

        //params = (new URL(document.location)).searchParams;
        //let restaurante = params.get("restaurante");

        for (let i = 0; i < groupsElements.length; i++) {
            for (let j = 0; j < groupsElements[i].length; j++) {
                if (groupsElements[i][j].lastElementChild.checked) {
                    groupsOptions.push(Object.freeze({
                        id_complemento: groupsOptions.length + 1,
                        cod_complemento: parseInt(document.querySelectorAll('.cod_complemento')[i + j].innerHTML, 10),
                        nome_complemento: groupsElements[i][j].children[0].innerHTML,
                        vl_complemento: (() => {
                            if (groupsElements[i][j].lastElementChild.previousElementSibling.innerHTML[1] === "$") {
                                let el = groupsElements[i][j].lastElementChild.previousElementSibling.innerHTML
                                el = el.split(' ')[1]
                                el = el.replace(',', '.')
                                el = parseFloat(el)
                                return el
                            }
                            return 0.00
                        })(),
                        qtde_complemento: 1.00
                    }))
                }
            }
        }

        if (sessionStorage.hasOwnProperty('pedido'))   {

            if (JSON.parse(sessionStorage.pedido).restaurante === params.get('restaurante')) {
                let pedido = JSON.parse(sessionStorage.getItem('pedido'))
                pedido.pedido = [...pedido.pedido, Object.freeze({
                    id_produto: pedido.pedido.length + 1,
                    cod_produto: parseInt(document.querySelector('.cod_produto').innerHTML, 10),
                    nome_produto: document.querySelector("h1").innerHTML,
                    complementos: groupsOptions,
                    obs: document.querySelector('textarea').value,
                    vl_unitario: parseFloat(document.querySelector('.principal-price').innerHTML.replace(',', '.')),
                    vl_total: parseFloat(document.querySelector("#subTotal").innerHTML.replace(',', '.')),
                    qtde: parseFloat(quantityText.innerHTML),
                    tipo_pizza: false,
                    id_pizza: 0,
                    promocao: false,
                    unidade: document.querySelector('.unidade').innerHTML,
                    codigo_pesquisa: document.querySelector(".cod_pesquisa").innerHTML,
                    cod_grupo: parseInt(document.querySelector('.cod_grupo').innerHTML, 10)
                })]
                sessionStorage.setItem('pedido', JSON.stringify(pedido))
                console.log('adicionou outro produto')

            } else {
                produto = [Object.freeze({
                    id_produto: 1,
                    cod_produto: parseInt(document.querySelector('.cod_produto').innerHTML, 10),
                    nome_produto: document.querySelector("h1").innerHTML,
                    complementos: groupsOptions,
                    obs: document.querySelector('textarea').value,
                    vl_unitario: parseFloat(document.querySelector('.principal-price').innerHTML.replace(',', '.')),
                    vl_total: parseFloat(document.querySelector("#subTotal").innerHTML.replace(',', '.')),
                    qtde: parseFloat(quantityText.innerHTML),
                    tipo_pizza: false,
                    id_pizza: 0,
                    promocao: false,
                    unidade: document.querySelector('.unidade').innerHTML,
                    codigo_pesquisa: document.querySelector(".cod_pesquisa").innerHTML,
                    cod_grupo: parseInt(document.querySelector('.cod_grupo').innerHTML, 10)
                })]
                sessionStorage.setItem('pedido', JSON.stringify({restaurante: params.get("restaurante"), pedido: produto}))
                console.log('adicionou um produto pela primeira vez')
            }

        }
        else {
            produto = [Object.freeze({
                id_produto: 1,
                cod_produto: parseInt(document.querySelector('.cod_produto').innerHTML, 10),
                nome_produto: document.querySelector("h1").innerHTML,
                complementos: groupsOptions,
                obs: document.querySelector('textarea').value,
                vl_unitario: parseFloat(document.querySelector('.principal-price').innerHTML.replace(',', '.')),
                vl_total: parseFloat(document.querySelector("#subTotal").innerHTML.replace(',', '.')),
                qtde: parseFloat(quantityText.innerHTML),
                tipo_pizza: false,
                id_pizza: 0,
                promocao: false,
                unidade: document.querySelector('.unidade').innerHTML,
                codigo_pesquisa: document.querySelector(".cod_pesquisa").innerHTML,
                cod_grupo: parseInt(document.querySelector('.cod_grupo').innerHTML, 10)
            })]
            sessionStorage.setItem('pedido', JSON.stringify({restaurante: params.get("restaurante"), pedido: produto}))
            console.log('adicionou um produto pela primeira vez')
        }
    } else {
        window.alert("Restaurante está fechado!")
    }

    window.history.back();
})