'use strict';

app.ordenes = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_ordenes
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_ordenes
(function (parent) {
    var dataProvider = app.data.pizzaHut,
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('ordenesModel'),
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
                typeName: 'Orden',
                dataProvider: dataProvider,
                // read: {
                //     headers: {
                //         "X-Everlive-Filter": JSON.stringify({
                //             "$and": [{
                //                 "User": $("#DisplayName").attr("type")
                //             }]
                //         })
                //     }
                // }
            },
            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    dataItem['ProductoUrl'] =
                        processImage(dataItem['Producto']);

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
                        'Producto': {
                            field: 'Producto',
                            defaultValue: ''
                        },
                        'Precio': {
                            field: 'Precio',
                            defaultValue: ''
                        },
                        'Codigo': {
                            field: 'Codigo',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            sort: {
                field: "CreatedAt",
                dir: "desc"
            },
            pageSize: 20
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        ordenesModel = kendo.observable({
            dataSource: dataSource,
            searchChange: function (e) {
                var searchVal = e.target.value,
                    searchFilter;
                if (searchVal) {
                    searchFilter = {
                        field: 'Codigo',
                        operator: 'contains',
                        value: searchVal
                    };
                }
                fetchFilteredData(ordenesModel.get('paramFilter'), searchFilter);
            },
            itemClick: function (e) {
                app.mobileApp.navigate('components/ordenes/seguimiento.html?filter=' + e.data.Id);
                // app.mobileApp.navigate('components/ordenes/seguimiento.html?filter=' + encodeURIComponent(JSON.stringify({
                //     field: 'Id',
                //     value: e.data.uid,
                //     operator: 'eq'
                // })));

            },
            addClick: function () {
                app.mobileApp.navigate('#components/ordenes/add.html');
            },
            editClick: function () {
                var uid = this.currentItem.uid;
                app.mobileApp.navigate('#components/ordenes/edit.html?uid=' + uid);
            },
            deleteClick: function () {
                var dataSource = ordenesModel.get('dataSource'),
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
                    dataSource = ordenesModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.Producto) {
                    itemModel.Producto = String.fromCharCode(160);
                }

                ordenesModel.set('currentItem', null);
                ordenesModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('addItemViewModel', kendo.observable({
        onShow: function (e) {
            // Reset the form data.
            this.set('addFormData', {
                localizacion: '',
                codigo: '',
                estado: '',
                producto: '',
                sucursal: '',
                user: '',
                direccion: '',
            });
        },
        onSaveClick: function (e) {
            var addFormData = this.get('addFormData'),
                dataSource = ordenesModel.get('dataSource');

            console.log(addFormData.localizacion);
            console.log(addFormData.codigo);
            console.log(addFormData.estado);
            console.log(addFormData.producto);
            console.log(addFormData.sucursal);
            console.log(addFormData.user);
            console.log(addFormData.direccion);

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
                dataSource = ordenesModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid);

            this.set('itemData', itemData);
            this.set('editFormData', {
                precio: itemData.Precio,
            });
        },
        onSaveClick: function (e) {
            var editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = ordenesModel.get('dataSource');

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
            parent.set('ordenesModel', ordenesModel);
        });
    } else {
        parent.set('ordenesModel', ordenesModel);
    }

    parent.set('onShow', function (e) {
        // var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
        var param = $("#DisplayName").attr("type");
        var searchVal = param,
            searchFilter;
        if (searchVal) {
            searchFilter = {
                field: 'User', // -> Id is ok , Seguimiento dont work
                operator: 'eq',
                value: param,
            };
        }
        fetchFilteredData(ordenesModel.get('paramFilter'), searchFilter);
    });
})(app.ordenes);

// START_CUSTOM_CODE_ordenesModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_ordenesModel