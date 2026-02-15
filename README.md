## FOR PRISMA

1. npx prisma generate // that's it for to sync it with your local codebase.
2. setup the .env DB URL 



### BACKEND SCRIPT FOR PRODUCTION : 

# PRODUCTION : 

 "main" : "/src/server.js",

 "scripts" : {
   "build" : "npm install && npx prisma generate  && tsc",
     "start": "node dist/src/server.js"
 }



## DEVLOPEMENT : 
   "main": "server.ts",
    "scripts": {
    "local": "nodemon ./src/server.ts"
  },


 