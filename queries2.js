const { v4: uuidv4 } = require("uuid");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "events",
  password: "testtest123",
  port: 5432,
});

const getEventSchedules = (request, response) => {
  const queryString = "SELECT * FROM EventSchedules ORDER BY CreatedDate DESC";
  pool.query(queryString, (err, results) => {
    if (err) {
      throw err;
    }
    response.status(200).json(results.rows);
  });
};

const getEventScheduleById = (request, response) => {
  const esid = request.params.eventscheduleid;
  const queryString = "SELECT * FROM EventSchedules WHERE ID = '" + esid + "'";
  pool.query(queryString, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createSchedule = (request, response) => {
  const { RRULE } = request.body;
  const scheduleUUID = uuidv4();
  values = [RRULE, scheduleUUID];
  const queryString =
    "INSERT INTO EventSchedules (ID, timestamp, RRULE,CreatedDate, ModifiedDate) VALUES ($1,NOW(),$2, NOW(),NOW())";

  pool.query(queryString, values, (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User added with ID: ${result}`);
  });
};
module.exports = {
  getEventSchedules,
  getEventScheduleById,
  createSchedule,
};
