const input:HTMLInputElement = (<HTMLInputElement>document.getElementById("bot-token"))
const output:HTMLInputElement = (<HTMLInputElement>document.getElementById("bot-token-out"))
const okButton:HTMLInputElement = (<HTMLInputElement>document.getElementById("bot-token-ok"))

okButton.addEventListener("click", (e) => {
    fetch("https://api.telegram.org/bot"+input.value+"/getMe").then(r => r.json()).then( v =>
        output.textContent = JSON.stringify(v)
    )
})