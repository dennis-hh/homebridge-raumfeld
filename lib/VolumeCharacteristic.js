var inherits = require("util").inherits;
var Characteristic = require("hap-nodejs").Characteristic;
  VolumeCharacteristic = function() {
    Characteristic.call(this, 'Lautstärke', '91288267-5678-49B2-8D22-F57BE995AA93');
    this.setProps({
      format: Characteristic.Formats.INT,
      unit: Characteristic.Units.PERCENTAGE,
      maxValue: 100,
      minValue: 0,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };

inherits(VolumeCharacteristic, Characteristic);

module.exports = VolumeCharacteristic;
