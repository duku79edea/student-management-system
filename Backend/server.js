const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { pool, connectDb} = require('./db/db_con');

const createStudent = require("./routes/createStudentRoute.js");

app.use(express.json());

//STUDENTS ENDPOINT
app.use('/api', createStudent);

//HEALTH CHECK ENDPOINT
app.get('/api/health', async (req, res) => {
  const healthStatus = {
      status: "UP",
      timestamp: new Date().toISOString(),
      database: "Connected",
      uptime: process.uptime()
  };
  try{
      let timer;
      try {
          const client = await Promise.race([
              pool.connect(),
              new Promise((_, reject) => {
                  timer = setTimeout(() => reject(new Error('DB Connection timed out.')), 5000);
              }),
          ]);
          client.release();
          console.log('Successfully Connected the database');
      } finally {
          clearTimeout(timer);
      }
      res.status(200).json(healthStatus);
  }catch(error){
      console.error(`Failed to connect to the database, ${error}`);
      healthStatus.status = "DOWN";
      healthStatus.database = "Disconnected";
      res.status(503).json(healthStatus);
  }
})

async function startServer() {
    await connectDb();
    const start = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(`Shutting down the server ${signal}`);
        start.close(
            async () => {
                await pool.end();
                process.exit(0);
            }
        );
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch(
    (error) => {
        console.log(`Application failed to start ${error}`);
        process.exit(1);
    }
);
