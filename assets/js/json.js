// loading and show the table
function loadTable(CountryName = '') {

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Countries?CountryName_like=${CountryName}`);
    xhttp.send();//sending the request
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = "";
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += "<tr>";
                trHTML += "<td>" + object["id"] + "</td>";
                trHTML += "<td>" + object["CountryName"] + "</td>";
                trHTML += "<td>" + object["Capital"] + "</td>";
                trHTML += "<td>" + object["Continent"] + "</td>";
                trHTML += "<td>" + object["Population"] + "</td>";
                trHTML +=
                    '<td><img width="50px" src="' +
                    object["FlagImage"] +
                    '" class="FlagImage"></td>';
                trHTML +=
                    '<td><button type="button" class="btn btn-outline-warning" onclick="showUserEditBox(' +
                    object["id"] +
                    ')"><i class="fa-solid fa-pen-to-square"></i></button>';
                trHTML +=
                    '<button type="button" class="btn btn-outline-danger ms-2" onclick="userDelete(' +
                    object["id"] +
                    ')"><i class="fa-solid fa-trash-can"></i></button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}
loadTable();

// searching
function search() {
    const CountryName = document.getElementById("searchvalue").value;
    loadTable(CountryName);
}

// creating new record
function showUserCreateBox() {
    Swal.fire({
        title: "Create country",
        html:
            '<input id="id" type="hidden">' +
            '<input id="CountryName" class="swal2-input" placeholder="CountryName">' +
            '<input id="Capital" class="swal2-input" placeholder="Capital">' +
            '<select id="Continent" class="swal2-input" style="width:270px";><option>select continent</option><option>Africa</option><option>Antarctica</option><option>Asia</option><option>Australia </option><option>Europe</option><option>North America</option><option>South America</option>' +
            '<input id="Population" class="swal2-input" placeholder="Population" style="width:270px";>' +
            '<input id="FlagImage" type="file" class="swal2-input" style="width:270px";>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const CountryName = document.getElementById("CountryName").value;
            const Capital = document.getElementById("Capital").value;
            const Continent = document.getElementById("Continent").value;
            const Population = document.getElementById("Population").value;
            const FlagImage = document.getElementById("FlagImage").value;
            const pattern = /^[0-9,]+$/;


            if (!CountryName || !Capital || !Continent || !Population || !FlagImage) {
                Swal.showValidationMessage("Please fill in all the fields");
            } else if (!pattern.test(Population)) {
                Swal.showValidationMessage("Population only contains numbers and comma")
            } else if (Population <= 0) {
                Swal.showValidationMessage(" Population must not be negative");
            } else if (!/^[a-zA-Z\s]+$/.test(CountryName) || !/^[a-zA-Z\s]+$/.test(Capital) || !/^[a-zA-Z\s]+$/.test(Continent)) {
                Swal.showValidationMessage("Country name and Capital name must contain only letters and spaces");
            } else {
                userCreate();
            }
        },
    });

}

// creating and displaying new record
function userCreate() {
    const CountryName = document.getElementById("CountryName").value;
    const Capital = document.getElementById("Capital").value;
    const Continent = document.getElementById("Continent").value;
    const Population = document.getElementById("Population").value;
    const FlagImageInput = document.getElementById("FlagImage");
    const FlagImage = FlagImageInput.files[0];
    const xhttp = new XMLHttpRequest();
    if (FlagImage) {
        const reader = new FileReader();
        reader.onload = function () {
            const dataUrl = reader.result;
            console.log(dataUrl);
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire({
                        title: 'Country added succesfully',
                        icon: 'success'
                    });
                    loadTable();
                }
            };
            xhttp.open("POST", "http://localhost:3000/Countries");
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(
                JSON.stringify({
                    CountryName: CountryName,
                    Capital: Capital,
                    Continent: Continent,
                    Population: Population,
                    FlagImage: dataUrl,
                })
            );
        };
        reader.readAsDataURL(FlagImage);
    } else {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const objects = JSON.parse(this.responseText);
                Swal.fire({
                    title: 'Country added succesfully',
                    icon: 'success'
                });
                loadTable();
            }
        };
        xhttp.open("POST", "http://localhost:3000/Countries");
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(
            JSON.stringify({
                CountryName: CountryName,
                Capital: Capital,
                Continent: Continent,
                Population: Population,
                FlagImage: null,
            })
        );

    };
}

function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Countries/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            //const user = objects["objects"];
            console.log(objects);
            Swal.fire({
                title: "Edit Country",
                html:
                    '<input id="id" type="hidden" value="' +
                    objects[`${id}`] +
                    '">' +
                    '<input id="CountryName" class="swal2-input" placeholder="CountryName" value="' +
                    objects["CountryName"] +
                    '">' +
                    '<input id="Capital" class="swal2-input" placeholder="Capital" value="' +
                    objects["Capital"] +
                    '">' +
                    '<select id="Continent" class="swal2-input" style="width:270px";><option>select continent</option><option>Africa</option><option>Antarctica</option><option>Asia</option><option>Australia </option><option>Europe</option><option>North America</option><option>South America</option>' + "<br>" +

                    '<input id="Population" class="swal2-input" placeholder="Population" value="' +
                    objects["Population"] +
                    '">' +
                    '<input id="FlagImage" style="width:270px"; type="file" class="swal2-input" placeholder="FlagImage" value="' +
                    objects["FlagImage"] +
                    '">'
                ,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                preConfirm: () => {
                    const CountryName = document.getElementById("CountryName").value;
                    const Capital = document.getElementById("Capital").value;
                    const Continent = document.getElementById("Continent").value;
                    const Population = document.getElementById("Population").value;
                    const FlagImage = document.getElementById("FlagImage").value;
                    const pattern = /^[0-9,]+$/;


                    if (!CountryName || !Capital || !Continent || !Population || !FlagImage) {
                        Swal.showValidationMessage("Please fill in all the fields");

                    } else if (!pattern.test(Population)) {
                        Swal.showValidationMessage("Population only contains numbers and comma")
                    } else if (Population <= 0) {
                        Swal.showValidationMessage(" Population must not be negative");
                    } else if (!/^[a-zA-Z\s]+$/.test(CountryName) || !/^[a-zA-Z\s]+$/.test(Capital) || !/^[a-zA-Z\s]+$/.test(Continent)) {
                        Swal.showValidationMessage("Country name and Capital name a must contain only letters and spaces");
                    } else {
                        userEdit(id);
                    }
                },
            });
        }
    };
}

function userEdit(id) {
    //const id = document.getElementById("id").value;
    const CountryName = document.getElementById("CountryName").value;
    const Capital = document.getElementById("Capital").value;
    const Continent = document.getElementById("Continent").value;
    const Population = document.getElementById("Population").value;
    const FlagImageInput = document.getElementById("FlagImage");
    const FlagImage = FlagImageInput.files[0];
    const xhttp = new XMLHttpRequest();
    console.log("useredit --1")
    xhttp.open("PUT", `http://localhost:3000/Countries/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (FlagImage) {
        const reader = new FileReader();
        console.log(reader);
        reader.onload = function () {
            const dataUrl = reader.result;
            console.log(dataUrl);
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire({
                        icon: "success",
                        title: "Country added",
                        text: objects["message"]
                    });
                    loadTable();
                }
            };
            xhttp.open("PUT", `http://localhost:3000/Countries/${id}`);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(
                JSON.stringify({
                    CountryName: CountryName,
                    Capital: Capital,
                    Continent: Continent,
                    Population: Population,
                    FlagImage: dataUrl,
                })
            );
        };
        reader.readAsDataURL(FlagImage);
    } else {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const objects = JSON.parse(this.responseText);
                Swal.fire({
                    icon: "success",
                    title: "Country edited",
                    text: objects["message"]
                });
                loadTable();
            }
        };
        xhttp.open("PUT", `http://localhost:3000/Countries/${id}`);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(
            JSON.stringify({
                CountryName: CountryName,
                Capital: Capital,
                Continent: Continent,
                Population: Population,
                FlagImage: null,
            })
        );
    }
}

function userDelete(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open(`DELETE`, `http://localhost:3000/countries/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Swal.fire({
        title: "Loading...",
        text: "Your operation is being processed, Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
            setTimeout(() => {
                Swal.hideLoading();
                Swal.fire({
                    title: "Do you want to delete this?",
                    text: "You will not be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes , delete it!'
                }).then((result) => {
                    if (result.value) {
                        xhttp.send(
                            JSON.stringify({
                                id: id,
                            }));
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                render();
                            }
                        };
                    }
                });

            }, 500);
        }
    })
}

