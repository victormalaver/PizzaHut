'use strict';

(function () {
    var app = {
        data: {}
    };

    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                skin: 'nova',
                initial: 'components/index/view.html'
            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof (element) != 'undefined' && element !== null) {
                if (window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function (event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $('#navigation-container').on('touchstart', 'a', function (event) {
                        app.keepActiveState($(this).closest('li'));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

function limpiarCache() {
    console.log("limpiarCache");
    localStorage.removeItem("ordenesCarrito");
    localStorage.removeItem("direccionesUsuario");
}

function countCarrito() {
    if (localStorage.getItem("ordenesCarrito") != undefined && JSON.parse(localStorage.getItem('ordenesCarrito')).length > 0) {
        $(".km-badge").css("opacity", "1");
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        $(".km-badge").text(ordenesGuardadas.length);
        // $(".km-badge").attr("href", "#components/georeferencia/carrito.html");
    } else {
        $(".km-badge").css("opacity", "0.3");
        $(".km-badge").text(0);
        // $(".carritoImagen").removeAttr("href");
    }
}


function confirmarOrden(categoria) {
    console.log(categoria);
    if (categoria) {
        if (categoria !== 'undefined') {
            $('#modalPedido' + categoria).data('kendoMobileModalView').close();
        }
    } 

    // var mv = $("#modalVerDireccion").data("kendoMobileModalView");
    // mv.shim.popup.options.animation.open.effects = "zoom";
    // mv.open();
    var html = [];
    var total = 0;
    if (localStorage.getItem("ordenesCarrito") != undefined) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        if (ordenesGuardadas.length == 0) {
            localStorage.removeItem("ordenesCarrito");
            $('#modalConfirmarPedido').data('kendoMobileModalView').close();
            return;
        }
        for (var i = 0; i < ordenesGuardadas.length; i++) {
            total = total + parseFloat(ordenesGuardadas[i].Producto.precio);
            // html.push('<li data-role="button" style="border-width: ' + (i == 0 ? '1px': '0') + ' 0 .5px;border-color: #fcd86e;text-align:left; padding: 0.84em 0 0.84em .84em;" class="km-widget km-button">' + ordenesGuardadas[i].Producto.nombre + '</br><p style="font-size:12px;line-height:0;">Gaseosa ' + ordenesGuardadas[i].Producto.gaseosa + '</p></li>');
            html.push('<li data-role="button" data-rel="actionsheet" style="display: inline-block;width:87%;margin:0;border-width: 1px 0 1px;border-color: #fcd86e;text-align:left;" class="km-widget km-button">' + ordenesGuardadas[i].Producto.nombre + '<h6 style="margin: 0 0 0 10px;padding: 10px 0 0 0;line-height: 0;font-size: 10px;position: fixed;">' + ordenesGuardadas[i].Producto.tamaño + ordenesGuardadas[i].Producto.masa + ordenesGuardadas[i].Producto.gaseosa + '</h6>');
            html.push('<li data-role="button" data-rel="actionsheet" onclick="eliminarSeleccionado(' + "'" + categoria + "'," + "'" + ordenesGuardadas[i].Producto.nombre + "'," + ordenesGuardadas[i].id + ');" style="display: inline-block;width: 13%;margin: 0;border-width: 1px 0 1px;border-color: #fcd86e;border-left: solid 1px;border-left-color: #fcd86e;" class="km-widget km-button">X</li>');
        }
        $("#precioOrden").text("S/. " + total.toFixed(2));
        $("#listViewConfirmar").html(html);

        var mv = $("#modalConfirmarPedido").data("kendoMobileModalView");
        mv.shim.popup.options.animation.height = 4000;
        mv.shim.popup.options.animation.open.duration = 400;
        mv.shim.popup.options.animation.open.effects = "slideIn:up";
        mv.shim.popup.options.animation.close.duration = 400;

        mv.open();

    } else {
        $('#modalConfirmarPedido').data('kendoMobileModalView').close();
        return;
    }
}

function cerrarSesion(){
    app.mobileApp.navigate("#components/home/view.html?logout=true");
    $("#DisplayName").attr('href', "components/index/view.html");
    $("#homeModellogout").css("display","none");
    $("#homeModellogout").prev().css("border-width","1px 0 1px");
    $("#DisplayName").attr("type","");
    $('#DisplayName').html('<span class="km-icon km-contacts"></span>Iniciar Sesión');
}
// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp