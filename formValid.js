const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')

form.addEventListener('submit', (e) => {
 
    let messages = []

    if (password.value.length < 8){
        messages.push('Password must have at least 8 characters')
    }
    if (password.value.length > 16){
        messages.push('Password must be less than 16 characters')
    }

    if (messages.length > 0){
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
    }
});