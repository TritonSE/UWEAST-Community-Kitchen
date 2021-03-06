# UWEAST-Community-Kitchen

This repository contains all source code for this project, and is divided up into two main components - _Backend_ & _Frontend_.

_Backend_ compromises of all folders and files in the root directory, excluding `\client`. It utilizes Express routes that are validated using middleware, and many of which utilize services in conjuction with Mongoose schmeas to make updates/removals/queries on MongoDB. All MongoDB related functionality is stored with the db folder, sepreated into models (Mongoose schemas) and services (changes to a specific table in the MongoDB using Mongoose). All routes are handled within the routes folder, with each specific set of routes seperated by functionality, and making usage of specific services within the db/services folder.

_Frontend_ compromises of all folders and files inside of `\client`. It utilizes React components to render visual designs. The React Router located within the App.js file provides the central source of navigation in the browser via available URL paths, rendering the corresponding screen by calling a corresponding React component. All major screens/pages that are rendered inside of App.js can be found inside of src/pages, with each of those pages usually having their own set of subcomponents being called from src/components. All React components have their corresponding (i.e., same name, different extension) css files located inside of src/css.

### Production

During production, the Express backend hosts the React frontend, pushing all domain requests not taken care of by
the Express routes to the frontend's index.html located at `\client\public\index.html`. Website itself is hosted using
Heroku on a custom subdomain.

### Important Notes

For future PRs related to informational changes on the site, particulary minimum payment amount, tax rate, etc., many
of these contexutal global constants have been defined within the constants.js files of the frontend (`\client\src\util\constants.js`) and backend (`\util\constants.js`). Some constants have to be changed in _both_ files, so
be careful as to do that! However, once changed, all respective parts that reference those global constants will be readapted.

## Dependencies

### Node Installation

Dependencies you'll need:

- Node 14+
- NPM 6+

Node.js can be downloaded from here: https://nodejs.org/en/

_Note_: Downloading Node will automatically download NPM for you.

To verify Node installation, you can do:

`node -v`

To verify NPM installation, you can do:

`npm -v`

If you find your NPM version is out of date, you can install the latest version using:

`npm install npm@latest -g`

## Setup

The corresponding config files in both backend and frontend manages what global variables are being set in that
directory.

The config file contains "local" constants that are suitable during development stage, with the expectation that
prioirty constants needed for production would be located inside of a dotenv file. Currently, the config files
have "local" constants defined internally, and can be ran independently of a dotenv file for development/testing
purposes. These "local" constants may also be changed as needed. However, if a corresponding value exists inside
of the dotenv file, be aware that it takes precedence over the corresponding "local" constant.

### Running Backend (Locally)

While in the root level directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:9000](http://localhost:9000) to view it in the browser.

The page will not re-load upon edits.

_Note_: Backend is a combination of MongoDB, Mongoose, and Express. Hence, it requires connection to a proper local MongoDB
database (via localhost), or connection to a remote one on a hosting server like AtlasDB. Either one is fine, but
the URL link in `\config.js` for the `db.uri` value must be updated properly. If you'd like to set-up
a local MongoDB database for usage, please see the _MongoDB (LocalHost)_ section below.

### Running Frontend (Locally)

While in the `\client` directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### MongoDB (LocalHost) Set-Up

This set-up sets up a MongoDB server locally on your laptop, and utilizes Compass as a visual reference for easy
management of the database without sever reliance on terminal commands. Both are recommended.

#### 1. MongoDB Server Installation

Based on your platform:

- [Mac](https://zellwk.com/blog/install-mongodb/)
- [Windows](https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514)

To verify installation, you can do:

`mongo --version`

If successful, it should spit out a response similar to this:

    MongoDB shell version v4.2.3
    git version: 6874650b362138df74be53d366bbefc321ea32d4
    allocator: system
    modules: none
    build environment:
        distarch: x86_64
        target_arch: x86_64

Make sure that your shell version is >= 4.2.3. If you need to update your version for any reason, please refer to
[this](https://docs.mongodb.com/manual/tutorial/upgrade-revision/) article.

#### 2. MongoDB Compass Installation (Highly Recommended)

Please refer to [this](https://docs.mongodb.com/compass/master/install) for pertraining downloads/set-up.

#### 3. Setting up a Local MongoDB DataBase

##### Without Compass (Using Terminal)

Please refer to [this](https://zellwk.com/blog/local-mongodb/) article here. Most relevent portions will be near the beggining
of the article, all the way up to Compass Connection. It includes some examples of how to add/edit your database as well.

In essence:

To start your MongoDB locally via terminal, run:

`mongod`

This will establish the connection to your local databases and mantain it as long as the window on which this command is
run is also kept running. Visually, this will be seen as an ongoing lag on the window. If you close the window or exit out in any way, the connection will be broken.

To add a MongoDB database via terminal, first run:
`mongo`

This will now allow you to edit your databases using the MongoDB shell.

Then,

To see the current database, run:
`db`

To create a new database, run:
`use MONGO_DB_NAME`
where MONGO_DB_NAME is the name of your database

##### With Compass

Please refer to [this](https://zellwk.com/blog/local-mongodb/) article here. Most relevent portions will be near the middle
of the article, starting from _Accessing MongDB with MongoDB Compass_.

In essence:

Open up your MongoDB Compass app (for download information see the section _MongoDB Compass Installation_ above).

If this is your first access of the app, you will get a set-up screen title "Connected to Host". If so, to connect to your
local databases, set your `Hostname` to `localhost` and your `Port` to `27017`. Then press the "Connect" button.

If you'd like to create a custom a new database using Compass, click the "Create Database" option and create a
name for your DB - lets refer to this name as MONGO_DB_NAME. It should now appear on your list of DBs available on the bottom left of your app's screen, and any updates made on the DB should be reflected there.

#### 4. Connecting project backend to Local MongoDB

Opening up your `backend/config.js` file, go to `db.uri` and update either its value either in the config file itself
(development phase) or in the dotenv (production phase). Specifically, your updated value should be the connection link
to your local database, and should be `mongodb://localhost:27017/MONGO_DB_NAME/` where MONGO_DB_NAME should be replaced
by the name you gave your DB (see section above).

If you run the backend (see section above) and connect to the database successfully, the terminal will
spit out the following message:

            Established connection to MongoDB.
            mongodb://localhost:27017/MONGO_DB_NAME/
            Port: 9000
