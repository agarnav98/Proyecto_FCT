// If the role_id is not 1, redirect to login
getRole().then(role_id => {
    if (role_id != 1) {
        window.location.href = LOGIN_PAGE;
    }
});

/**
 * Get users list
 *
 * @return {Promise} userList
 */
function users() {
    let users = [];
    // API get user data request
    return new Promise((resolve, reject) =>
    (fetch(`${API_BASE_URL}users`, {
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
        // Get JSON response
        .then(response => response.json())
        .then(data => {
            // If status is true, return users list
            if (data.status) {
                for (let user of data.users) {
                    users.push([
                        `${user.name} ${user.last_name}`,
                        user.dni,
                        user.role.role,
                        user.email,
                        user.mobile,
                        `${user.address}, ${user.town}`,
                        user.birth,
                        user.preferences,
                        user.cv
                    ])
                }
                return resolve(users);
            } else {
                // Show error message
                console.log('Error:', error);
                return resolve(null);
            }
        })
        // Show API request error
        .catch((error) => {
            console.error('Error:', error);
            return reject(error)
        })))
        
}


window.addEventListener("DOMContentLoaded", () => {
    users().then(users => {
        new DataTable('#users', {
            data: users,
            columns: [
                { title: 'Nombre' },
                { title: 'DNI' },
                { title: 'Rol' },
                { title: 'Correo electrónico' },
                { title: 'Teléfono' },
                { title: 'Dirección' },
                { title: 'Fecha Nacimiento' },
                { title: 'Preferencias' },
                { title: 'CV' }
            ],
            "language": {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            },
            lengthChange: false,
            pageLength: 15,
        });
    });
});