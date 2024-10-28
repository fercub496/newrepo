const togglePassword = document.querySelector('#togglePassword')
    const passwordInput = document.querySelector('#password')

    togglePassword.addEventListener('click', function (e) {
        e.preventDefault(); 
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show Password' : 'Hide Password'
    });

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input')
    
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            if (input.checkValidity()) {
                input.classList.remove("invalid")
                input.classList.add("valid")
            } else {
                input.classList.remove("valid")
                input.classList.add("invalid")
            }
        })
    })
})
