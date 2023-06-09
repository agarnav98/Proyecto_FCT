// If the role_id is not 1, redirect to login
getRole().then((role_id) => {
    if (role_id != 1) {
        window.location.replace(LOGIN_PAGE);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    companies().then((companies) => {
        // Creates user table
        new DataTable("#companies", {
            dom: 'Bfrtip',
            // Table buttons
            buttons: [
                {
                    text: 'Añadir empresa',
                    action: function () {
                        window.location.href = NEW_COMPANY_PAGE;
                    },
                },
                {
                    text: 'Recargar lista',
                    action: function () {
                        window.location.reload();
                    },
                },
            ],
            data: companies,
            columns: [
                { title: "Nombre", data: "name" },
                { title: "CIF", data: "cif" },
                { title: "Correo electrónico", data: "email" },
                {
                    title: "Sede principal",
                    data: "headquarters",
                    render: (data) => {
                        if (data.length == 0) {
                            return EMPTY_HEADQUARTERS;
                        }
                        else {
                            return `${data[0].name}`;
                        }
                    }
                },
                {
                    title: "Teléfono",
                    data: "headquarters",
                    render: (data) => {
                        if (data.length == 0) {
                            return EMPTY_ICON;
                        }
                        else {
                            return `${data[0].mobile}`;
                        }

                    }
                },
                {
                    title: "Dirección",
                    data: "headquarters",
                    render: (data) => {
                        if (data.length == 0) {
                            return EMPTY_ICON;
                        }
                        else {
                            return `${data[0].address}`;
                        }

                    }
                },
                {
                    title: "Localidad",
                    data: "headquarters",
                    render: (data) => {
                        if (data.length == 0) {
                            return EMPTY_ICON;
                        }
                        else {
                            return `${data[0].town}`;
                        }

                    }
                },
                {
                    title: "Acciones",
                    data: "id",
                    // Show edit icon and delete icon
                    render: (data) => {
                        return `<a href="${COMPANY_SHOW_PAGE}?id=${data}" class="link rounded mx-2">${EDIT_ICON}</a>
                        <a class="link rounded" onclick="deleteCompany(${data}, ${true})">${DELETE_ICON}</a>`;
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
                    targets: [1, 2, 3, 4, 5, 6, 7],
                    orderable: false,
                },
                {
                    // Columns we don't want to be searchable
                    targets: 7,
                    searchable: false,
                },
                // Responsive columns priority
                { responsivePriority: 1, targets: 0 },
                { responsivePriority: 2, targets: 1 },
                { responsivePriority: 3, targets: 7 },
                { responsivePriority: 4, targets: 2},
                { responsivePriority: 10001, targets: 5 }
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
