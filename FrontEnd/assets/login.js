document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault(); // Prevent default form behaviour

// Get values from form
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
    // Send forms value to api for verification
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    if (!response.ok) {
            // Unauthorized error, wrong credentials
            window.alert("Email ou mot de passe invalide.");
    }
    // Collect answer from api (token) and on success send to index.html
    const data = await response.json();
    
    if (data.token) {
        localStorage.setItem("loginToken", data.token);
        console.log("Token received", data.token);
        localStorage.setItem("userId", data.userId);
        console.log("userId received", data.userId);
        window.location.href = "./index.html";
    } 
    else {
        console.error("Token not received", data);
    }
    } 
    catch (error) {
        console.error("Fetch error", error);
    }
});