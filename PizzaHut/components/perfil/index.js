'use strict';

app.perfil = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_perfil
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_perfil
(function (parent) {
    var dataProvider = app.data.pizzaHut,
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('perfilModel'),
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
                typeName: 'Users',
                dataProvider: dataProvider
            },
            change: function (e) {
                // var data = this.data();
                // for (var i = 0; i < data.length; i++) {
                //     var dataItem = data[i];

                //     dataItem['ProductoUrl'] =
                //         processImage(dataItem['Producto']);

                //     flattenLocationProperties(dataItem);
                // }
            },
            error: function (e) {
                if (e.xhr) {
                    alert(JSON.stringify(e.xhr));
                }
            },
            schema: {
                model: {
                    fields: {
                        'ApePaterno': {
                            field: 'ApePaterno',
                            defaultValue: ''
                        },
                        'ApeMaterno': {
                            field: 'ApeMaterno',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        perfilModel = kendo.observable({
            dataSource: dataSource,
            searchChange: function (e) {
                var searchVal = e.target.value,
                    searchFilter;

                if (searchVal) {
                    searchFilter = {
                        field: 'ApePaterno',
                        operator: 'contains',
                        value: searchVal
                    };
                }
                fetchFilteredData(perfilModel.get('paramFilter'), searchFilter);
            },
            itemClick: function (e) {

                app.mobileApp.navigate('components/perfil/view.html?filter=' + encodeURIComponent(JSON.stringify({
                    field: 'ApePaterno',
                    value: e.dataItem.Id,
                    operator: 'eq'
                })));

            },
            addClick: function () {
                app.mobileApp.navigate('#components/perfil/add.html');
            },
            editClick: function () {
                var uid = this.currentItem.uid;
                app.mobileApp.navigate('#components/perfil/edit.html?uid=' + uid);
            },
            deleteClick: function () {
                var dataSource = perfilModel.get('dataSource'),
                    that = this;

                if (!navigator.notification) {
                    navigator.notification = {
                        confirm: function (message, callback) {
                            callback(window.confirm(message) ? 1 : 2);
                        }
                    };
                }

                navigator.notification.confirm(
                    "Are you sure you want to delete this item?",
                    function (index) {
                        //'OK' is index 1
                        //'Cancel' - index 2
                        if (index === 1) {
                            dataSource.remove(that.currentItem);

                            dataSource.one('sync', function () {
                                app.mobileApp.navigate('#:back');
                            });

                            dataSource.one('error', function () {
                                dataSource.cancelChanges();
                            });

                            dataSource.sync();
                        }
                    },
                    '', ["OK", "Cancel"]
                );
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = perfilModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.Producto) {
                    itemModel.Producto = String.fromCharCode(160);
                }

                perfilModel.set('currentItem', null);
                perfilModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('addItemViewModel', kendo.observable({
        onShow: function (e) {
            // Reset the form data.
            this.set('addFormData', {
                ApePaterno: '',
                ApeMaterno: '',
                nombre: '',
                direccion: '',
                toggleDireccion: '',
                nombres: '',
                correo: '',
                celular: '',
                dni: '',
            });
        },
        onSaveClick: function (e) {
            var addFormData = this.get('addFormData'),
                dataSource = perfilModel.get('dataSource');
            console.log(addFormData);
            console.log(dataSource);
            console.log(addFormData.ApePaterno);
            console.log(addFormData.ApeMaterno);
            console.log(addFormData.nombre);
            console.log(addFormData.direccion);
            console.log(addFormData.toggleDireccion);
            console.log(addFormData.nombres);
            console.log(addFormData.correo);
            console.log(addFormData.celular);
            console.log(addFormData.dni);
            // dataSource.add({
            //     Localizacion: addFormData.localizacion,
            //     Codigo: addFormData.codigo,
            //     Estado: addFormData.estado,
            //     Producto: addFormData.producto,
            //     Sucursal: addFormData.sucursal,
            //     User: addFormData.user,
            //     Direccion: addFormData.direccion,
            // });

            // dataSource.one('change', function(e) {
            //     app.mobileApp.navigate('#:back');
            // });

            // dataSource.sync();
        }
    }));

    parent.set('editItemViewModel', kendo.observable({
        onShow: function (e) {
            var itemUid = e.view.params.uid,
                dataSource = perfilModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid);

            this.set('itemData', itemData);
            this.set('editFormData', {
                precio: itemData.Precio,
            });
        },
        onSaveClick: function (e) {
            var editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = perfilModel.get('dataSource');

            // prepare edit
            itemData.set('Precio', editFormData.precio);

            dataSource.one('sync', function (e) {
                app.mobileApp.navigate('#:back');
            });

            dataSource.one('error', function () {
                dataSource.cancelChanges(itemData);
            });

            dataSource.sync();
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('perfilModel', perfilModel);
        });
    } else {
        parent.set('perfilModel', perfilModel);
    }

    parent.set('onShow', function (e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;

        fetchFilteredData(param);
    });
})(app.perfil);

// START_CUSTOM_CODE_perfilModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_perfilModel