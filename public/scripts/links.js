const links = document.querySelectorAll(".item")

console.log(links)

const urls = [
    {
        name: "Restaurantes",
        url: "http://www.dkfood.com/"
    },
    {
        name: "Sacola",
        url: "http://www.dkfood.com/sacola"
    },
    {
        name: "Trabalhe conosco",
        url: "http://www.dkfood.com/trabalhe-conosco"
    }
]

links[0].addEventListener("click", () => {
    window.location.href = urls[0].url
})

links[1].addEventListener("click", () => {
    window.location.href = urls[1].url
})

links[2].addEventListener("click", () => {
    window.location.href = urls[2].url
})

const restaurantes = document.querySelectorAll(".item-restaurant")
restaurantes.forEach(item => item.addEventListener('click', () => {
    window.location.href = 'http://192.168.15.21:3000/' + item.childNodes[3].childNodes[1].innerHTML.toLowerCase()
    console.log(window.location.href)
}))