import fetch from "node-fetch";

const dados = async () => {
    let teste = await fetch('https://bb4f-200-170-124-158.ngrok.io/api/menu/bar/123')
    .then(response => response.json())
    .then(response => console.log(response))

    return teste
}

dados()