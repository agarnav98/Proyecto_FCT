// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {
    // Finally, removes loading animation
    removeLoading();
});