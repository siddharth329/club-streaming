# Club Streaming

![Framework](https://img.shields.io/badge/Framework-Express-white)
![Database](https://img.shields.io/badge/Database-MySQL-brightgreen)
![ORM](https://img.shields.io/badge/ORM-Prisma-blue)

Club Streaming is the enhanced version of the Club69 which gives user immersive experience of streaming content directly on the website. This helps on the fly consumption of the finest hand picked scenes from the adult industry.

<br/>

### Developer Guide
---
In the project directory, you can run

### `npm install`

This will install all the dependencies required for the project to run.

<br/>

The required environment variables are:
* ##### Backend
```env
DATABASE_URL
NODE_ENV
PORT
SENDGRID_API_KEY
CLIENT_URL
JWT_AUTHORIZATION_SECRET
CDN_SECURE_TOKEN
CDN_RESOURCE_URL

IMAGEKIT_URL_ENDPOINT
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
```

* ##### Frontend
```env
REACT_APP_IMAGEKIT_URL_ENDPOINT
```


Now after installing all the dependencies and configuring environment variables, you can start the server with two ways:

* ### `npm run dev`
  This will start the server in development mode with nodemon and will be available on localhost at default port 5000 or the port set in the `.env` file

* ### `npm start`
  This will start the server in production mode. All the environment variable must be changed every time the changes are done in the code for security purposes. 