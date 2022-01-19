let valueOfOptions = 0.00
const initialValue = document.querySelector(".principal-price")
let unities = parseFloat(document.querySelector('#quantity').innerHTML)

let subTotal = (parseFloat(initialValue.innerHTML.replace(',', '.')) + valueOfOptions) * unities

function updateSubTotal() {
    subTotal = (parseFloat(initialValue.innerHTML.replace(',', '.')) + valueOfOptions) * unities
    const subTotalElement = document.querySelector('#subTotal')
    subTotal = subTotal.toFixed(2)
    subTotal = subTotal.replace('.', ',')
    subTotalElement.innerHTML = subTotal
}

const checkboxesState = (() => {
    let list = []

    document.querySelectorAll("input").forEach(e => {
        list.push({
            id: '',
            state: e.checked,
            value: (() => {
                if (e.parentNode.parentNode.children[1].classList.contains('price')) {
                    return parseFloat(e.parentNode.parentNode.children[1].innerHTML.split(' ')[1].replace(',', '.'))
                }
                return 0.00
            })()
        })
    })

    return list
})()

function setGroupID() {
    let groups = document.querySelectorAll(".group-options")
    for (let i = 0; i < groups.length; i++) {
        groups[i].id = 'G'+ i
    }
}

function setCheckboxesID() {
    let checkboxes = document.querySelectorAll('input')
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxesState[i].id = i
        checkboxes[i].id = i
        checkboxesState[i].name = checkboxes[i].parentNode.parentNode.children[0].innerHTML
        checkboxesState[i].value = checkboxes[i].parentNode.parentNode.children[1].classList.contains('price') ? parseFloat(checkboxes[i].parentNode.parentNode.children[1].innerHTML.split(' ')[1].replace(',', '.')) : 0.00
    }
}

setGroupID()
setCheckboxesID()

function updateCheckboxesState() {
    let AllCheckboxes = document.querySelectorAll(`input`)
    checkboxesState.forEach(checkbox => {
        AllCheckboxes.forEach(e => {
            if (checkbox.id == e.id) {
                e.checked = checkbox.state
            }
        })
    })
}


function verificar(clicked) {

    let groupID = clicked.parentNode.parentNode.parentNode.parentNode.id
    let maxOptions = clicked.parentNode.parentNode.parentNode.parentNode.children[0].children[2].innerHTML.split(' ')[4][0]
    let checkboxArea = clicked.parentNode
    let options = clicked.parentNode.parentNode.parentNode.children

    let AllCheckboxes = document.querySelectorAll(`input`)

    if (clicked.checked === false) {

        AllCheckboxes.forEach(e => {
            if (e.id == clicked.id) {
                checkboxesState.forEach(checkbox => {
                    if (clicked.id == checkbox.id) {
                        checkbox.state = false
                        let value = checkbox.value
                        valueOfOptions -= value
                        updateSubTotal()
                    }
                        
                })
            }
        })

        updateCheckboxesState()
    }

    if (clicked.checked) {
        AllCheckboxes.forEach(e => {
            if (e.id == clicked.id) {
                checkboxesState.forEach(checkbox => {
                    if (clicked.id == checkbox.id) {
                        let value = checkbox.value
                        valueOfOptions += value
                        checkbox.state = true
                        updateSubTotal()
                    }   
                })
            }
        })

        if (maxOptions > 1) {
            checkboxArea.innerHTML += `<input type="checkbox" id="${checkboxesState.length}" value="${clicked.value}" name="option 1" onchange="verificar(this)">`
            checkboxesState.push({
                id: checkboxesState.length, 
                state: false,
                value: (() => {
                    let value = 0.00
                    AllCheckboxes.forEach(e => {
                        if (e.id == clicked.id) {
                            checkboxesState.forEach(checkbox => {
                                if (clicked.id == checkbox.id)
                                    value = checkbox.value
                            })
                        }
                    })
                    return value
                })(),
                name: (() => {
                    let name = ''
                    AllCheckboxes.forEach(e => {
                        if (e.id == clicked.id) {
                            checkboxesState.forEach(checkbox => {
                                if (clicked.id == checkbox.id)
                                    name = checkbox.name
                            })
                        }
                    })
                    return name
                })()
            })
        }

        updateCheckboxesState()
    }



    let checkeds = 0

    let checkboxes = document.querySelectorAll(`#${groupID} input`)

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkeds++
        }

        if (checkeds < maxOptions) {
            for (let j = 0; j < checkboxes.length; j++) {
                checkboxes[j].disabled = false
            }
        } else {
            for (let k = 0; k < checkboxes.length; k++) {
                if (checkboxes[k].checked == false)
                    checkboxes[k].disabled = true
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

function validaPedido() {
    let groups = document.querySelectorAll('.group-options')
    let groupsRequireds = [...groups].filter(group => group.children[0].children[2].classList.contains('required'))
    
    for (let i = 0; i < groupsRequireds.length; i++) {
        let options = document.querySelectorAll(`#${groupsRequireds[i].id} input`)
        let minOptions = document.querySelector(`#${groupsRequireds[i].id} .minimoComplemento`).innerHTML

        let checkeds = 0
        options.forEach(option => {
            if (option.checked)
                checkeds++
        })

        if (checkeds < minOptions) return false
    }
    
    return true
}

const buyButton = document.querySelector('#add-to-buy')
buyButton.addEventListener("click", () => {
    if (validaPedido()) {
            
        const groupsOptions = []
        let params = (new URL(document.location)).searchParams;
        let state = params.get("state");

        if (state === "aberto") {

            window.alert("Produto adicionado no carrinho!")
            const complementsList = (() => {

                let list = []

                checkboxesState.forEach(checkbox => {
                    if (checkbox.state) {
                        if ((() => {
                            for (let i = 0; i < list.length; i++) {
                                if (checkbox.name === list[i])
                                    return false
                            }
                            return true
                        })()) {
                            list.push(checkbox.name)
                        }
                    }
                })

                return list
            })()

            console.log(complementsList)

            

            for (let i = 0; i < complementsList.length; i++) {
                groupsOptions.push(Object.freeze({
                    id_complemento: groupsOptions.length + 1,
                    cod_complemento: (() => {
                        let list = document.querySelectorAll('.cod_complemento')
                        let complemento = complementsList[i]

                        for (let j = 0; j < list.length; j++) {
                            if (list[j].innerHTML.split(':')[1] === complemento) {
                                return parseInt(list[j].innerHTML.split(':')[0], 10)
                            }
                        }
                        
                    })(), //parseInt(document.querySelectorAll('.cod_complemento')[i + j].innerHTML, 10),
                    nome_complemento: complementsList[i],
                    vl_complemento: (() => {
                        for (let j = 0; j < checkboxesState.length; j++) {
                            if (checkboxesState[j].state && checkboxesState[j].name === complementsList[i]) {
                                return checkboxesState[j].value
                            }
                        }
                    })(),
                    qtde_complemento: (() => {
                        let qtde = 0
                        for (let k = 0; k < checkboxesState.length; k++) {
                            if (checkboxesState[k].state && checkboxesState[k].name === complementsList[i])
                                qtde++
                        }
                        return qtde
                    })()
                }))
            }

            console.log(groupsOptions)

            if (sessionStorage.hasOwnProperty('pedido'))   {

                if (JSON.parse(sessionStorage.pedido).restaurante === params.get('restaurante')) {
                    let pedido = JSON.parse(sessionStorage.getItem('pedido'))
                    pedido.pedido = [...pedido.pedido, Object.freeze({
                        id_produto: pedido.pedido.length + 1,
                        cod_produto: parseInt(document.querySelector('.cod_produto').innerHTML, 10),
                        nome_produto: document.querySelector("#nome_produto").innerHTML,
                        complementos: groupsOptions,
                        obs: document.querySelector('textarea').value,
                        vl_unitario: parseFloat(document.querySelector('.principal-price').innerHTML.replace(',', '.')),
                        vl_total: parseFloat(document.querySelector("#subTotal").innerHTML.replace(',', '.')),
                        qtde: parseFloat(quantityText.innerHTML),
                        tipo_pizza: document.querySelector(".tipo_pizza").innerHTML === 'true' ? true : false,
                        id_pizza: 0,
                        promocao: document.querySelector(".promocao").innerHTML === 'true' ? true : false,
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
                        nome_produto: document.querySelector("#nome_produto").innerHTML,
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
                    nome_produto: document.querySelector("#nome_produto").innerHTML,
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
    }
    else {
        alert("Preencha o(s) campo(s) obrigatório(s)!")
    }
})