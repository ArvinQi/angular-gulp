require.config({
    //配置angular的路径
    paths:{
        "angular":"path/to/angular", 
        "angular-route":"path/to/angular-route",
    },
    //这个配置是你在引入依赖的时候的包名
    shim:{
        "angular":{
            exports:"angular"
        },
        "angular-route":{
            exports:"angular-route"
        }
    }
});
require(['app'], function(app){
    // do nothing.
});