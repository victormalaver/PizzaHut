'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
    var provider = app.data.pizzaHut,
        mode = 'signin',
        rememberKey = 'pizzaHut_authData_homeModel',
        init = function (error) {
            console.log("mode1: " + mode);
            if (error) {
                if (error.message) {
                    alert(error.message);
                }
                return false;
            }

            var activeView;
            switch (mode) {
                case 'signin':
                    activeView = '.signin-view';
                    break;
                case 'register':
                    activeView = '.signup-view';
                    break;
                default:
                    activeView = '.signin-view';
                    break;
            }
            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }

            var rememberedData = localStorage ? JSON.parse(localStorage.getItem(rememberKey)) : app[rememberKey];
            if (rememberedData && rememberedData.email && rememberedData.password) {

                parent.homeModel.set('email', rememberedData.email);
                parent.homeModel.set('password', rememberedData.password);
                parent.homeModel.signin();
            }
        },
        successHandler = function (data) {

            console.log("mode2: " + mode);

            var model = parent.homeModel || {},
                logout = model.logout;

            if (logout) {
                model.set('logout', null);
                mode = "logout";
            }

            var redirect;
            switch (mode) {
                case 'signin':
                    redirect = 'categorias';
                    break;
                default:
                    redirect = 'categorias';
                    break;
            }

            if (data && data.result) {

                console.log("mode3: " + mode);
                if (logout) {
                    provider.Users.logout(init, init);
                    return;
                }
                var rememberedData = {
                    email: model.email,
                    password: model.password
                };
                if (model.rememberme && rememberedData.email && rememberedData.password) {
                    if (localStorage) {
                        localStorage.setItem(rememberKey, JSON.stringify(rememberedData));
                    } else {
                        app[rememberKey] = rememberedData;
                    }
                }
                console.log(app);
                app.user = data.result;
                console.log(app.user);
                console.log("app.user.DisplayName: " + app.user.DisplayName);
                console.log("app.user.Id: " + app.user.Id);
                console.log("app.user.principal_id: " + app.user.principal_id);
                if (app.user.DisplayName) {
                    $("#DisplayName").html('<span class="km-icon km-contacts"></span>' + app.user.DisplayName);
                } else {
                    $("#DisplayName").html('<span class="km-icon km-contacts"></span>' + "Mi Perfil");
                }
                if (app.user.principal_id) {
                    $("#DisplayName").attr('href', "components/users/view.html?uid=" + app.user.principal_id);
                    $("#DisplayName").attr('type', app.user.principal_id);
                    console.log("app.user.principal_id: " + app.user.principal_id);
                } else {
                    $("#DisplayName").attr('href', "components/users/view.html?uid=" + app.user.Id);
                    $("#DisplayName").attr('type', app.user.Id);
                    console.log("app.user.Id: " + app.user.Id);
                }
                setTimeout(function () {
                    $("#appDrawer").removeAttr("style");
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                console.log("mode4: " + mode);
                init();
            }
        },
        homeModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            validateData: function (data) {
                if (!data.email) {
                    alert('Missing email');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function () {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }
                provider.Users.login(email, password, successHandler, init);
            },
            register: function () {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password,
                    displayName = model.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.register(email, password, attrs, successHandler, init);
            },
            registrarView: function () {
                mode = 'register';
                init();
            },
            iniciarView: function () {
                mode = 'signin';
                init();
            }
        });

    parent.set('homeModel', homeModel);
    parent.set('afterShow', function (e) {
        if (e && e.view && e.view.params && e.view.params.logout) {
            if (localStorage) {
                localStorage.setItem(rememberKey, null);
            } else {
                app[rememberKey] = null;
            }
            homeModel.set('logout', true);
        }
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel