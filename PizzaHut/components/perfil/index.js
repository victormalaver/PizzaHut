'use strict';

app.perfil = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_perfil
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_perfil
(function(parent) {
    var perfilModel = kendo.observable({
        fields: {
            dni: '',
            telefono: '',
            correo: '',
            nombres: '',
            toggleDireccion: '',
            direccion: '',
            nombre: '',
            apellido: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('perfilModel', perfilModel);
})(app.perfil);

// START_CUSTOM_CODE_perfilModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_perfilModel