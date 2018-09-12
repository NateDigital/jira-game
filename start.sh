#!/bin/bash

read -p "Do you want to run a build? (Y/N):" -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd client
    npm i
    npm run build

    cd -
fi

cd server
npm i
  
if [  ! -f ".env" ]; then
    echo "Environment config file $FILE does not exist. Please Login."
    echo -n "JIRA Username (email):"
    read JIRA_USERNAME

    echo -n "JIRA Password:"
    read -s JIRA_PASSWORD
    echo
    echo -n "Team Name:" 
    read DEFAULT_TEAM
fi

export JIRA_USERNAME=$JIRA_USERNAME
export JIRA_PASSWORD=$JIRA_PASSWORD
export DEFAULT_TEAM=$DEFAULT_TEAM

npm start

