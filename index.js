var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-raumfeld", "Raumfeld", RaumfeldAccessory);
}

function RaumfeldAccessory(log, config) {
    this.log = log;
    //this.name = config["name"];
    this.log("constructor");
    this.service = new Service.LockMechanism(this.name);
    this.service.getCharacteristic(Characteristic.LockCurrentState)
        .on("get", this.getState.bind(this));
}

RaumfeldAccessory.prototype.getState = function(callback) {
    this.log("Getting current state...");
}

RaumfeldAccessory.prototype.getServices = function() {
    this.log("get services");
    return [this.service];
}
