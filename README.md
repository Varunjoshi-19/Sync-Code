## FOR PRISMA

1. npx prisma generate // that's it for to sync it with your local codebase.
2. setup the .env DB URL 



### BACKEND SCRIPT FOR PRODUCTION : 

   "scripts": {
    "build": "npx prisma generate && npm install && tsc",
    "start": "node dist/server.js"
  },

## DEV : 
   "main": "server.ts",
    "scripts": {
    "local": "nodemon ./src/server.ts"
  },


  ## other 


    "scripts": {
      "start": "ts-node src/server.ts"
  },
