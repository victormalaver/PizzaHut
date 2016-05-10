'use strict';

app.index = kendo.observable({
    onShow: function (e) {
        // mv.shim.popup.options.animation.open.duration = 400;
        // mv.shim.popup.options.animation.open.effects = "slideIn:up";
        // mv.shim.popup.options.animation.close.duration = 400;

        // mv.open();

        var mv = $("#modalInfoRegistro").data("kendoMobileModalView");
        mv.shim.popup.options.animation.open.effects = "zoom";
        mv.open();

        // if (e.view.params.logout) {
        //     $("#appDrawer").attr("style","width:0rem;") 
        //     app.home.homeModel.cerrarSesion();
        // }

        countCarrito();
    },
    goToHome: function () {
        app.mobileApp.navigate('components/home/view.html');
        app.home.homeModel.iniciarView();
    },
    goToPerfil: function () {
        app.mobileApp.navigate('components/home/view.html');
        app.home.homeModel.registrarView();
    },
});


// START_CUSTOM_CODE_index
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_index