![Tux For Starters](/images/tux4start-headicon.png)
# Tux For Starters

Providing a fun, accessible, and friendly tutorial web app for students to learn about operating Linux or other Unix-like system environments alongside their programming studies.

Created by Joaquin Padilla, Mayank Joshi, Alexis Herrera, and Justin Asbury.

A capstone project for the Bachelor of Science in Information Technology at the [University of South Florida](https://www.usf.edu).

## Usage:
To start Tux For Starters, make sure your current working directory is the root of this repository.

By default, the server will start in port `5000` unless overriden.

Make sure to provide an HTTPS private key (`privkey.pem`) and certificate file (`cert.pem`) in your copy of the repository.

If you are unable to use HTTPS, either due to the lack of key files or HTTPS is blocked, you can edit the backend script and comment out the HTTPS constants, HTTPS key variables, and the HTTPS create server call. Uncomment the fallback `app` call.

Reminder: Not using HTTPS may be considered unsafe, so it is strongly recommended that you generate a private key and certificate file using a utility like [Certbot](https://certbot.eff.org/) and use HTTPS service.

Create a `.env` file containing a database endpoint running MariaDB. A `PORT` parameter may also be provided to override the default service port.
```
MD_HOST = 0.0.0.0
MD_USER = username
MD_PASSWORD = P4$$w0rd!
MD_PORT = 3306
MD_DATABASE = tuxdb

[PORT=443]
```

Afterwards, execute the backend script by using the following command.
```
node Backend/index.js
```

## Errata:
There might be issues when using the Node module for `bcrypt` on Linux deployments of Tux For Starters. We suggest using Node version 14.15.1 for these deployments by installing it through `nvm` then running `nvm use 14.15.1`, followed by `npm install bcrypt`.

## External Dependencies:
* [MariaDB](https://mariadb.org/)
* [Bootstrap](https://getbootstrap.com/)
* [JQuery](https://jquery.com/)
* [Xterm.js](https://github.com/xtermjs/xterm.js)
* [Axios](https://github.com/axios/axios)
* [Node](http://nodejs.org/)
    * [Express](http://expressjs.com/)
    * [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)
    * [body-parser](https://github.com/expressjs/body-parser)
    * [nodemon](https://github.com/remy/nodemon)
    * [dotenv](https://github.com/motdotla/dotenv)
