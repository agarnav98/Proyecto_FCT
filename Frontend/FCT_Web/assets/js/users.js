// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

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
                    console.log("Error:", data.message);
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
        let userName = [];
        // Gets all companies
        Array.from(users).forEach(user => {
            userName[user.id] = [user.name, user.last_name, user.cv];
        });
        // Creates user table
        new DataTable("#users", {
            dom: 'Bfrtip',
            // Table buttons
            buttons: [
                {
                    text: 'Añadir usuario',
                    action: function () {
                        window.location.href = NEW_USER_PAGE;
                    },
                },
                {
                    extend: 'collection',
                    text: 'Filtrar rol',
                    buttons: [
                        {
                            text: 'Docente',
                            action: function (e, dt) {
                                dt.columns(3).search('Docente').draw();
                                dt.columns(11).search('').draw();
                            }
                        },
                        {
                            text: 'Alumno',
                            action: function (e, dt) {
                                dt.columns(3).search('Alumno').draw();
                                dt.columns(11).search('').draw();
                            }
                        },
                    ]
                },
                {
                    extend: 'collection',
                    text: 'Filtrar candidatura',
                    buttons: [
                        {
                            text: ACCEPTED_CANDIDACIES,
                            action: function (e, dt) {
                                dt.columns(11).search('Aceptado').draw();
                                dt.columns(3).search('').draw();
                            }
                        },
                        {
                            text: PENDING_CANDIDACIES,
                            action: function (e, dt) {
                                dt.columns(11).search('En espera').draw();
                                dt.columns(3).search('').draw();
                            }
                        },
                        {
                            text: DENIED_CANDIDACIES,
                            action: function (e, dt) {
                                dt.columns(11).search('Denegado').draw();
                                dt.columns(3).search('').draw();
                            }
                        },
                    ]
                },
                {
                    text: 'Limpiar filtros',
                    action: function (e, dt) {
                        dt.columns().search('').draw();
                    },
                },
                {
                    text: 'Recargar lista',
                    action: function () {
                        window.location.reload();
                    },
                },
            ],
            data: users,
            columns: [
                { title: "Nombre", data: "name" },
                { title: "Apellidos", data: "last_name" },
                { title: "DNI", data: "dni" },
                { title: "Rol", data: "role.role", name: "role" },
                { title: "Correo electrónico", data: "email" },
                { title: "Teléfono", data: "mobile" },
                { title: "Dirección", data: "address", render: (data) => { if (data == "") { return EMPTY_ICON } else { return data } } },
                { title: "Localidad", data: "town", render: (data) => { if (data == "") { return EMPTY_ICON } else { return data } } },
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
                { title: "Preferencias", data: "preferences", render: (data) => { if (data == "") { return EMPTY_ICON } else { return data } } },
                {
                    title: "CV",
                    data: "id",
                    render: (data) => {
                        if (userName[data][2] != null) {
                            return `<a class="link rounded" onclick="downloadCV(${data}, '${userName[data][0]}', '${userName[data][1]}')">${DOWNLOAD_ICON}</a>`;
                        }
                    }
                },
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
                            Array.from(data).forEach(status => {
                                statusCandidacies.push(status.status);
                            });
                            if (statusCandidacies.includes(1)) {
                                return ACCEPTED_CANDIDACIES;
                            }
                            else if (statusCandidacies.includes(null)) {
                                return PENDING_CANDIDACIES;
                            }
                            else {
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
                        return `<a href="${USER_SHOW_PAGE}?id=${data}" class="link rounded mx-2">${EDIT_ICON}</a>
                        <a class="link rounded" onclick="deleteUser(${data}, ${true})">${DELETE_ICON}</a>`;
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
                    targets: 12,
                    searchable: false,
                },
                // Responsive columns priority
                { responsivePriority: 1, targets: 0 },
                { responsivePriority: 2, targets: 1 },
                { responsivePriority: 3, targets: 12 },
                { responsivePriority: 4, targets: 11 },
                { responsivePriority: 5, targets: 10 },
                { responsivePriority: 10001, targets: 9 }
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
