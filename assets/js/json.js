//https://javascript.info/xmlhttprequest#http-headers
// npm install -g json-server
// json-server --watch db.json in Terminal(command prompt)
function loadTable(CountryName ='') {

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Countries?CountryName_like=${CountryName}`);
    xhttp.send();            //sending the request
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest 
    //XMLHttpRequest Methods and Properties
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

function showUserCreateBox() {
    //https://sweetalert2.github.io/v9.html
    Swal.fire({
        title: "Create country",
        html:
            '<input id="id" type="hidden">' +
            '<input id="CountryName" class="swal2-input" placeholder="CountryName">' +
            '<input id="Capital" class="swal2-input" placeholder="Capital">' +
            '<input id="Continent" class="swal2-input" placeholder="Continent">'+
            '<input id="Population" type="number" class="swal2-input" placeholder="Population">' +
            '<input id="FlagImage" type="file" class="swal2-input" >',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const CountryName = document.getElementById("CountryName").value;
            const Capital = document.getElementById("Capital").value;
            const Continent = document.getElementById("Continent").value;
            const Population = parseInt(document.getElementById("Population").value);

            if (!CountryName || !Capital || !Continent || !Population) {
                Swal.showValidationMessage("Please fill in all the fields");
            }  else if (Population <= 0) {
                Swal.showValidationMessage(" Population must not be negative");
            } else if (!/^[a-zA-Z\s]+$/.test(CountryName) || !/^[a-zA-Z\s]+$/.test(Capital) || !/^[a-zA-Z\s]+$/.test(Continent)) {
                Swal.showValidationMessage("Country name, capital, and continent must contain only letters and spaces");
            } else {
                userCreate();
            }
        },
    });

}

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
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire({
                        icon: 'success',
                        title: 'Country added',
                        text: objects["message"]
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
                    icon: 'success',
                    title: 'Country added',
                    text: objects["message"]
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
    // xhttp.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         const objects = JSON.parse(this.responseText);
    //         Swal.fire(objects["message"]);
    //         loadTable();
    //     }
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
                    '<label>Country Name:</label><input id="id" type="hidden" value="' +
                    objects[`${id}`] +
                    '">' +
                    '<input id="CountryName" class="swal2-input" placeholder="CountryName" value="' +
                    objects["CountryName"] +
                    '">' +
                    '<label>Capital Name:</label><input id="Capital" class="swal2-input" placeholder="Capital" value="' +
                    objects["Capital"] +
                    '">' +
                    '<label>Continent Name:</label><input id="Continent" class="swal2-input" placeholder="Continent" value="' +
                    objects["Continent"] +
                    '">' +
                     '<label>Population:</label><input id="Population" class="swal2-input" placeholder="Population" value="' +
                     objects["Population"] +
                     '">' +
                    '<input id="FlagImage" type="file" class="swal2-input" placeholder="FlagImage" value="' +
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
                    const Population = parseInt(document.getElementById("Population").value);

                    if (!CountryName || !Capital || !Continent || !Population) {
                        Swal.showValidationMessage("Please fill in all the fields");
                    } else if (isNaN(Population)) {
                        Swal.showValidationMessage("Population must be numbers");
                    } else if (Population <= 0) {
                        Swal.showValidationMessage(" Population must not be negative");
                    } else if (!/^[a-zA-Z\s]+$/.test(CountryName) || !/^[a-zA-Z\s]+$/.test(Capital) || !/^[a-zA-Z\s]+$/.test(Continent)) {
                        Swal.showValidationMessage("Country name and capital must contain only letters and spaces");
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
    xhttp.open("PUT", `http://localhost:3000/Countries/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (FlagImage) {
        const reader = new FileReader();
        reader.onload = function () {
            const dataUrl = reader.result;
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
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            loadTable();
            Swal.fire({
                title: 'Country Edited',
                text: objects["message"],
                icon: 'success'
            });
        }
    };
    // xhttp.send(
    //     JSON.stringify({
    //         // id: id,
    //         CountryName: CountryName,
    //         Capital: Capital,
    //         Continent: Continent,
    //         Population: Population,
    //         FlagImage: "https://www.melivecode.com/users/1.png",
    //     })
    // );
    // xhttp.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         const objects = JSON.parse(this.responseText);
    //         Swal.fire(objects["message"]);
    //         loadTable();
    //     }
    // };
}

function userDelete(id) {
    console.log(id)
        ;
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
