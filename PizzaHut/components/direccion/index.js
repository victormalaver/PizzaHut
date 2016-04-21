'use strict';

app.direccion = kendo.observable({
    onShow: function () {
        var miLatLong = [];
        navigator.geolocation.getCurrentPosition(function (position) {
                miLatLong = [parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)];
                $("#referencia").val(miLatLong);
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
        if ($("#ditrito").val() == "") {
            alert("Ingrese ditrito");
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

        if (localStorage.getItem("direccionesUsuario") != undefined) {
            var direccionesGuardadas = JSON.parse(localStorage.getItem('direccionesUsuario'));
            direccionesGuardadas.push({
                "provincia": $("#provincia").val(),
                "ditrito": $("#ditrito").val(),
                "calle": $("#calle").val(),
                "numero": $("#numero").val(),
                "interior": $("#interior").val(),
                "referencia": $("#referencia").val(),
            });
            localStorage.setItem("direccionesUsuario", JSON.stringify(direccionesGuardadas));
            var direccionesUsuario = localStorage.getItem('direccionesUsuario');
            console.log('IF direccionesUsuario: ', JSON.parse(direccionesUsuario));
        } else {
            var nuevaDireccion = [{
                "provincia": $("#provincia").val(),
                "ditrito": $("#ditrito").val(),
                "calle": $("#calle").val(),
                "numero": $("#numero").val(),
                "interior": $("#interior").val(),
                "referencia": $("#referencia").val(),
            }];
            localStorage.setItem("direccionesUsuario", JSON.stringify(nuevaDireccion));
            var direccionesUsuario = localStorage.getItem('direccionesUsuario');
            console.log('ELSE direccionesUsuario: ', JSON.parse(direccionesUsuario));
        }

        app.mobileApp.navigate('components/categorias/view.html');

    },
});