# loginAndRegister

## Description
Rest API project to Register and Login users with encrypted password and session tokens in Node/Express using a mongoDB database, just for educational purposes.

## Usage

  1. Clone git repostory: ```git clone https://github.com/AdrianSoutoDev/loginAndRegisterAPI.git```

  2. Go to root directory: ```cd loginAndRegisterAPI```

  3. Install dependencies: ```npm install```

  4. Create the .env file: ```development.env```
     
  5. Add content to .env file:
      
    NODE_ENV=development
            
    //express server configuration
    HOST=
    PORT=
              
    //database configuration
    MONGO_DB_URI=
    
    //JSonWebToken secret
    JWTSECRET=

  6. Run tests: ```npm run test```

  7. Run develop mode: ```npm run dev```
