const restaurantes = document.querySelectorAll(".item-restaurant")
restaurantes.forEach(item => item.addEventListener('click', () => {
    window.location.href += item.children[2].innerHTML
}))