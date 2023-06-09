// If the role_id is not 2, redirect to login
getRole().then((role_id) => {
    if (role_id != 2) {
        window.location.replace(LOGIN_PAGE);
    }
});

// When loading the html, the script will be executed
window.addEventListener("DOMContentLoaded", () => {
    const id = new URLSearchParams(window.location.search).get("id");

    // Form elements
    const name = document.getElementById("name");
    const cif = document.getElementById("cif");
    const email = document.getElementById("email");

    getCompany(id).then((company) => {
        if (company == "User does not have permission") {
            window.location.replace(ALUMNO_PAGE);
        }
        else {
            // Sets the company data in the form
            name.value = company.name;
            cif.value = company.cif;
            email.value = company.email;

            // Creates headquarters table
            new DataTable("#headquarters", {
                dom: 'frtip',
                data: company.headquarters,
                columns: [
                    { title: "Sede", data: "name" },
                    { title: "Teléfono", data: "mobile" },
                    { title: "Dirección", data: "address" },
                    { title: "Localidad", data: "town" },
                ],
                columnDefs: [
                    {
                        // Columns we don't want to be sorted
                        targets: [1, 2, 3],
                        orderable: false,
                    },
                ],
                // Table language
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
                },
                // Row number
                lengthChange: false,
                pageLength: 3,
            });
        }
    });
    // Finally, removes loading animation
    removeLoading();

});