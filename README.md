# Tux For Starters

Providing a fun, accessible, and friendly tutorial web app for students to learn about operating Linux or other Unix-like system environments alongside their programming studies.

Created by Joaquin Padilla, Mayank Joshi, Alexis Herrera, and Justin Asbury.

A capstone project for the Bachelor of Science in Information Technology at the [University of South Florida](https://www.usf.edu).

## Usage:
To start Tux For Starters, make sure your current working directory is the root of this repository.

By default, the server will start the in port `5000` unless overriden.

Please make sure to provide your HTTPS private key (`privkey.pem`) and certificate file (`cert.pem`) in your copy of the repository.

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
