# PiDash
A Raspberry Pi management WebApp

## Overview
PiDash is a remote web server management application that allows a user to view server hardware measurements as well as manage applications running on the server.
#### Install
1. Clone Repository
```bash
git clone https://github.com/Jayx239/PiDash.git
```
2. Navigate to project root directory
```bash
cd ./PiDash/node/
```
3. Build project
```bash
make all
```
4. Create configuration files by running configurator
```bash
make configurator
```

#### Running PiDash
In the project node directory run:
```bash
node index.js
```

#### Features:
* Server health monitoring on PiDash page
* Remote WebApp management through Server Manager page
* __Warning__: This app is mid-development and therefore has security vulnerabilities. I highly recommend not running this app on any public ports as the Server Manager allows unauthorized users to run server commands remotely.