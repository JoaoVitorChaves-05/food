const restaurantes = document.querySelectorAll(".item-restaurant")
restaurantes.forEach(item => item.addEventListener('click', () => {
    window.location.href += item.childNodes[3].childNodes[1].innerHTML
    console.log(window.location.href)
}))