const additionalPrices = document.querySelectorAll('.price')
additionalPrices.forEach(price => {
    let value = price.innerHTML.split(' ')[1]
    value = parseFloat(value)
    value = value.toFixed(2)
    value = value.replace('.', ',')
    price.innerHTML = 'R$ ' + value
})

const principalPrice = document.querySelectorAll('.principal-price')
principalPrice.forEach(price => {
    console.log(principalPrice.innerHTML)
    let value = price.innerHTML
    value = parseFloat(value)
    value = value.toFixed(2)
    value = value.replace('.', ',')
    price.innerHTML = value
})

const subTotalHTML = document.querySelectorAll('#subTotal')
subTotalHTML.forEach(price => {
    let value = price.innerHTML
    value = parseFloat(value)
    value = value.toFixed(2)
    value = value.replace('.', ',')
    price.innerHTML = value
})