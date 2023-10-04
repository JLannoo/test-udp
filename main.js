const http = require('node:http');
const fs = require('node:fs');

const updateLight = require('./light.js');

const server = http.createServer((req, res) => {
    switch(req.url) {
        case '/':
            const index = fs.readFileSync('index.html');    

            res.writeHead('200', {
                'Content-Type': 'text/html',
                'Content-Length': index.length
            });
            res.end(index);
            break;

        case '/light':
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const data = JSON.parse(body);
                const {color , dimming} = data;

                updateLight(color, dimming);
    
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Light updated!'}));
            });
            break;
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
