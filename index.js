var RaumfeldManager = require("node-raumfeld");
//var loglevel = require("loglevel");
var VolumeCharacteristic = require("./lib/VolumeCharacteristic");
//loglevel.setLevel("debug");

module.exports = function(homebridge) {
    Accessory = homebridge.platformAccessory;
    UUIDGen = homebridge.hap.uuid;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    Homebridge = homebridge;

    homebridge.registerPlatform("homebridge-raumfeld", "Raumfeld", RaumfeldPlatform, true);
}

function RaumfeldPlatform(log, config, api) {
    this.log = log;
    this.api = api;
    this.config = config;
    this.accessories = {};
    this.manager = new RaumfeldManager();

    var self = this;

    this.api.on('didFinishLaunching', function() {
    	self.log("Plugin finished launching");
        self.manager.discover("virtual", 20000);
        self.manager.on("rendererFound", function(renderer) {
            self.registerAccessory(renderer);
        });
  	}.bind(this));
}

RaumfeldPlatform.prototype.configureAccessory = function(accessory) {
    var self = this;
    this.log("Plugin - Configure Accessory: " + accessory.displayName);
    var rendererUrl = accessory.context.rendererUrl;
    accessory.reachable = false;
    self.accessories[accessory.UUID] = accessory;
    this.manager.createDevice(rendererUrl).then(function(device) {
        self.addSwitchService(accessory, device);
        accessory.reachable = true;
    });
}

RaumfeldPlatform.prototype.configurationRequestHandler = function(context, request, callback) {
    this.log("Context: ", JSON.stringify(context));
    this.log("Request: ", JSON.stringify(request));
}

RaumfeldPlatform.prototype.registerAccessory = function(renderer) {
    var accessory = this.createAccessory(renderer);
      if(accessory.UUID in this.accessories) {
          if(accessory.displayName === this.accessories[accessory.UUID].displayName) {
              //this.log(accessory.displayName + " already registered; skipping");
              return;
          }
          //unregister accessory since apparently a zone was formed with the same UUID
          this.unregisterAccessory(accessory);

          //wait one cycle
          return;
      }
      accessory.reachable = true;
      this.accessories[accessory.UUID] = accessory;
      this.log("Registering " + accessory.displayName + " with UUID " + accessory.UUID);
      this.api.registerPlatformAccessories("homebridge-raumfeld", "Raumfeld", [accessory]);
}

RaumfeldPlatform.prototype.unregisterAccessory = function(accessory) {
    this.log("Unregistering " + this.accessories[accessory.UUID].displayName + " with UUID " + accessory.UUID);
    this.api.unregisterPlatformAccessories("homebridge-raumfeld", "Raumfeld", [this.accessories[accessory.UUID]]);
    delete this.accessories[accessory.UUID];
}

RaumfeldPlatform.prototype.createAccessory = function(renderer) {
    var uuid = Homebridge.hap.uuid.generate(String(renderer.uuid));
    var accessory = new Accessory(renderer.name, uuid);
    accessory.context.rendererUrl = renderer.client.url;
    var informationService = accessory.getService(Homebridge.hap.Service.AccessoryInformation);

    informationService
        .setCharacteristic(Characteristic.Manufacturer, renderer.manufacturer)
        .setCharacteristic(Characteristic.Model, renderer.modelNumber);
        //.setCharacteristic(this.homebridge.hap.Characteristic.SerialNumber, this.renderer.serialNumber)

    this.addSwitchService(accessory, renderer);

    return accessory;
}

RaumfeldPlatform.prototype.addSwitchService = function(accessory, renderer) {
    var self = this;
    accessory.on("identify", function(paired, callback) {
        console.log("identify " + accessory.displayName + " - is paired: " + paired);
        callback();
    })
    var switchService = accessory.getService(Homebridge.hap.Service.Switch);
    if (switchService != undefined) {
        //seems to be an accessory recovered from cache; we have to recreate switch service
        accessory.removeService(switchService);
    }
    switchService = new Homebridge.hap.Service.Switch(accessory.displayName);
    switchService
        .getCharacteristic(Characteristic.On)
        .on('get', function(callback) {
            renderer.getState().then(function(state) {
                callback(null, state);
            }, function(reason) {
                self.unregisterAccessory(accessory);
            })
        })
        .on('set', function(on, callback) {
            if(on) {
                renderer.play().then(function(result) {
                    callback(null);
                });
            } else {
                renderer.stop().then(function(result) {
                    callback(null);
                });
            }
        });
        switchService
            .addCharacteristic(VolumeCharacteristic)
            .on('get', function(callback) {
                renderer.getVolume().then(function(volume) {
                    callback(null, Number(volume));
                }, function(reason) {
                    self.unregisterAccessory(accessory);
                })
            })
            .on('set', function(volume, callback) {
                renderer.setVolume(volume).then(function() {
                    callback(null);
                })
            });

    accessory.addService(switchService);
}
