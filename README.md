## FOR PRISMA

1. npx prisma generate // that's it for to sync it with your local codebase.
2. setup the .env DB URL 



### BACKEND SCRIPT FOR PRODUCTION : 


## for ts
"scripts": {
    "build": "tsc",
    "start": "ts-node src/main/main.ts"
  },
  
  
  
  ## for js

   "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },

## DEV : 
    "scripts": {
    "local": "nodemon ./src/server.ts"
  },