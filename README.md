# Colima Desktop

[Colima](https://github.com/abiosoft/colima)'s desktop utility.

## Project Goals

I'd like to keep this as simple as possible.
At the moment, I don't have any plans to add any fancy features. (Like listing containers, images, etc.)

Currently, I'm only targeting macOS. (But maybe Windows and Linux will be supported in the future.)

## Features

- ✅ Start/Stop/Restart Colima via the CLI command
- ✅ Display Colima status (Running, Stopped, Starting, Stopping, Restarting)
- ✅ Animated tray icon
- 📋 Logging
  - ✅ Save and view logs (from the Colima CLI)
  - 📋 Clear logs
- 📋 Colima settings
  - ✅ Colima start arguments
  - ✅ Colima path
  - 📋 Launch Colima Desktop at login
  - 📋 Colima version
  - 📋 Settings design

✅ = Implemented

📋 = Planned

## Installation

// TODO: Figure out how to distribute this. (brew? npm? github releases?)

// TODO: Add Installation instructions

## Building from Source

```bash
git clone https://github.com/dhodvogner/colima-desktop.git
cd colima-desktop
npm install
npm run clean
npm run make
```

## Development

```bash
git clone https://github.com/dhodvogner/colima-desktop.git
cd colima-desktop
npm install
npm start
```

## License

MIT