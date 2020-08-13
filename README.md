# BackendConnecteursTest

This is an API for a technical test

# Configurations

$ touch .env at root

```sh
echo "
LOGIN=${login}
PASSWORD=${password}
CLIENTID=${clientId}
CLIENTSECRET=${clientSecret}
SERVER_PORT=${your_server_port}
API_HOST=http://localhost
API_PORT=3000
ENCODEDAUTH=${${encodeauth}}
" > .env
```

## Installing and run server (Make sure challenge-backend-connectors is running)

```
npm install
npm start or node index.js
```

##  Get All accounts and his transaction

```
 Call get method on url : localhost:${your_server_port}/data
```