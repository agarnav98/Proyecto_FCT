// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

// Candidacies status icons
const EMPTY_CANDIDACIES = `<span class="with-icon--before me-1">${EMPTY_ICON}</span>Sin candidaturas`;
const ACCEPTED_CANDIDACIES = `<span class="with-icon--before me-1">${ACCEPTED_ICON}</span>Aceptado`;
const PENDING_CANDIDACIES = `<span class="with-icon--before me-1">${PENDING_ICON}</span>En espera`;
const DENIED_CANDIDACIES = `<span class="with-icon--before me-1">${DENIED_ICON}</span>Denegado`;

/**
 * Get users list
 *
 * @return {Promise} userList
 */
function users() {
    // API get user data request
    return new Promise((resolve, reject) =>
        fetch(`${API_BASE_URL}users`, {
            method: "GET",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            // Get JSON response
            .then((response) => response.json())
            .then((data) => {
                // If status is true, return users list
                if (data.status) {
                    return resolve(data.users);
                } else {
                    // Show error message
                    console.log("Error:", error);
                    return resolve(null);
                }
            })
            // Show API request error
            .catch((error) => {
                console.error("Error:", error);
                return reject(error);
            })
    );
}

window.addEventListener("DOMContentLoaded", () => {
    users().then((users) => {
        // Creates user table
        new DataTable("#users", {
            dom: '<"btn-add">frtip',
            fnInitComplete: function(){
               $('div.btn-add').html('<a type="button" id="btn-add" class="btn btn-outline-dark mb-1" href="newUser.html">Añadir Usuario</a>');
            },
            data: users,
            columns: [
                { title: "Nombre", data: "name" },
                { title: "Apellidos", data: "last_name" },
                { title: "DNI", data: "dni" },
                { title: "Rol", data: "role.role" },
                { title: "Correo electrónico", data: "email" },
                { title: "Teléfono", data: "mobile" },
                { title: "Dirección", data: "address" },
                { title: "Localidad", data: "town" },
                {
                    title: "Fecha nacimiento",
                    data: "birth",
                    // Changes date format
                    render: (data, type) => {
                        if (data != null) {
                            let dateSplit = data.split('-');
                            return type === "display" || type === "filter" ?
                                dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0] :
                                data;
                        }
                    }
                },
                { title: "Preferencias", data: "preferences" },
                { title: "CV", data: "cv" },
                {
                    title: "Estado candidaturas",
                    data: "candidacies",
                    // Show general candidacies status
                    render: (data) => {
                        statusCandidacies = [];
                        if (data.length == 0) {
                            return EMPTY_CANDIDACIES;
                        }
                        else {
                            // Checks all candidacies status
                            for (let status of data) {
                                statusCandidacies.push(status.status);
                            }
                            if (statusCandidacies.includes(1)) {
                                return ACCEPTED_CANDIDACIES;
                            }
                            else if (statusCandidacies.includes(null)){
                                return PENDING_CANDIDACIES;
                            }
                            else{
                                return DENIED_CANDIDACIES;
                            }
                        }
                    }
                },
                {
                    title: "Acciones",
                    data: "id",
                    // Show edit icon and delete icon
                    render: (data) => {
                        return `<a href="${USER_SHOW}?id=${data}" class="link rounded mx-2">${EDIT_ICON}</a>
                        <a class="link rounded" onclick="deleteUser(${data})">${DELETE_ICON}</a>`;
                    },
                },
            ],
            columnDefs: [
                {
                    // Show empty icon for default content
                    targets: "_all",
                    defaultContent: EMPTY_ICON,
                },
                {
                    // Columns we don't want to be sorted
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    orderable: false,
                },
                {
                    // Columns we don't want to be searchable
                    targets: 9,
                    searchable: false,
                },
            ],
            // Table language
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
            },
            // Row number
            lengthChange: false,
            pageLength: 15,
        });
    });
    // Finally, removes loading animation
    removeLoading();
});
