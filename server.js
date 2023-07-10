const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
// make server listen, server needs credentials, we can bypass it for testing purpose
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
});
server.start();

function createTodo(call, callback) {
  console.log(call);
}

function readTodos(call, callback) {}
