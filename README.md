## FOR PRISMA

1. npx prisma generate // that's it for to sync it with your local codebase.
2. setup the .env DB URL 



### BACKEND SCRIPT FOR PRODUCTION : 

{
  "name": "batch",
  "version": "1.0.0",
  "description": "",
  "main": "/src/server.js",
  "scripts": {
    "build" : "tsc",
    "local" : "nodemon src/server.ts",
    "start": "node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/dotenv": "^6.1.1",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^25.2.3",
    "@types/pg": "^8.16.0",
    "@types/socket.io": "^3.0.1",
    "prisma": "^7.3.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "@types/ws": "^8.18.1",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.2.4",
    "graphql": "^16.12.0",
    "jsonwebtoken": "^9.0.3",
    "nodemon": "^3.1.11",
    "pg": "^8.18.0",
    "socket.io": "^4.8.3",
    "ws": "^8.19.0",
    "y-websocket": "^3.0.0",
    "yjs": "^13.6.29"
  }
}