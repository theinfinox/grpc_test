const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the clock.proto file
const packageDefinition = protoLoader.loadSync("./clock.proto", {});
const clockProto = grpc.loadPackageDefinition(packageDefinition).clock;

// Create gRPC client
const client = new clockProto.ClockService(
  "192.168.0.101:50051",
  grpc.credentials.createInsecure()
);

// Request IST time stream
const call = client.GetTimeStream({ timezone: "Asia/Kolkata" });

call.on("data", (response) => {
  console.log("Current IST Time:", response.currentTime);
});

call.on("error", (error) => {
  console.error("Error:", error);
});

call.on("end", () => {
  console.log("Time stream ended.");
});
