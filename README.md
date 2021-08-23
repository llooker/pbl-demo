# Looker PBL Demo Application

This app is the new solution for PBL Demos.

This is a react/node app featuring Looker's all new embed SDK to showcase PBL demos.

## Local Setup

### Setup Env files

```
Reach out to Elliot Glasenk for the contents of these files
```

### install node

```
Go to https://nodejs.org/en/download/ and install for your OS
```

### install packages

In the root directory run

```
yarn install
```

In the client directory run

```
yarn install
```

### create the database

Install postgres if you have not already
Here are instructions for MacOS
https://www.robinwieruch.de/postgres-sql-macos-setup

create the atom dev db

```
createdb atom_fashion_dev
```

create the session tables

```
psql atom_fashion_dev -f table.sql
```

### edit hosts file (MacOSX)

open /etc/hosts using sudo
Add

```
127.0.0.1   embed.demo.com
```

## Running the atom demo

Run in root directory

```
yarn atom start
```

Go to http://embed.demo:8080

First time it will need to build alot of files to be patient!

## More

Questions, comments, concerns? Reach out to Elliot Glasenk
