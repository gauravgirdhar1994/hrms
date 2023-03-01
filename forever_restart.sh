if forever list | grep -v "grep" | grep "hrms"
then
    forever stop "hrms"
    echo 'stopped'
fi
forever --killTree --minUptime 5000 --uid "hrms" -a start -c "npm run start" src/cluster.js
