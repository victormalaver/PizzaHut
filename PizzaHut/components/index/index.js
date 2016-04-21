'use strict';

app.index = kendo.observable({
    onShow: function () {
        // $("#modalInfoOrden").kendoMobileModalView("open");
        // var mv = $("#modalInfoOrden").data("kendoMobileModalView");

        // mv.shim.popup.options.animation.open.duration = 400;
        // mv.shim.popup.options.animation.open.effects = "slideIn:up";
        // mv.shim.popup.options.animation.close.duration = 400;

        // mv.open();
        var mv = $("#modalInfoOrden").data("kendoMobileModalView");
        mv.shim.popup.options.animation.open.effects = "zoom";

        mv.open();
    },
    afterShow: function () {},
    goToHome: function () {
        app.mobileApp.navigate('components/home/view.html');
    },
    goToPerfil: function () {
        app.mobileApp.navigate('components/perfil/view.html');
    },
});

// START_CUSTOM_CODE_index
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_index