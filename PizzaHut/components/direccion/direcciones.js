'use strict';

app.direcciones = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
    addClick: function () {
        app.mobileApp.navigate('components/direccion/view.html');
    }
});


function getCurrentArray(direccion, id) {
    $(".km-actionsheet-wrapper").css({
        "border-radius": "20px",
        "background-color": "#ff4350"
    });

    var html = [];
    html.push('<li><a  href="#" data-action="deleteDireccion(' + id + ')" >¿Eliminar la dirección: ' + direccion + '?</a></li>');
    $("#actionsheetDeleteDireccion").html(html);
    $("#actionsheetDeleteDireccion").data("kendoMobileActionSheet").open();
}

function deleteDireccion(id) {
    return function (e) {
        var direccionesUsuario = JSON.parse(localStorage.getItem('direccionesUsuario'));
        var nuevadireccionesUsuario = []
        for (var i = 0; i < direccionesUsuario.length; i++) {
            if (direccionesUsuario[i].id !== id) {
                nuevadireccionesUsuario.push(direccionesUsuario[i]);
            }
        }
        localStorage.setItem("direccionesUsuario", JSON.stringify(nuevadireccionesUsuario));
        $("#actionsheetDeleteDireccion").data("kendoMobileActionSheet").close();
        cargarListadoDirecciones();
    };
}

function closeActionSheet(id) {
    return function (e) {
        $("#" + id).data("kendoMobileActionSheet").close();
    };
}



function cargarListadoDirecciones() {
    var dataSource = new kendo.data.DataSource({
        data: JSON.parse(localStorage.getItem('direccionesUsuario'))
    });
    $("#listaDirecciones").kendoMobileListView({
        dataSource: dataSource,
        // template: $("#listadoModelTemplate").text()
        template: kendo.template($("#listadoModelTemplate").html())
    })

}

function onChangeDireccion(e) {
    var data = JSON.parse(localStorage.getItem('direccionesUsuario'));
    for (var i = 0; i < data.length; i++) {
        data[i].estado = 0;
    }
    if (e.checked) { //is checked
        console.log("if: " + e.checked);
        data[e.sender.element.context.attributes[3].value-1].estado = 1;
    } else {
        console.log("else: " + e.checked);
        data[e.sender.element.context.attributes[3].value-1].estado = 0;
        var mv = $("#modalAlertDirecciones").data("kendoMobileModalView");
        mv.shim.popup.options.animation.open.effects = "zoom";
        mv.open();
    }
    localStorage.setItem("direccionesUsuario", JSON.stringify(data));
    cargarListadoDirecciones();
}