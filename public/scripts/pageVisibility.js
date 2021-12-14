document.addEventListener("visibilitychange", () => {
    console.log("teste visibilidade")
    if(document.visibilityState==="hidden") {
        console.log(" >> This window is hidden")
        //document.body.style.display="none"
        setTimeout(()=>{
            if (sessionStorage.pedido) {
                let pedido = JSON.parse(sessionStorage.pedido)
                if (pedido.length > 0) {
                    sessionStorage.pedido = JSON.stringify([])
                    alert("Muito tempo de inatividade! Refaça os pedidos, por favor.")
                    renderItems()
                }
            }
        }, 3000)
    }
    else {
        console.log(" >> This window is visible")
    }
})