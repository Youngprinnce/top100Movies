import mongoose from "mongoose";

// Graceful Shutdown server, DB, and any other processes when we receive a SIGTERM or SIGINT event
export const onShutdown = (signal?: string) => {
  return new Promise<void>((resolve) => {
    console.log(`${signal} received, will close the DB connection!`);
    mongoose.connection
      .close()
      .then(() => console.log("MongoDb connection closed."));
    console.log("Cleanup finished!");
    resolve();
  });
};

export const preShutdown = (signal?: string) => {
  return new Promise<void>((resolve) => {
    console.log(`${signal} received!`);
    console.log("Cleaning up");
    resolve();
  });
};
