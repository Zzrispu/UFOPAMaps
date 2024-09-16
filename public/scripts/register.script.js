const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pwInput = document.getElementById('password');
    const c_pwInput = document.getElementById('c-password');

    if (c_pwInput.value !== pwInput.value) {
        const pwSpan = document.getElementById('pwSpan');
        return pwSpan.style.visibility = 'visible';
    };

    const data = Object.fromEntries(new FormData(form).entries());

    await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(result => result.json())
    .then((data) => {
        if (data.existentUser == true) {
            const userSpan = document.getElementById('userSpan');
            return userSpan.style.visibility = 'visible';
        }
        else {
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});