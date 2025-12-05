const form = document.getElementById('loginForm');

form.addEventListener('submit', function(e){
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if(!username || !password){
        e.preventDefault(); // stop form submission
        alert("Please enter both username and password.");
    }
});
