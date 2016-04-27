'use strict';

app.direcciones = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
    addClick: function () {
        app.mobileApp.navigate('#components/direccion/view.html');
    }
});