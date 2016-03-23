var VolumeCharacteristic = require("./VolumeCharacteristic");

var RaumfeldRendererAccessory = function(platform, homebridge, raumfeldRenderer) {
    this.platform = platform;
    this.homebridge = homebridge;
    this.renderer = raumfeldRenderer;
    this.name = this.renderer.name;
    this.log = this.platform.log;

    RaumfeldRendererAccessory.super_.call(
    this,
    this.name,
    homebridge.hap.uuid.generate(String(this.renderer.uuid))
    );
    //register services
    this.services.push(this.getInformationService());
    this.services.push(this.getSwitchService());

}

RaumfeldRendererAccessory.prototype.getServices = function() {
    return this.services;
}

RaumfeldRendererAccessory.prototype.getInformationService = function() {
  var service = new this.homebridge.hap.Service.AccessoryInformation();
  service
        .setCharacteristic(this.homebridge.hap.Characteristic.Manufacturer, this.renderer.manufacturer)
        .setCharacteristic(this.homebridge.hap.Characteristic.Model, this.renderer.modelNumber)
        //.setCharacteristic(this.homebridge.hap.Characteristic.SerialNumber, this.renderer.serialNumber)
        .setCharacteristic(this.homebridge.hap.Characteristic.Name, this.name);

    return service;
}

RaumfeldRendererAccessory.prototype.getSwitchService = function() {
  var service = new this.homebridge.hap.Service.Switch(this.name);
    service
        .getCharacteristic(this.homebridge.hap.Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    service
        .addCharacteristic(VolumeCharacteristic)
        .on('get', this.getVolume.bind(this))
        .on('set', this.setVolume.bind(this));

    return service;
}

RaumfeldRendererAccessory.prototype.getOn = function(callback) {
    this.renderer.getState().then(function(state) {
        callback(null, state);
    }.bind(this));
}

RaumfeldRendererAccessory.prototype.setOn = function(on, callback) {
    if(on) {
        this.renderer.play().then(function(result) {
            callback(null);
        }.bind(this));
    } else {
        this.renderer.stop().then(function(result) {
            callback(null);
        }.bind(this));
    }
}

RaumfeldRendererAccessory.prototype.getVolume = function(callback) {
    this.renderer.getVolume().then(function(volume) {
        callback(null, Number(volume));
    }.bind(this));
}

RaumfeldRendererAccessory.prototype.setVolume = function(volume, callback) {
    this.renderer.setVolume(volume).then(function(volume) {
        callback(null);
    }.bind(this));
}

module.exports = RaumfeldRendererAccessory;
