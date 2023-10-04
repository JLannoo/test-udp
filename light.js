const udp = require('node:dgram');
const socket = udp.createSocket('udp4');

const LAMP_PORT = 38899;
LAMPS_IP = ["192.168.100.19" , "192.168.100.20"];

function updateLight({r, g, b}, dimming) {
    const POST_DATA = {
        method: 'setPilot',
        params: {
            r: r || 0,
            g: g || 0,
            b: b || 0,
            dimming: dimming || 100
        }
    }
    
    console.log(POST_DATA);
    
    const POST_DATA_STR = JSON.stringify(POST_DATA);
    const POST_DATA_BUF = Buffer.from(POST_DATA_STR);
    const POST_DATA_LEN = POST_DATA_BUF.length;

    let timeStart = Date.now();

    socket.on("message", (msg, rinfo) => {
        const delay = Date.now() - timeStart;
        console.log(`Message from ${rinfo.address}:${rinfo.port} - ${msg} - ${delay}ms`);
    });
    
    socket.on("error", (err) => { console.log(err); });
    
    socket.on("listening", () => { console.log("listening"); });
    
    for(let lamp of LAMPS_IP) {
        socket.send(POST_DATA_BUF, 0, POST_DATA_LEN, LAMP_PORT, lamp, (err) => {
            if(err) {
                console.log(err);
            }
        });
    }
}

module.exports = updateLight;