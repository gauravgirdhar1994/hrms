'use strict';

require('babel-core/register')({
      presets: ["react", "env"],
      "plugins": [
        "dynamic-import-node"]
});

//require('newrelic');

const cluster = require('cluster');
const app = require("./server.js");

const env = process.env.NODE_ENV || 'production';
const serverEnv = process.env.configs || 'production';
//console.log(env);

if (cluster.isMaster) {
    let cpus = require('os').cpus().length;
    console.log("Total Cpus:", cpus);

    for (let i = 0; i < cpus; i += 1) {

    	if ((env == 'dev' || serverEnv == 'local') && i > 0) {
    		break;
    	}

        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

} else {

	// Start APP
   	app();

    console.log(`worker ${cluster.worker.id} started...`);

}


/*if (cluster.isMaster) {
    let cpus = require('os').cpus().length;
    for (let i = 0; i < cpus; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker) {
        console.log(`worker ${worker.id} exited, respawning...`);
        cluster.fork();
    });
} else {

    app = express();
    let port = 3000;
    let counter = 10000 + Math.round(Math.random() * 10000);
     console.log(`worker ${cluster.worker.id} is counter: ${counter}...`);
    app.get('/', function (req, res) {
    	console.log(`worker ${cluster.worker.id} is counter: ${counter}...`);
        res.send('Hello World!');
        if (counter-- === 0) {
        	console(`worker ${cluster.worker.id} is disconnected on port ${port}...`)
            cluster.worker.disconnect();
        }
    });
    app.listen(port);
    console.log(`worker ${cluster.worker.id} is listening on port ${port}...`);
}*/
