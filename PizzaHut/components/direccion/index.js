'use strict';

app.direccion = kendo.observable({
    onShow: function () {
        var miLatLong = [];
        navigator.geolocation.getCurrentPosition(function (position) {
                miLatLong = [parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)];
                $("#localizacion").val(miLatLong);
            },
            function (error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            });

    },
    afterShow: function () {},
    onSaveClick: function () {
        if ($("#provincia").val() == "") {
            alert("Ingrese provincia");
            return true;
        }
        if ($("#distrito").val() == "") {
            alert("Ingrese distrito");
            return true;
        }
        if ($("#calle").val() == "") {
            alert("Ingrese calle");
            return true;
        }
        if ($("#numero").val() == "") {
            alert("Ingrese numero");
            return true;
        }
        if ($("#interior").val() == "") {
            alert("Ingrese interior");
            return true;
        }
        if ($("#referencia").val() == "") {
            alert("Ingrese referencia");
            return true;
        }
        if ($("#localizacion").val() == "") {
            // alert("Ingrese localización");
            // return true;
        }

        if (localStorage.getItem("direccionesUsuario") != undefined) {
            var direccionesGuardadas = JSON.parse(localStorage.getItem('direccionesUsuario'));
            direccionesGuardadas.push({
                "id": direccionesGuardadas.length,
                "estado": 1,
                "provincia": $("#provincia").val(),
                "distrito": $("#distrito").val(),
                "calle": $("#calle").val(),
                "numero": $("#numero").val(),
                "interior": $("#interior").val(),
                "referencia": $("#referencia").val(),
                "localizacion": $("#localizacion").val()
            });
            localStorage.setItem("direccionesUsuario", JSON.stringify(direccionesGuardadas));
            var direccionesUsuario = localStorage.getItem('direccionesUsuario');
            console.log('IF direccionesUsuario: ', JSON.parse(direccionesUsuario));
        } else {
            var nuevaDireccion = [{
                "id": 0,
                "estado": 1,
                "provincia": $("#provincia").val(),
                "distrito": $("#distrito").val(),
                "calle": $("#calle").val(),
                "numero": $("#numero").val(),
                "interior": $("#interior").val(),
                "referencia": $("#referencia").val(),
                "localizacion": $("#localizacion").val()
            }];
            localStorage.setItem("direccionesUsuario", JSON.stringify(nuevaDireccion));
            var direccionesUsuario = localStorage.getItem('direccionesUsuario');
            console.log('ELSE direccionesUsuario: ', JSON.parse(direccionesUsuario));
        }
        // app.mobileApp.navigate('components/categorias/view.html');
        app.mobileApp.navigate('#:back');

    },
});