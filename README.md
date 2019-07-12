# PiDash
A Raspberry Pi management WebApp

## Overview
PiDash is a remote web server management application that allows a user to view server hardware measurements as well as manage applications running on the server.


#### Features:
* Server health monitoring on PiDash page
* Remote WebApp management through Server Manager page
* User account security features. Ability to create accounts and admins.

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
    * Requires python, tested for v2.x.x or v3.x.x
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
    # Navigate to config directory
    cd config/
    # Run config file
    node ConfigureSql.js
    ```
6. Create default admin
    ```
    # Navigate to config directory
    cd config/
    # Run CreateDefaultAdmin.js
    node CreateDefaultAdmin.js
    ```
#### Running PiDash
In the project node directory run:
```bash
node index.js
```
### User Manual - Legacy
* Registering
    1. Navigate to url:port/LogonRegister/Register
    2. Enter in registration details.
    3. Submit details
* Logging in:
    1. Navigate to url:port/LogonRegister/Logon
    2. Enter user credentials
    3. Submit details

* After Logon
    * Dashboard (default page)
        * url:port/Dashboard
        * A basic dashboard with drag and drop angular apps for monitoring server memory usage and cpu usage. Apps are draggable.
    * Server Manager
        * url:port/ServerManager
        * Requires Admin Privileges
        * A management page for running and monitoring web apps running on the server.
        * Run remote commands on server.
        * Run web apps and monitor the log printed to stdout and stderr.
        * Execute web app commands.
    * Changing password
        1. Navigate to Account page from the top menu.
        2. Enter password details.
        3. Click reset
    * Granting admin privileges (Requires granting account to be an admin account)
        1. Navigate to Account page from top menu
        2. Enter desired admin username in'New Admin' field
        3. Click Submit
    * Revoke admin privieges
        1. Navigate to Account page from top menu
        2. Click 'Revoke My Privilege' button

Notes:
* Applications are run from the base directory (PiDash/node/), so any application references to
    local directories will start from this directory. For example, log files printed to ./logs/ will print to
    the /PiDash/node/logs.
