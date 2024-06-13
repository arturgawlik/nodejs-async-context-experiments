import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();
let idSeq = 0;

/**
 * @param {string} msg
 */
function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id ?? "-"}:`, msg);
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse<IncomingMessage>} res
 */
function handleRequest(req, res) {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId("request started");
    setTimeout(() => {
      res.end("hi");
      logWithId("request finished");
    }, 5000);
  });
}

createServer(handleRequest).listen(8000, () =>
  console.log("server running...")
);
