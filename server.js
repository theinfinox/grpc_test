const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the clock.proto file
const packageDefinition = protoLoader.loadSync('./clock.proto', {});
const clockProto = grpc.loadPackageDefinition(packageDefinition).clock;

// Function to get IST time
function getISTTime() {
    return new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
}


// gRPC server method to stream time updates
function GetTimeStream(call) {
    console.log('connected, gRPC streaming IST time...');
    const interval = setInterval(() => {
        call.write({ currentTime: getISTTime() });
    }, 1000);

    call.on('end', () => {
        clearInterval(interval);
        call.end();
    });
}

// Start the gRPC server
function main() {
    const server = new grpc.Server();
    server.addService(clockProto.ClockService.service, { GetTimeStream });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Server running on port ${port}`);
});
}

main();

