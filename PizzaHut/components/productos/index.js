'use strict';

app.productos = kendo.observable({
    onShow: function () {},
    afterShow: function () {},

});

// START_CUSTOM_CODE_productos
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_productos

function actionsheetSeleccion(tipo, valor) {
    return function (e) {
        // console.log(e);
        // console.log(tipo);
        // console.log(valor);
        switch (tipo) {
            case "gaseosa":
                $('li[href="#actionsheetGaseosa"]:first').text(valor);
                $('li[href="#actionsheetGaseosa"]').attr("class", "km-widget km-button km-state-active");
                break;
            default:
                break;
        }
    };
}

function confirmarOrdenOferta() {
    $('#modalPedidoOferta').data('kendoMobileModalView').close();
    // var mv = $("#modalVerDireccion").data("kendoMobileModalView");
    // mv.shim.popup.options.animation.open.effects = "zoom";
    // mv.open();
    var html = [];
    var total = 0;
    if (localStorage.getItem("ordenesCarrito") != undefined) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        if (ordenesGuardadas.length == 0) {
            localStorage.removeItem("ordenesCarrito");
            $('#modalConfirmarPedidoOferta').data('kendoMobileModalView').close();
            return;
        }
        for (var i = 0; i < ordenesGuardadas.length; i++) {
            total = total + parseFloat(ordenesGuardadas[i].Producto.precio);
            // html.push('<li data-role="button" style="border-width: ' + (i == 0 ? '1px': '0') + ' 0 .5px;border-color: #fcd86e;text-align:left; padding: 0.84em 0 0.84em .84em;" class="km-widget km-button">' + ordenesGuardadas[i].Producto.nombre + '</br><p style="font-size:12px;line-height:0;">Gaseosa ' + ordenesGuardadas[i].Producto.gaseosa + '</p></li>');
            html.push('<li data-role="button" data-rel="actionsheet" style="display: inline-block;width:87%;margin:0;border-width: 1px 0 1px;border-color: #fcd86e;text-align:left;" class="km-widget km-button">' + ordenesGuardadas[i].Producto.nombre + '</li>');
            html.push('<li data-role="button" data-rel="actionsheet" onclick="ofertaAeliminar(' + "'" + ordenesGuardadas[i].Producto.nombre + "'," + i + ');" style="display: inline-block;width: 13%;margin: 0;border-width: 1px 0 1px;border-color: #fcd86e;border-left: solid 1px;border-left-color: #fcd86e;" class="km-widget km-button">X</li>');
        }
        $("#precioOrden").text(total.toFixed(2));
        $("#listViewConfirmarOrdenes").html(html);


        var mv = $("#modalConfirmarPedidoOferta").data("kendoMobileModalView");
        mv.shim.popup.options.animation.height = 4000;
        mv.shim.popup.options.animation.open.duration = 400;
        mv.shim.popup.options.animation.open.effects = "slideIn:up";
        mv.shim.popup.options.animation.close.duration = 400;

        mv.open();

    } else {
        $('#modalConfirmarPedidoOferta').data('kendoMobileModalView').close();
        return;
    }
}

function ofertaAeliminar(nombre, i) {
    var html = [];
    html.push('<li><a  href="#" data-action="elimiarOferta(' + i + ')" >Eliminar ' + nombre + '</a></li>');
    $("#actionsheetDeleteOferta").html(html);
    $("#actionsheetDeleteOferta").data("kendoMobileActionSheet").open();
}

function elimiarOferta(id) {
    return function (e) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        ordenesGuardadas.splice(id, 1);
        localStorage.setItem("ordenesCarrito", JSON.stringify(ordenesGuardadas));
        confirmarOrdenOferta();
        $("#actionsheetDeleteOferta").data("kendoMobileActionSheet").close();

    };
}

function agregarAlCarrito() {
    var direccion = obtenerDireccion("oferta");

    if (direccion == "") {
        $('#modalPedidoOferta').data('kendoMobileModalView').close();
        return;
    }

    if ($("li[href='#actionsheetGaseosa']:first").text().trim() == "Gaseosa") {
        $("#actionsheetGaseosa").data("kendoMobileActionSheet").open();
        return;
    }
    var producto = $("#productoOferta").val();
    var precio = $("#precioOferta").val();
    var nombre = $("#nombreOferta").val();
    var gaseosa = $("li[href='#actionsheetGaseosa']:first").text().trim();
    var user = $("#DisplayName").attr("type");

    console.log(direccion);
    if (producto == "" || direccion == "" || precio == "" || gaseosa == "" || user == "") {
        alert("Error: offline");
        return;
    }
    if (localStorage.getItem("ordenesCarrito") != undefined) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        ordenesGuardadas.push({
            "Categoria": "Oferta",
            "Producto": {
                producto: producto,
                nombre: nombre,
                precio: precio,
                gaseosa: gaseosa
            },
            "Direccion": direccion
        });
        localStorage.setItem("ordenesCarrito", JSON.stringify(ordenesGuardadas));
        var ordenesCarrito = localStorage.getItem('ordenesCarrito');
        console.log('IF ordenesCarrito: ', JSON.parse(ordenesCarrito));
    } else {
        var nuevaOrden = [{
            "Categoria": "Oferta",
            "Producto": {
                producto: producto,
                nombre: nombre,
                precio: precio,
                gaseosa: gaseosa
            },
            "Direccion": direccion
            }];
        localStorage.setItem("ordenesCarrito", JSON.stringify(nuevaOrden));
        var ordenesCarrito = localStorage.getItem('ordenesCarrito');
        console.log('ELSE ordenesCarrito: ', JSON.parse(ordenesCarrito));
    }
    $('#modalPedidoOferta').data('kendoMobileModalView').close();
}


(function (parent) {

    var dataProvider = app.data.pizzaHut,
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('productosModel'),
                dataSource = model.get('dataSource');

            if (paramFilter) {
                model.set('paramFilter', paramFilter);
            } else {
                model.set('paramFilter', undefined);
            }

            if (paramFilter && searchFilter) {
                dataSource.filter({
                    logic: 'and',
                    filters: [paramFilter, searchFilter]
                });
            } else if (paramFilter || searchFilter) {
                dataSource.filter(paramFilter || searchFilter);
            } else {
                dataSource.filter({});
            }
        },
        processImage = function (img) {
            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            } else if (img.slice(0, 4) !== 'http' &&
                img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
                var setup = dataProvider.setup || {};
                img = setup.scheme + ':' + setup.url + setup.appId + '/Files/' + img + '/Download';
            }

            return img;
        },
        flattenLocationProperties = function (dataItem) {
            var propName, propValue,
                isLocation = function (value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Producto',
                dataProvider: dataProvider
            },
            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    dataItem['PictureUrl'] =
                        processImage(dataItem['Picture']);

                    flattenLocationProperties(dataItem);
                }
            },
            error: function (e) {
                if (e.xhr) {
                    alert(JSON.stringify(e.xhr));
                }
            },
            schema: {
                model: {
                    fields: {
                        'Nombre': {
                            field: 'Nombre',
                            defaultValue: ''
                        },
                        'Descripcion': {
                            field: 'Descripcion',
                            defaultValue: ''
                        },
                        'Picture': {
                            field: 'Picture',
                            defaultValue: ''
                        },
                    },
                    icon: function () {
                        var i = 'globe';
                        return kendo.format('km-icon km-{0}', i);
                    }
                }
            },
            serverFiltering: true,
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        productosModel = kendo.observable({
            dataSource: dataSource,
            itemClickPizza: function (e) {
                // app.mobileApp.navigate('#components/productos/details.html?uid=' + e.data.uid);

                $("#precioProducto").text("S/. " + e.data.Precio);

                $('li[href="#actionsheetTamaño"]').attr("class", "km-widget km-button");
                $('li[href="#actionsheetMasa"]').attr("class", "km-widget km-button");
                $('li[href="#actionsheetGaseosa"]').attr("class", "km-widget km-button");

                $('li[href="#actionsheetTamaño"]').text("Tamaño de tu Pizza");
                $('li[href="#actionsheetMasa"]').text("Masa");
                $('li[href="#actionsheetGaseosa"]:first').text("Gaseosa");

                var html = [];
                for (var i = 0; i < e.data.Tamano.length; i++) {
                    html.push('<li><a  href="#" onclick="actionsheetSeleccion(' + "'tamaño'" + ",'" + e.data.Tamano[i] + "'" + ')" >' + e.data.Tamano[i] + '</a></li>');
                }
                $("#actionsheetTamaño").html(html);

                var html = [];

                for (var i = 0; i < e.data.Masa.length; i++) {
                    html.push('<li><a  href="#" onclick="actionsheetSeleccion(' + "'masa'" + ",'" + e.data.Masa[i] + "'" + ')" >' + e.data.Masa[i] + '</a></li>');
                }
                $("#actionsheetMasa").html(html);

                // var html = [];
                // for (var i = 0; i < e.data.Gaseosa.length; i++) {
                //     html.push('<li><a  href="#" onclick="actionsheetSeleccion(' + "'gaseosa'" + ",'" + e.data.Gaseosa[i] + "'" + ')" >' + e.data.Gaseosa[i] + '</a></li>');
                // }
                // $("#actionsheetGaseosa").html(html);



                var mv = $("#modalPedidoPizza").data("kendoMobileModalView");
                mv.shim.popup.options.animation.open.effects = "zoom";
                mv.open();

                $(".km-actionsheet-wrapper").css({
                    "border-radius": "20px",
                    "background-color": "#ff4350"
                });

            },
            itemClick: function (e) {
                // app.mobileApp.navigate('#components/productos/details.html?uid=' + e.dataItem.uid);
                console.log(e);

                $("#productoOferta").val(e.dataItem.Id);
                $("#precioOferta").val(e.dataItem.Precio);
                $("#nombreOferta").val(e.dataItem.Nombre);


                $("#precioProducto").text("S/. " + e.dataItem.Precio);

                $('li[href="#actionsheetTamaño"]').attr("class", "km-widget km-button");
                $('li[href="#actionsheetMasa"]').attr("class", "km-widget km-button");
                $('li[href="#actionsheetGaseosa"]').attr("class", "km-widget km-button");

                $('li[href="#actionsheetTamaño"]').text("Tamaño de tu Pizza");
                $('li[href="#actionsheetMasa"]').text("Masa");
                $('li[href="#actionsheetGaseosa"]:first').text('Gaseosa');

                // var html = [];
                // for (var i = 0; i < e.dataItem.Tamano.length; i++) {
                //     html.push('<li onclick="actionsheetSeleccion(' + "'tamaño'" + ",'" + e.dataItem.Tamano[i] + "'" + ')"><a  href="#"  >' + e.dataItem.Tamano[i] + '</a></li>');
                // }
                // $("#actionsheetTamaño").html(html);

                // var html = [];

                // for (var i = 0; i < e.dataItem.Masa.length; i++) {
                //     html.push('<li onclick="actionsheetSeleccion(' + "'masa'" + ",'" + e.dataItem.Masa[i] + "'" + ')" ><a  href="#" >' + e.dataItem.Masa[i] + '</a></li>');
                // }
                // $("#actionsheetMasa").html(html);

                var html = [];
                for (var i = 0; i < e.dataItem.Gaseosa.length; i++) {
                    // html.push('<li onclick="actionsheetSeleccion(' + "'gaseosa'" + ",'" + e.dataItem.Gaseosa[i] + "'" + ')" ><a  href="#"  >' + e.dataItem.Gaseosa[i] + '</a></li>');
                    html.push('<li><a  href="#" data-action="actionsheetSeleccion(' + "'gaseosa'" + ",'" + e.dataItem.Gaseosa[i] + "'" + ')" >' + e.dataItem.Gaseosa[i] + '</a></li>');
                }
                $("#actionsheetGaseosa").html(html);



                var mv = $("#modalPedidoOferta").data("kendoMobileModalView");
                mv.shim.popup.options.animation.open.effects = "zoom";
                mv.open();

                $(".km-actionsheet-wrapper").css({
                    "border-radius": "20px",
                    "background-color": "#ff4350"
                });

                if (localStorage.getItem("ordenesCarrito") != undefined) {
                    if (localStorage.getItem("ordenesCarrito").length > 0) {
                        $("#btnVerCarrito").removeClass("km-state-disabled");
                        $("#btnVerCarrito").attr("data-enable", "true");
                    } else {
                        $("#btnVerCarrito").addClass("km-state-disabled");
                        $("#btnVerCarrito").attr("data-enable", "false");
                    }
                } else {
                    $("#btnVerCarrito").addClass("km-state-disabled");
                    $("#btnVerCarrito").attr("data-enable", "false");

                }


            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = productosModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.Nombre) {
                    itemModel.Nombre = String.fromCharCode(160);
                }

                productosModel.set('currentItem', null);
                productosModel.set('currentItem', itemModel);
            },
            sendBSorden: function (e) {
                console.log(e);

                var html = [];
                var total = 0;
                var localizacion = "";
                var codigo = "";
                var estado = "Espera";
                var producto = [];
                var sucursal = "";
                var user = "";
                var direccion = "";
                var precio = "";
                if (localStorage.getItem("ordenesCarrito") != undefined) {
                    var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
                    for (var i = 0; i < ordenesGuardadas.length; i++) {
                        console.log(ordenesGuardadas[i]);
                        total = total + parseFloat(ordenesGuardadas[i].Producto.precio);
                        producto.push(ordenesGuardadas[i].Producto);
                    }
                } else {
                    console.log("sin carrrito");
                    $('#modalPedidoOferta').data('kendoMobileModalView').close();
                    $('#modalConfirmarPedidoOferta').data('kendoMobileModalView').close();
                    return;
                }

                localizacion = ordenesGuardadas[ordenesGuardadas.length - 1].Direccion[0].localizacion;
                codigo = "111";
                sucursal = "123456789";
                user = $("#DisplayName").attr("type");
                direccion = ordenesGuardadas[ordenesGuardadas.length - 1].Direccion;
                precio = total.toFixed(2);
                //                 console.log(localizacion);
                //                 console.log(codigo);
                //                 console.log(sucursal);
                //                 console.log(user);
                //                 console.log(direccion);
                //                 console.log(precio);
                var dataSourceOrden = new kendo.data.DataSource({
                    type: 'everlive',
                    transport: {
                        typeName: 'Orden',
                        dataProvider: dataProvider
                    },
                    error: function (e) {
                        if (e.xhr) {
                            alert(JSON.stringify(e.xhr));
                        }
                    }
                });
                dataSourceOrden.add({
                    Localizacion: localizacion,
                    Codigo: codigo,
                    Estado: estado,
                    Producto: producto,
                    Sucursal: sucursal,
                    User: user,
                    Direccion: direccion,
                    Precio: precio,
                });

                dataSourceOrden.one('change', function (e) {
                    // app.mobileApp.navigate('#:back');
                    $('#modalPedidoOferta').data('kendoMobileModalView').close();
                    $('#modalConfirmarPedidoOferta').data('kendoMobileModalView').close();
                    localStorage.removeItem("ordenesCarrito");

                    var mv = $("#modalConfirmacionOferta").data("kendoMobileModalView");
                    mv.shim.popup.options.animation.open.effects = "zoom";
                    mv.open();
                    return;
                });

                dataSourceOrden.sync();


            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('productosModel', productosModel);
        });
    } else {
        parent.set('productosModel', productosModel);
    }

    parent.set('onShow', function (e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;

        fetchFilteredData(param);
    });
})(app.productos);

// START_CUSTOM_CODE_productosModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_productosModel