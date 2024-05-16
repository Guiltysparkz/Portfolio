document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault(); // Prevent default form behaviour

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
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
        throw new Error(`Network error ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.token) {
        localStorage.setItem("loginToken", data.token);
        console.log("Token received", data.token);
        window.location.href = "index.html";
    } 
    else {
        console.error("Token not received", data);
    }
    }
catch (error) {
        console.error("Fetch error", error);
    }
});