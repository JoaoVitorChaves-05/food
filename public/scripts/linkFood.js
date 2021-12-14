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
confirmButton.addEventListener("click", () => {
    if (validateForm() === false) 
        return 

    const state = document.querySelector("#state")

    if (sessionStorage.pedido && JSON.parse(sessionStorage.pedido)[0] != null) {
        if (state.innerHTML === "aberto") {
            let pedido = JSON.parse(sessionStorage.pedido)
            let message = ``
            
            for (let i = 0; i < pedido.length; i++) {
                message += "Nome do produto: " + pedido[i].name + "%0A"
                for (let j = 0; j < pedido[i].groupsOptions.length; j++) {
                    message += pedido[i].groupsOptions[j].name + ": " + `${pedido[i].groupsOptions[j].value}` + "%0A"
                }
                message += "Unidades: " + pedido[i].unities + "%0A"
                message += "Informações adicionais: " + pedido[i].additionalInfo + "%0A"
                message += "Valor do produto: " + pedido[i].value + "%0A"
                message += "%0A"
            }

            let form = document.forms["userInfo"]

            message += "*Informações do cliente*%0A"

            for (let k = 0; k < form.length - 1; k++) {
                message += form[k].name + ": " + form[k].value + "%0A"
            }

            let payment = (() => {
                for ( var i = 0 ; i < form[9].length; i++ ) {
                    opt = form[9][i];
                    if (opt.selected === true) {
                        break;
                    }
                }
                return opt;
            })()

            message += "Método de pagamento: " + payment.value + "%0A" + "%0A"

            message += "Aguarde a confirmação do estabelecimento e o cálculo do frete"

            window.location.href = "https://wa.me/5512997932718?text=" + message
            sessionStorage.setItem('pedido', JSON.stringify([]))
            updateStateModal(false)
        } else {
            window.alert("O Restaurante está fechado!")
        }
    } else {
        window.alert("Adicione algum produto na sacola!")
        updateStateModal(false)
    }
    
})