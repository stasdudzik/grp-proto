const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
// make server listen, server needs credentials, we can bypass it for testing purpose
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), () =>
  server.start()
);
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream,
});

const todosArray = [];

function createTodo(call, callback) {
  const todoItem = {
    id: todosArray.length + 1,
    text: call.request.text,
  };
  todosArray.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todosArray });
}

function readTodosStream(call, callback) {
  todosArray.forEach((t) => call.write(t));
  call.end();
}
