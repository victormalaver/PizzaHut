'use strict';
app.direccion = kendo.observable({
    onShow: function () {
        var miLatLong = [];
        navigator.geolocation.getCurrentPosition(function (position) {
                miLatLong = [parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)];
                $("#localizacion").val(miLatLong);
            },
            function (error) {
                miLatLong = [-12.110300550698781, -77.03691065311432];
                $("#localizacion").val(miLatLong);
                // alert('code: ' + error.code + '\n' +
                //     'message: ' + error.message + '\n');
            });
    },
    afterShow: function () {
        cargarComboDepartamentos();
    },
    onSaveClick: function () {
        if ($("#departamentoAdd").val() == "") {
            alert("Ingrese provincia");
            return true;
        }
        if ($("#provinciaAdd").val() == "") {
            alert("Ingrese provincia");
            return true;
        }
        if ($("#distritoAdd").val() == "") {
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
            for (var i = 0; i < direccionesGuardadas.length; i++) {
                direccionesGuardadas[i].estado = 0;
            }
            direccionesGuardadas.push({
                "id": direccionesGuardadas.length + 1,
                "estado": 1,
                "departamento": $("#departamentoAdd option:selected").text(),
                "provincia": $("#provinciaAdd option:selected").text(),
                "distrito": $("#distritoAdd option:selected").text(),
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
                "id": 1,
                "estado": 1,
                "departamento": $("#departamentoAdd option:selected").text(),
                "provincia": $("#provinciaAdd option:selected").text(),
                "distrito": $("#distritoAdd option:selected").text(),
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




//Se recuperan los departamentos de la base de datos
function cargarComboDepartamentos() {
    var render = function (tx, rs) {
        var data = "";
        for (var i = 0; i < rs.rows.length; i++) {
            data += "<option value=" + rs.rows.item(i).DPTOCOD + ">" + rs.rows.item(i).DPTODES + "</option>";
        }
        $("#departamentoAdd").html(data);

        $("#departamentoAdd").val(15);

        cargarComboProvincias();
        
    };
    var db = appSqlite.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM departamento", [],
            render,
            appSqlite.onError);
    });

}

//Se recuperan de la base de datos las provincias del departamento seleccionado
function cargarComboProvincias() {
    var dep = "'" + $('#departamentoAdd').val() + "'";
    var render = function (tx, rs) {
        var data = "";
        for (var i = 0; i < rs.rows.length; i++) {
            data += "<option value=" + rs.rows.item(i).PROVCOD + ">" + rs.rows.item(i).PROVDES + "</option>";
        }
        $("#provinciaAdd").html(data);
        cargarComboDistritos();
    };
    var db = appSqlite.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM provincia where DPTOCOD=" + dep, [],
            render,
            appSqlite.onError);
    });
}

//Se recuperan de la base de datos las provincias del departamento seleccionado
function cargarComboDistritos() {
    var pro = "'" + $('#provinciaAdd').val() + "'";
    var dep = "'" + $('#departamentoAdd').val() + "'";
    var render = function (tx, rs) {
        var data = "";
        for (var i = 0; i < rs.rows.length; i++) {
            data += "<option value=" + rs.rows.item(i).DISTCOD + ">" + rs.rows.item(i).DISTDES + "</option>";
        }
        $("#distritoAdd").html(data);
    };
    var db = appSqlite.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM distrito where PROVCOD=" + pro + " and DPTOCOD=" + dep, [],
            render,
            appSqlite.onError);
    });
}