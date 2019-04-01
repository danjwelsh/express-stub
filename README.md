# express-stub
> A template for a Typescript Express.js API.

[![Build Status](https://travis-ci.com/danjwelsh/express-stub.svg?branch=master)](https://travis-ci.com/danjwelsh/express-stub)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)


## Download
Download the stub from GitHub.
```bash
git clone https://github.com/danjwelsh/express-stub.git
```

## Setup as Blank Project
Run the command below to remove the `.git` folder, and reinitialise as a new repository.
```bash
./setup.sh
```

## Build
Install typescript and compile to JavaScript:
```bash
npm i -g typescript && tsc && cp .env.example .env
```
This will initialise the project with dummy environment variables, the project requires:
```
DEBUG=false
TEST=false
SECRET=changetoasecret
MONGO_URI=mongodb://mongo/stub
```

## Run
```bash
npm run
```

## Test
```bash
npm test
```

# Express Stub
> A template for a Typescript Express.js API.

[![Build Status](https://travis-ci.com/danjwelsh/express-stub.svg?branch=master)](https://travis-ci.com/danjwelsh/express-stub)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

## Build
The API requires the following envrionment variables, store these in a `.env` file at the route of the directory,
or pass them in through Docker. Boolean env variables are either `true` or `false`. Uppercase will not be detected.

| **Name**              | **Type**| **Description**                                                                               |
|-----------------------|---------|---------------------------------------------------------------------------------------------|
| DEBUG                 | Boolean | Returns full error messages if `true`                                                       |
| SECRET                | String  | Application secret for generating JWT tokens                                                |
| MONGO_URI             | String  | URI for MongoDB                                                                             |

Use docker compose to build and run, this will create a mongo instance if you use the local `docker-compose.yml` file.
Or the image can be built using `docker build .`, or can be pulled from `djwelsh/express-stub`.

## Route Structure
# /
Full docs for routes are found here.

## Auth
| Route | Method | Description |
|-------|--------|-------------|
| /api/auth/authenticate | POST | Returns a JWT token |
| /api/auth/register | POST | Register a user |

## Generic Resources
If `x` is the generic resource, then the following routes apply. Routes are in the plural form of the word.
For example a resource such as `device` would be `/api/devices/`.
Media also has these, and the above routes are added on.

| Route | Method | Description |
|-------|--------|-------------|
| /api/x/ | GET | Get all instances of `x`, if `x` is owned resource then it will return all the instances belonging to the user |
| /api/x/ | POST | Will store a record of `x`|
| /api/x/:id | POST | Will update a record of `x` |
| /api/x/:id | DELETE | Will delete `x` |
| /api/x/:id | GET | Will return an instance of `x` |
| /api/x/search/:field/:term | GET | Will return all instances where a field of `x` contains the term |
| /api/x?y=z | GET | Will return all instances of `x` where the field `y` exactly matches `z`. Multiple terms can be applied |
| /api/get/:page/:limit | GET | Will return a subset of `x` for pagination |
| /api/media/links/:id | GET | Get all links for an item of media |

## Testing
Make sure the necessary env parameters for testing are supplied. These are outlined above. Testing is done
within the docker container, to give access to a dockerised MongoDB. First enter the container, then run:
```bash
npm test
```

## Project Structure
### test/
Houses unit tests

### web/
Core logic for the API.

#### web/controllers/
Controllers to handle logic associated with resources, do not query or manipulate stored resources.

#### web/middleware/
Middleware for the API. Handles checking JWT tokens, user roles, error handling etc.

#### web/repositories/
Repositories for manipulating and querying stored resources. Custom implementations can be written for different
datastores, see `MongoResourceRepository` as an example. Repositories must implement `IResourceRepository`.

#### web/routes/
Routers for API. For resources the route should be outlined in `RouterSchema`, which will auto generate endpoints
for `CRUD` for that resource. Custom routers can be added but must implement `IResourceRouter` if they are a 
resource.

#### web/schemas/
Used to model resources for Mongo. Should all implement `IBaseMongoResource`. For different data structures a
new data source dependant data structure should be written, and `repositories/RepositoryFactory.ts` should be
extended to use the new interface.
