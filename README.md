# hcard-builder

A profile creation application.

## Requirements

- NodeJS 14.3 or higher
- docker

## Installation

- `npm i`
- `docker-compose up (spin up postgres and redis)`
- `npm run db:migration`
- Create a profile_db_test database in postgres
- `npm run db:migration:test`

## How to run

- `npm start`

To simulate a SSR scenario you will need to update the shouldRenderSsr variable in ProfileViewController.ts
By default it is turned off and SPA will be rendered.

## How to run tests

- `npm run test`
