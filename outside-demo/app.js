
var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function () {
    let types = myPluginInterface.types

    console.warn('@@@@', types)
    global['wj-types'] = types
  }
})