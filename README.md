# Raumfeld plugin for Homebridge

This is a plugin to connect Raumfeld hardware to Apple's Homekit via the Homebridge system.

## This is Work In Progress, use carefully.
Please visit [homebridge github homepage](https://github.com/nfarina/homebridge) first.

### Prerequisites
This plugin requires at least one running Raumfeld device in order to work.

### Installation
Please follow the installation guide for homebridge, first (see link above). Afterwards, simply install this plugin (assuming that homebridge is installed globally): `sudo npm install -g homebridge-raumfeld`. Now copy the `config-sample.json`to your homebridge home folder (usually `/home/username/.homebridge`) and rename it to `config.json`.
Finally, you can the setup with `homebridge`. Device detection should start immediately. You should see messages like `registering Kitchen with UUID 341c5354-c570-4697-a58c-44916f110c87` for all of your Raumfeld devices.
Follow homebridge's steps to register it with Homekit, and your Raumfeld devices should show up in apps like Elgato Eve.

### Features
Currently, only play/pause and volume control are supported. More is in the works.
