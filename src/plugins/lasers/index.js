(function () {
  function Laser(name, deps) {
    deps.logger.debug('Laser plugin loaded');
    var claserstate = 0;
    // Cockpit
    deps.cockpit.on('plugin.laser.set', function (value) {
      sendLaser(value);
    });
    // Arduino
    deps.globalEventLoop.on('mcu.status', function (data) {
      if ('claser' in data) {
        var enabled = data.claser == 255;
        deps.cockpit.emit('plugin.laser.state', { enabled: enabled ? true : false });
      }
    });
    var sendLaser = function (state) {
      var claserstate;
      if (state === 1) {
        claserstate = 255;
      } else {
        claserstate = 0;
      }
      deps.globalEventLoop.emit('mcu.SendCommand', 'claser(' + claserstate + ')');
    };
  }
  module.exports = function (name, deps) {
    return new Laser(name, deps);
  };
}());