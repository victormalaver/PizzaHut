'use strict';

app.home = kendo.observable({
    onShow: function () {
        var mv = $("#modalInfoRegistro").data("kendoMobileModalView");
        mv.shim.popup.options.animation.open.effects = "zoom";
        mv.open();
    },
    afterShow: function () {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
    var provider = app.data.pizzaHut,
        mode = 'signin',
        registerRedirect = 'categorias',
        signinRedirect = 'categorias',
        rememberKey = 'pizzaHut_authData_homeModel',
        init = function (error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }
                return false;
            }
			
            if(mode=="verPerfil"){
                app.mobileApp.navigate('#components/users/add.html');
                return true;
            }
            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';
            
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
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect,
                model = parent.homeModel || {},
                logout = model.logout;

            if (logout) {
                model.set('logout', null);
            }
            if (data && data.result) {
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
                app.user = data.result;

                setTimeout(function () {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        homeModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            password2: '',
            validateData: function (data) {
                if (!data.email) {
                    alert('Ingrese su Email');
                    return false;
                }

                if (!data.password) {
                    alert('Ingrese su Contraseña');
                    return false;
                }

                return true;
            },
            validatePass: function (data) {
                console.log(data);
                if (data.password !== data.password2) {
                    alert('Las contraseñas no coinciden');
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
                if (!model.validatePass(model)) {
                    return false;
                }
                mode = 'verPerfil';
                init();
                // provider.Users.register(email, password, attrs, successHandler, init);
            },
            toggleView: function () {
                mode = mode === 'signin' ? 'register' : 'signin';
                init();
            },
            iniciarView: function () {
                mode = 'signin';
                init();
            },
            registroView: function () {
                mode = 'register';
                init();
            },
            


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