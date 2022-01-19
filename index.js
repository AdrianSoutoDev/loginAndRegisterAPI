require('./mongodb');
const config = require('./config.js');
const express = require('express');
const app = express();
const cors = require('cors');
const userExtractor = require('./src/middleware/user_extractor.js');
const notFound = require('./src/middleware/not_found.js');
const handleErrors = require('./src/middleware/handle_errors.js')
const securityPaths = require('./src/middleware/security_paths.js')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
   console.log(request.route.path)
    return response.send('<h1>Hello world</h1>')
 });

app.get('/home', userExtractor, (request, response) => {
   const {userId} = request
   return response.send('<h1>Hello user nº: ' + userId +'</h1>')
});

app.get('/admin/', userExtractor, securityPaths,(request, response) => {
   const {userId} = request
   return response.send('<h1>Hello admin nº: ' + userId +'</h1>')
});

app.get('/user/', userExtractor, securityPaths, (request, response) => {
   const {userId} = request
   return response.send('<h1>Hello user nº: ' + userId +'</h1>')
});
    
const routes = require('./src/routes/routes')
routes(app)
    
app.use(notFound);
app.use(handleErrors);
  
const PORT = config.PORT
app.listen(PORT)
console.log(`server running at port ${PORT}`)