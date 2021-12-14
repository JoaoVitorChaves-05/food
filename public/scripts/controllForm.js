const validateForm = () => {
    let inputs = document.forms["userInfo"]
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "" && i !== 6) {
            alert("Ainda faltam dados!")
            return false
        }
        if (i === 9) {
            const selected = (() => {
                for ( var i = 0 ; i < inputs[9].length; i++ ) {
                    opt = inputs[9][i];
                    if (opt.selected === true) {
                        break;
                    }
                }
                return opt;
            })()
            if (selected.value !== null) {
                return true;
            } else {
                alert("Ainda faltam dados!")
                return false
            }
        }
    }
}