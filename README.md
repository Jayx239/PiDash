# PiDash
A Raspberry Pi management WebApp

## Overview
PiDash is a remote web server management application that allows a user to view server hardware measurements as well as manage applications running on the server.



#### Features:
* Server health monitoring on PiDash page
* Remote WebApp management through Server Manager page
* User account security features. Ability to create acounts and admins.

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
    *  File Formats

    sql.config -
    ```json
    {
        "host": "<Db_Host_IP(ie:localhost)(optional)>",
        "password": "<database_user_password>",
        "user": "<database_username>",
        "database": "<database_name>"
    }
    ```
    server.config -
    ```json
    {
        "ip":"<host_address(optional)>",
        "port":"<port_no>"
    }
    ```
5. Create Database
    ```bash
    #Navigate to config directory
    cd config/
    #Run config file
    node ConfigureSql.js
    ```
#### Running PiDash
In the project node directory run:
```bash
node index.js
```

### User Manual
* Registering
    1. Navigate to url:port/LogonRegister/Register
    2. Enter in registration details.
    3. Submit details
* Loging in:
    1. Navigate to url:port/LogonRegister/Logon
    2. Enter user credentials
    3. Submit details

* After Logon
    * Dashboard (default page)
        * url:port/Dashboard
        * A basic dashboard with drag and drop angular apps for monitoring server memory usage and cpu usage. Apps are draggable.
    * Server Manager
        * url:port/ServerManager
        * Requires Admin Privilages
        * A management page for running and monitoring web apps running on the server.
        * Run remote commands on server.
        * Run web apps and monitor the log printed to stdout and stderr.
        * Execute web app commands.