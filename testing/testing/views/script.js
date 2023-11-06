// script.js
async function login() {
    const id = document.getElementById("id").value;
    const pass = document.getElementById("pass").value;
    const response = await fetch(`/login?id=${id}&pass=${pass}`);
    const data = await response.json();
    if (data.success) {
        document.getElementById("loginStatus").innerHTML = "Login successful.";
        checkAuthentication();
    } else {
        document.getElementById("loginStatus").innerHTML = "Login failed.";
    }
}

async function checkAuthentication() {
    const response = await fetch('/check');
    const data = await response.json();
    if (data.success) {
        if (data.requires2FA) {
            // Implement logic for 2FA
            const response2FA = await fetch('/2fa');
            const data2FA = await response2FA.json();
            if (data2FA.success) {
                // Implement logic for successful 2FA
            } else {
                // Implement logic for failed 2FA
            }
        } else {
            // Implement logic for authenticated user without 2FA
        }
    } else {
        // Implement logic for unauthenticated user
    }
}

async function logout() {
    const response = await fetch('/logout');
    const data = await response.json();
    if (data.success) {
        // Implement logic for successful logout
    } else {
        // Implement logic for failed logout
    }
}
