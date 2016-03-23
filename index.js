var RaumfeldManager = require("node-raumfeld");
var loglevel = require("loglevel");
var RendererAccessory = require("./lib/RaumfeldRendererAccessory");
var utils = require("./lib/utils");
//loglevel.setLevel("debug");

module.exports = function(homebridge) {
    // Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.hap.Accessory;
    Homebridge = homebridge;

    utils.addSupportTo(RendererAccessory, Accessory);
    homebridge.registerPlatform("homebridge-raumfeld", "Raumfeld", RaumfeldPlatform);
}

function RaumfeldPlatform(log, config, api) {
    this.log = log;
    this.config = config;
    this.manager = new RaumfeldManager();

    var self = this;
    this.manager.discover(true);
}

RaumfeldPlatform.prototype.accessories = function(callback) {
    var self = this;
    setTimeout(function() {
        callback(self.createAccessories());
    }, 5000);
}

RaumfeldPlatform.prototype.createAccessories = function() {
  var self = this;
  var accessories = [];

  this.manager.getRenderers().forEach(function(renderer) {
    accessories.push(new RendererAccessory(self, Homebridge, renderer));
  });

  return accessories;
}
