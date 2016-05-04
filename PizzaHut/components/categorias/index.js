'use strict';

app.categorias = kendo.observable({
    onShow: function () {},
    afterShow: function () {
        obtenerDireccion("categoria");
        countCarrito();
    }
});

function goToDirecciones() {
    // $("#appDrawer").data("kendoMobileDrawer").hide();
    app.mobileApp.navigate('components/direccion/direcciones.html');
}

function obtenerDireccion(tipo) {
    var direccion = [];
    if (localStorage.getItem("direccionesUsuario") != undefined) {
        var direccionesGuardadas = JSON.parse(localStorage.getItem('direccionesUsuario'));
        for (var i = 0; i < direccionesGuardadas.length; i++) {
            if (direccionesGuardadas[i].estado == 1) {
                direccion.push({
                    "calle": direccionesGuardadas[i].calle,
                    "numero": direccionesGuardadas[i].numero,
                    "distrito": direccionesGuardadas[i].distrito,
                    "provincia": direccionesGuardadas[i].provincia,
                    "departamento": direccionesGuardadas[i].departamento,
                    "localizacion": direccionesGuardadas[i].localizacion
                });
            }
        }
        if (tipo == "categoria") {
            if (direccion == "") {
                $("#headerDireccionModal").text("Seleccione una dirección");
                $("#nameDireccionModal").text("  ");
            } else {
                $("#headerDireccionModal").text("Usar esta dirección: ");
                $("#nameDireccionModal").text(direccion[0].calle + " " + direccion[0].numero);
            }
            var mv = $("#modalInfoDireccion").data("kendoMobileModalView");
            mv.shim.popup.options.animation.open.effects = "zoom";
            mv.open();
        }
        if (tipo == "oferta" && direccion == "") {
            $("#headerDireccionModal").text("Seleccione una dirección");
            $("#nameDireccionModal").text("  ");
            var mv = $("#modalInfoDireccion").data("kendoMobileModalView");
            mv.shim.popup.options.animation.open.effects = "zoom";
            mv.open();
        }
        return direccion;
    } else {
        var mv = $("#modalVerDireccion").data("kendoMobileModalView");
        mv.shim.popup.options.animation.open.effects = "zoom";
        mv.open();
        return;
    }
}

// START_CUSTOM_CODE_categorias
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_categorias
(function (parent) {
    var dataProvider = app.data.pizzaHut,
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('categoriasModel'),
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
                typeName: 'Categoria',
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
                        'Detalle': {
                            field: 'Detalle',
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
        categoriasModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {
                switch (e.dataItem.Nombre) {
                    case 'Pizzas':
                        app.mobileApp.navigate('components/productos/view.html?filter=' + encodeURIComponent(JSON.stringify({
                            field: 'Categoria',
                            value: e.dataItem.Id,
                            operator: 'eq'
                        })));
                        break;
                    case 'Ofertas':
                        app.mobileApp.navigate('components/productos/oferta.html?filter=' + encodeURIComponent(JSON.stringify({
                            field: 'Categoria',
                            value: e.dataItem.Id,
                            operator: 'eq'
                        })));
                        break;
                    default:
                        var mv = $("#modalDemoCategorias").data("kendoMobileModalView");
                        mv.shim.popup.options.animation.open.effects = "zoom";
                        mv.open();
                        break;
                }
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = categoriasModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.Nombre) {
                    itemModel.Nombre = String.fromCharCode(160);
                }

                categoriasModel.set('currentItem', null);
                categoriasModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('categoriasModel', categoriasModel);
        });
    } else {
        parent.set('categoriasModel', categoriasModel);
    }

    parent.set('onShow', function (e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
        fetchFilteredData(param);
        // $("#appDrawer").removeAttr("style");
    });
})(app.categorias);

// START_CUSTOM_CODE_categoriasModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_categoriasModel