'use strict';

app.users = kendo.observable({
    onShow: function () {},
    afterShow: function () {
        countCarrito();
    }
});

// START_CUSTOM_CODE_users
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_users
(function (parent) {
    var dataProvider = app.data.pizzaHut,
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('usersModel'),
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
                console.log(dataSource);
                dataSource.fetch(function () {
                    console.log(dataSource.total());
                    if( dataSource.total() == 0 ){
                        app.mobileApp.navigate('#components/users/add.html');
                    }
                });
            } else {
                dataSource.filter({});
            }
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
        filterExpression = {
            "users": $("DisplayName").attr("type")
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Perfil',
                dataProvider: dataProvider,
                read: {
                    headers: {
                        "X-Everlive-Filter": JSON.stringify(filterExpression)
                    }
                }
            },
            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

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
                        'nombres': {
                            field: 'nombres',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        usersModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {
                app.mobileApp.navigate('#components/users/edit.html?uid=' + e.dataItem.uid);

            },
            addClick: function () {
                app.mobileApp.navigate('#components/users/add.html');
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = usersModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.nombres) {
                    itemModel.nombres = String.fromCharCode(160);
                }

                usersModel.set('currentItem', null);
                usersModel.set('currentItem', itemModel);
            },
            goToDirecciones: function () {

                app.mobileApp.navigate('#components/direccion/direcciones.html');

            },
            currentItem: null
        });

    parent.set('addItemViewModel', kendo.observable({
        onShow: function (e) {
            // Reset the form data.
            this.set('addFormData', {
                dni: '',
                telefono: '',
                apeMaterno: '',
                apePaterno: '',
                nombres: '',
            });
        },
        onSaveClick: function (e) {

            // app.mobileApp.navigate('components/direccion/view.html');
            var addFormData = this.get('addFormData'),
                dataSource = usersModel.get('dataSource');

            dataSource.add({
                dni: addFormData.dni,
                celular: addFormData.telefono,
                apeMaterno: addFormData.apeMaterno,
                apePaterno: addFormData.apePaterno,
                nombres: addFormData.nombres,
                users: app.user.Id,
            });

            dataSource.one('change', function (e) {
                app.mobileApp.navigate('#:back');
                // app.mobileApp.navigate('components/direccion/view.html');
            });

            dataSource.sync();
        }
    }));

    parent.set('editItemViewModel', kendo.observable({
        onShow: function (e) {
            var itemUid = e.view.params.uid,
                dataSource = usersModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid);

            this.set('itemData', itemData);
            this.set('editFormData', {
                dni: itemData.dni,
                telefono: itemData.celular,
                apeMaterno: itemData.apeMaterno,
                apePaterno: itemData.apePaterno,
                nombres: itemData.nombres,
            });
        },
        onSaveClick: function (e) {
            var editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = usersModel.get('dataSource');

            // prepare edit
            itemData.set('dni', editFormData.dni);
            itemData.set('celular', editFormData.telefono);
            itemData.set('apeMaterno', editFormData.apeMaterno);
            itemData.set('apePaterno', editFormData.apePaterno);
            itemData.set('nombres', editFormData.nombres);

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
            parent.set('usersModel', usersModel);
        });
    } else {
        parent.set('usersModel', usersModel);
    }

    parent.set('onShow', function (e) {
        // var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
        // fetchFilteredData(param);
        var param = $("#DisplayName").attr("type");
        var searchVal = param,
            searchFilter;
        if (searchVal) {
            searchFilter = {
                field: 'users', // -> Id is ok , Seguimiento dont work
                operator: 'eq',
                value: param,
            };
        }
        fetchFilteredData(usersModel.get('paramFilter'), searchFilter);

    });
})(app.users);

// START_CUSTOM_CODE_usersModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_usersModel