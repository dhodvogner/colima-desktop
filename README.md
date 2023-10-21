# Colima Desktop

[Colima](https://github.com/abiosoft/colima)'s desktop utility.

## Project Goals

I'd like to keep this as simple as possible.

At the moment, I don't have any plans to add any fancy features. (Like listing containers, images, etc.)

Read the [Features](#features) section for more information.

Currently, I'm only targeting MacOS. (But maybe Windows and Linux will be supported in the future.)

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

✅ = Implemented 📋 = Planned

See the [PLAN - v1.0.0](https://github.com/dhodvogner/colima-desktop/issues/1) issue for more information.

## Installation

1. Make sure you have [Colima](https://github.com/abiosoft/colima) installed on your system.
2. Note down the path to the `colima` binary. (Run `which colima` in your terminal.)
3. Download the latest release from the [releases page](https://github.com/dhodvogner/colima-desktop/releases).

## Building from Source

```bash
git clone https://github.com/dhodvogner/colima-desktop.git
cd colima-desktop
nvm use
npm install
npm run clean
npm run make
```

## Development

```bash
git clone https://github.com/dhodvogner/colima-desktop.git
cd colima-desktop
nvm use
npm install
npm start
```

## Contributing

Any contributions you make are **greatly appreciated**.

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

To keep the codebase consistent, please run `npm run lint` before committing your changes.

By contributing, you agree that your contributions will be licensed under its MIT License.

## License

[MIT](./LICENSE.md)