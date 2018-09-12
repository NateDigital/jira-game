#!/bin/bash

npm run build-frontend && \
git add -A && \
git commit -m 'deploy' && \
git push heroku master
