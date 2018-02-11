#! /bin/sh

/usr/local/bin/yarn db:migrate --url $DATABASE_URL
/usr/local/bin/yarn prod
