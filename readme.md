
# Project Babyfoot Manager

Babyfoot: Demo App for real time communication.

I tried to give the code some structure.

I didn't develop the chat feature. There was nothing new to it. And all is here (https://github.com/socketio/chat-example.git)

I took the spare time for some other extra stuff:
- created some backend tests 
- created a minimal config management
- inject context dependent db config into game.db.controller
- created the skeleton of the REST API
- added some minimal input validation for game titles
- created some pseudo components for the front end



## Prerequisites

- You must have [postgresql](https://www.postgresql.org/download/) installed on your machine
- Its useful to install [pgAdmin](https://www.pgadmin.org/download/) — postgresql management tool
- Make sure you have [node.js](https://nodejs.org/en/download/), installed. We use node.js LTS Node.js 8.16.1 	Carbon


## Make sure pg is running

    ps axfww | grep postgres

## Setup db

### Create a user

    create user babyfoot_user password 'toto123';

### Create new db babyfoot

    create database babyfoot owner babyfoot_user;

    create database babyfoot_test owner babyfoot_user;


### Create a new table in babyfoot (and babyfoot_test)

switch db

    \connect babyfoot

create table GAME

    -- DROP TABLE game;

    CREATE TABLE game
    (
      id serial PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      team1 VARCHAR(200),
      team2 VARCHAR(200),
      points_team1 integer,
      points_team2 integer,
      is_finished boolean DEFAULT false,
      created_at timestamp without time zone NOT NULL DEFAULT now(),
      finished_at timestamp without time zone,
      deleted_at timestamp without time zone
    )
    WITH (
      OIDS=FALSE
    );
    ALTER TABLE game
      OWNER TO babyfoot_user;

Do the same for babyfoot_test.

## Intall app

cd into 
    
    /postgres_nodejs_vanillafront

install 

    npm install

## Test

npm run test

## Run

npm start

http://localhost:3001


