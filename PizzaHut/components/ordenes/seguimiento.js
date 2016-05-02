'use strict';

app.seguimiento = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
});
var fecha;

function muestraReloj(fechaMod) {
    if (fechaMod) {
        fecha = fechaMod;
    } else {
        fechaMod = fecha;
    }
    var actual = new Date();
    var milisegundos = actual - fechaMod;
    var hora = parseInt(milisegundos / 3600000);
    var restohora = milisegundos % 3600000;
    var minuto = parseInt(restohora / 60000);
    var restominuto = restohora % 60000;
    var segundo = parseInt(restominuto / 1000);
    document.getElementById("tiempoTranscurrido").innerHTML = (hora < 10 ? "0" + hora : hora) + ":" + (minuto < 10 ? "0" + minuto : minuto) + ":" + (segundo < 10 ? "0" + segundo : segundo);
    setTimeout(muestraReloj, 1000);
}

(function (parent) {
    var dataProvider = app.data.pizzaHut,
        cargaPosAlmacenesDespachador = function (dataSource, miLatLong, miArgument) {
            miLatLong = [-12.110300550698781, -77.03691065311432]; //borrar esto por el GPS del despachador
            $("#mapSeguimiento").remove();
            var alto = $(window).height() - $("#headerSeguimiento").height();
            var div = $("<div id='mapSeguimiento' style='width:100%;height:" + alto + "px;' ></div>").text("");
            $("#divMapSeguimiento").after(div);

            //<![CDATA[
            // var restLatLong = [-12.105753065958925, -77.03500092029572];
            var iconMiUbicacion = L.icon({
                iconUrl: 'Mapa/images/mapPinOver2.gif', //iconUrl: 'Mapa/images/markerEntregados.png',
                // iconRetinaUrl: 'my-icon@2x.png',
                // iconSize: [38, 95], 
                iconAnchor: [15, 38], //X,Y
                popupAnchor: [0, -35],
                // // shadowUrl: 'my-icon-shadow.png',
                // shadowRetinaUrl: 'my-icon-shadow@2x.png',
                // shadowSize: [68, 95],
                // shadowAnchor: [22, 94]
            });

            var iconSucursal = L.icon({
                iconUrl: 'Mapa/images/markerRestauranteO.png',
                // iconRetinaUrl: 'my-icon@2x.png',
                // iconSize: [38, 95],
                iconAnchor: [15, 38], //X,Y
                popupAnchor: [0, -35],
                // // shadowUrl: 'my-icon-shadow.png',
                // shadowRetinaUrl: 'my-icon-shadow@2x.png',
                // shadowSize: [68, 95],
                // shadowAnchor: [22, 94]
            });

            var iconSeguimiento = L.icon({
                iconUrl: 'Mapa/images/markerRestaurante5.png',
                // iconRetinaUrl: 'my-icon@2x.png',
                // iconSize: [38, 95],
                iconAnchor: [15, 38], //X,Y
                popupAnchor: [0, -35],
                // // shadowUrl: 'my-icon-shadow.png',
                // shadowRetinaUrl: 'my-icon-shadow@2x.png',
                // shadowSize: [68, 95],
                // shadowAnchor: [22, 94]
            });



            var map = new L.map('mapSeguimiento', {
                center: miLatLong,
                zoom: 15,
            });
            L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                //attribution: "Map: Tiles Courtesy of MapQuest (OpenStreetMap, CC-BY-SA)",
                subdomains: ["otile1", "otile2", "otile3", "otile4"],
                // maxZoom: 12,
                // minZoom: 2
            }).addTo(map);

            var miUbicacion = new L.MarkerClusterGroup();
            var markerClientes = new L.MarkerClusterGroup();
            //markers.addLayer(new L.Marker([1, 1]));


            miUbicacion.addTo(map);
            markerClientes.addTo(map);


            miUbicacion.addLayer(new L.Marker(miLatLong, {
                icon: iconMiUbicacion
            }).bindPopup("<b>Mi pedido está aquí:</b></br>" + miArgument));


            var ubicSeguimientos = "";
            console.log(dataSource);
            dataSource.fetch(function () {
                for (var i = 0; i < 1; i++) { //cantidad de órdenes del cliente
                    if (dataSource.at(i).Localizacion && dataSource.at(i).User.toString() == $("#DisplayName").attr("type")) {
                        var pedido = [];
                        for (var j = 0; j < dataSource.at(i).Producto.length; j++) {
                            pedido.push("</br>" + dataSource.at(i).Producto[j].nombre + " S/  " + dataSource.at(i).Producto[j].precio);
                        }
                        ubicSeguimientos = dataSource.at(i).Localizacion.replace(/Latitude:|Longitude:|&nbsp/gi, ""); //[43.465187, -80.52237200000002];
                        var seguimientoLatLong = [parseFloat(ubicSeguimientos.substring(0, ubicSeguimientos.indexOf(","))), parseFloat(ubicSeguimientos.substring(ubicSeguimientos.indexOf(",") + 1, ubicSeguimientos.length))];
                        markerClientes.addLayer(new L.Marker(seguimientoLatLong, {
                            icon: iconSeguimiento
                        }).bindPopup("<big>Orden: " + dataSource.at(i).Codigo + "</big></br><b><em>" + pedido + "</em></b></br></br>Total: S/. " + dataSource.at(i).Precio + "</br>" + dataSource.at(i).Estado + "</br>Dirección: " + dataSource.at(i).Direccion[0].calle + dataSource.at(i).Direccion[0].numero + " - " + dataSource.at(i).Direccion[0].distrito));
                        muestraReloj(dataSource.at(0).ModifiedAt);
                        map.panTo(new L.LatLng(parseFloat(ubicSeguimientos.substring(0, ubicSeguimientos.indexOf(","))), parseFloat(ubicSeguimientos.substring(ubicSeguimientos.indexOf(",") + 1, ubicSeguimientos.length))));
                        // map.setView(new L.LatLng(40.737, -73.923), 8);

                        miLatLong = miLatLong.toString();
                        var a = new L.LatLng(parseFloat(ubicSeguimientos.substring(0, ubicSeguimientos.indexOf(","))), parseFloat(ubicSeguimientos.substring(ubicSeguimientos.indexOf(",") + 1, ubicSeguimientos.length)));
                        var b = new L.LatLng(parseFloat(miLatLong.substring(0, miLatLong.indexOf(","))), parseFloat(miLatLong.substring(miLatLong.indexOf(",") + 1, miLatLong.length)));
                        $("#distanciaPedido").text(parseInt(a.distanceTo(b)));

                    }
                }

            });
        },
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('seguimientoModel'),
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
            var miLatLong = [];
            var miArgument = [];
            //Cambiear esto por el GPS del despachador
            navigator.geolocation.getCurrentPosition(function (position) {
                    miLatLong = [parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)];
                    miArgument = 'Latitude: ' + position.coords.latitude + '<br />' +
                        'Longitude: ' + position.coords.longitude + '<br />' +
                        'Altitude: ' + position.coords.altitude + '<br />' +
                        'Accuracy: ' + position.coords.accuracy + '<br />' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                        'Heading: ' + position.coords.heading + '<br />' +
                        'Speed: ' + position.coords.speed + '<br />' +
                        'Timestamp: ' + position.timestamp + '<br />';
                    cargaPosAlmacenesDespachador(dataSource, miLatLong, miArgument);
                },
                function (error) {
//                     alert('code: ' + error.code + '\n' +
//                         'message: ' + error.message + '\n'); 
                    miLatLong = "Aqui colocar la ubicación del despachador";
                    miArgument = 'Despachador PizzaHut';
                    cargaPosAlmacenesDespachador(dataSource, miLatLong, miArgument);
                });
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
                //         "X-Everlive-Filter": JSON.stringify({"$and": [{"Id": '73411240-0e6c-11e6-ba80-099d3413d916'}]})
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
        seguimientoModel = kendo.observable({
            dataSource: dataSource,
            searchChange: function (e) {
                var searchVal = e.target.value,
                    searchFilter;
                if (searchVal) {
                    searchFilter = {
                        field: 'Id', // -> Id is ok , Seguimiento dont work
                        operator: 'eq',
                        value: searchVal,
                    };
                }
                fetchFilteredData(seguimientoModel.get('paramFilter'), searchFilter);
            },
            currentItem: null,

        });


    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('seguimientoModel', seguimientoModel);
        });
    } else {
        parent.set('seguimientoModel', seguimientoModel);
    }

    parent.set('onShow', function (e) {
        // var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
        // fetchFilteredData(param);

        var param = e.view.params.filter;
        var searchVal = param,
            searchFilter;
        if (searchVal) {
            searchFilter = {
                field: 'Id', // -> Id is ok , Seguimiento dont work
                operator: 'eq',
                value: searchVal,
            };
        }
        fetchFilteredData(seguimientoModel.get('paramFilter'), searchFilter);
    });

})(app.seguimiento);