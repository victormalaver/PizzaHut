'use strict';

app.productos = kendo.observable({
    onShow: function () {},
    afterShow: function () {
        countCarrito();
    },

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
            case "masa":
                $('li[href="#actionsheetMasa"]:first').text(valor);
                $('li[href="#actionsheetMasa"]').attr("class", "km-widget km-button km-state-active");
                break;
            default: //tamaño
                $('li[href="#actionsheetTamaño"]:first').text(valor);
                $('li[href="#actionsheetTamaño"]').attr("class", "km-widget km-button km-state-active");
                break;
        }
    };
}


function eliminarSeleccionado(categoria, nombre, i) {
    $(".km-actionsheet-wrapper").css({
        "border-radius": "20px",
        "background-color": "#ff4350"
    });
    var html = [];
    html.push('<li><a  href="#" data-action="elimiarPedido(' + "'" + categoria + "'," + i + ')" >Eliminar ' + nombre + '</a></li>');
    $("#actionsheetDelete").html(html);
    $("#actionsheetDelete").data("kendoMobileActionSheet").open();
}

function elimiarPedido(categoria, id) {
    return function (e) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        var nuevaordenesGuardadas = []
        for (var i = 0; i < ordenesGuardadas.length; i++) {
            if (ordenesGuardadas[i].id !== id) {
                nuevaordenesGuardadas.push(ordenesGuardadas[i]);
            }
        }
        localStorage.setItem("ordenesCarrito", JSON.stringify(nuevaordenesGuardadas));
        confirmarOrden(categoria);
        $("#actionsheetDelete").data("kendoMobileActionSheet").close();
        countCarrito();
    };

}

function agregarAlCarrito(categoria) {
    var direccion = obtenerDireccion("oferta");

    if (!direccion) {
        $('#modalPedido' + categoria).data('kendoMobileModalView').close();
        return;
    }

    var gaseosa = "";
    var tamaño = "";
    var masa = "";
    switch (categoria) {
        case 'Oferta':
            if ($("li[href='#actionsheetGaseosa']:first").text().trim() == "Gaseosa") {
                $("#actionsheetGaseosa").data("kendoMobileActionSheet").open();
                return;
            }
            gaseosa = $("li[href='#actionsheetGaseosa']:first").text().trim();
            break;
        default:
            if ($("li[href='#actionsheetTamaño']:first").text().trim() == "Tamaño de tu Pizza") {
                $("#actionsheetTamaño").data("kendoMobileActionSheet").open();
                return;
            }
            if ($("li[href='#actionsheetMasa']:first").text().trim() == "Masa") {
                $("#actionsheetMasa").data("kendoMobileActionSheet").open();
                return;
            }

            tamaño = $("li[href='#actionsheetTamaño']:first").text().trim();
            masa = $("li[href='#actionsheetMasa']:first").text().trim();
            break;
    }

    var producto = $("#producto" + categoria).val();
    var precio = $("#precio" + categoria).val();
    var nombre = $("#nombre" + categoria).val();

    var user = $("#DisplayName").attr("type");

    if (producto == "" || direccion == "" || precio == "" || user == "") {
        alert("Error: offline");
        return;
    }
    if (localStorage.getItem("ordenesCarrito") != undefined) {
        var ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesCarrito'));
        ordenesGuardadas.push({
            "id": ordenesGuardadas.length + 1,
            "Categoria": categoria,
            "Producto": {
                producto: producto,
                nombre: nombre,
                precio: precio,
                gaseosa: gaseosa,
                tamaño: tamaño,
                masa: masa
            },
            "Direccion": direccion
        });
        localStorage.setItem("ordenesCarrito", JSON.stringify(ordenesGuardadas));
        var ordenesCarrito = localStorage.getItem('ordenesCarrito');
        console.log('IF ordenesCarrito: ', JSON.parse(ordenesCarrito));
    } else {
        var nuevaOrden = [{
            "id": 1,
            "Producto": {
                producto: producto,
                nombre: nombre,
                precio: precio,
                gaseosa: gaseosa,
                tamaño: tamaño,
                masa: masa
            },
            "Direccion": direccion
            }];
        localStorage.setItem("ordenesCarrito", JSON.stringify(nuevaOrden));
        var ordenesCarrito = localStorage.getItem('ordenesCarrito');
        console.log('ELSE ordenesCarrito: ', JSON.parse(ordenesCarrito));
    }
    $('#modalPedido' + categoria).data('kendoMobileModalView').close();
    countCarrito();

    var mv = $("#modalConfirmacionCarrito").data("kendoMobileModalView");
    mv.shim.popup.options.animation.open.effects = "zoom";
    mv.open();
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
                // app.mobileApp.navigate('#components/productos/details.html?uid=' + e.dataItem.uid);
                console.log(e);

                $("#productoPizza").val(e.data.Id);
                $("#precioPizza").val(e.data.Precio);
                $("#nombrePizza").val(e.data.Nombre);


                $("#precioProductoPizza").text("S/. " + e.data.Precio);

                $('li[href="#actionsheetTamaño"]').attr("class", "km-widget km-button");
                $('li[href="#actionsheetMasa"]').attr("class", "km-widget km-button");

                $('li[href="#actionsheetTamaño"]:first').text("Tamaño de tu Pizza");
                $('li[href="#actionsheetMasa"]:first').text("Masa");

                var html = [];
                for (var i = 0; i < e.data.Tamano.length; i++) {
                    html.push('<li><a  href="#" data-action="actionsheetSeleccion(' + "'tamaño'" + ",'" + e.data.Tamano[i] + "'" + ')" >' + e.data.Tamano[i] + '</a></li>');
                }
                $("#actionsheetTamaño").html(html);

                var html = [];

                for (var i = 0; i < e.data.Masa.length; i++) {
                    html.push('<li><a  href="#" data-action="actionsheetSeleccion(' + "'masa'" + ",'" + e.data.Masa[i] + "'" + ')" >' + e.data.Masa[i] + '</a></li>');
                }
                $("#actionsheetMasa").html(html);

                // var html = [];
                // for (var i = 0; i < e.dataItem.Gaseosa.length; i++) {
                //     // html.push('<li onclick="actionsheetSeleccion(' + "'gaseosa'" + ",'" + e.dataItem.Gaseosa[i] + "'" + ')" ><a  href="#"  >' + e.dataItem.Gaseosa[i] + '</a></li>');
                //     html.push('<li><a  href="#" data-action="actionsheetSeleccion(' + "'gaseosa'" + ",'" + e.dataItem.Gaseosa[i] + "'" + ')" >' + e.dataItem.Gaseosa[i] + '</a></li>');
                // }
                // $("#actionsheetGaseosa").html(html);



                var mv = $("#modalPedidoPizza").data("kendoMobileModalView");
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
            itemClick: function (e) {
                // app.mobileApp.navigate('#components/productos/details.html?uid=' + e.dataItem.uid);

                $("#productoOferta").val(e.dataItem.Id);
                $("#precioOferta").val(e.dataItem.Precio);
                $("#nombreOferta").val(e.dataItem.Nombre);


                $("#precioProducto").text("S/. " + e.dataItem.Precio);

                $('li[href="#actionsheetGaseosa"]').attr("class", "km-widget km-button");
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
                kendo.mobile.application.showLoading();
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

                dataSourceOrden.fetch(function () {
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
                            total = total + parseFloat(ordenesGuardadas[i].Producto.precio);
                            producto.push(ordenesGuardadas[i].Producto);
                        }
                    } else {
                        $('#modalConfirmarPedido').data('kendoMobileModalView').close();
                        kendo.mobile.application.hideLoading();
                        return;
                    }

                    localizacion = ordenesGuardadas[ordenesGuardadas.length - 1].Direccion[0].localizacion;

                    console.log("localizacion: " + localizacion);
                    var latitude = localizacion.split(",")[0];
                    var longitude = localizacion.split(",")[1];
                    codigo = dataSourceOrden.total() + 1;
                    sucursal = "";
                    user = $("#DisplayName").attr("type");
                    direccion = ordenesGuardadas[ordenesGuardadas.length - 1].Direccion;
                    precio = total.toFixed(2);
                    dataSourceOrden.add({
                        Localizacion: {
                            longitude: parseFloat(longitude),
                            latitude: parseFloat(latitude)
                        },
                        Codigo: codigo.toString(),
                        Estado: estado,
                        Producto: producto,
                        Sucursal: sucursal,
                        User: user,
                        Direccion: direccion,
                        Precio: precio,
                    });

                    dataSourceOrden.one('change', function (e) {
                        // app.mobileApp.navigate('#:back');
                        $('#modalConfirmarPedido').data('kendoMobileModalView').close();
                        localStorage.removeItem("ordenesCarrito");
                        var mv = $("#modalConfirmacion").data("kendoMobileModalView");
                        mv.shim.popup.options.animation.open.effects = "zoom";
                        mv.open();
                        kendo.mobile.application.hideLoading();
                        countCarrito();
                    });

                    dataSourceOrden.sync();

                });

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