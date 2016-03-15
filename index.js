var RaumfeldManager = require("node-raumfeld");
var loglevel = require("loglevel");
loglevel.setLevel("debug");
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    console.log("homebridge API version: " + homebridge.version);

    // Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory;

    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerPlatform("homebridge-raumfeld", "Raumfeld", RaumfeldPlatform, true);
}

function RaumfeldPlatform(log, config, api) {
    this.log = log;
    this.config = config;
    this.accessories = [];
    this.manager = new RaumfeldManager();

    var self = this;
    this.manager.discover();
    setTimeout(function() {
        self.manager.getDevices().forEach(function(device) {
            self.addAccessory(device.device);
        });

        api.registerPlatformAccessories("homebridge-raumfeld", "Raumfeld", self.accessories);
    }, 5000);

}

RaumfeldPlatform.prototype.configureAccessory = function(accessory) {
    this.log("configureAccessory")
}

RaumfeldPlatform.prototype.addAccessory = function(raumfeldDevice) {
    this.log("Add accessory " + raumfeldDevice.name);
    var uuid = UUIDGen.generate(raumfeldDevice.name);
    console.log(raumfeldDevice.name + " has uuid " + uuid);
    var accessory = new Accessory(raumfeldDevice.name, uuid);
    accessory.on("identify", function(paired, callback) {
       console.log("identify!");
    });

    accessory.addService(Service.Switch, raumfeldDevice.name)
    .getCharacteristic(Characteristic.On)
    .on("set", function(on, callback) {
        console.log(value);
        console.log(callback);
            if(on) {
                raumfeldDevice.play();
            } else {
                raumfeldDevice.stop();
            }
    });
    this.accessories.push(accessory);
}

RaumfeldPlatform.prototype.removeAccessory = function(raumfeldDevice) {
    this.log("removeAccessory")
}

RaumfeldPlatform.prototype.updateAccessoriesReachability = function() {
    this.log("updateAccessoriesReachability")
}
