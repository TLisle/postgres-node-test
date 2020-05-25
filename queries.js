const { v4: uuidv4 } = require("uuid");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "events",
  password: "******",
  port: 5432,
});

//Function to get Trainer By Id with Promise
function getTrainer(trainerId) {
  const queryString = "SELECT * FROM Trainers where TrainerId = $1";
  const values = [trainerId];
  return new Promise((resolve, reject) => {
    pool
      .query(queryString, values)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

//Get TrainerByID API call
const getTrainerById = (request, response) => {
  const TrainerId = request.params.trainerId;
  getTrainer(TrainerId)
    .then((res) => response.status(200).json(res.rows))
    .catch((err) => console.log(err));
};

const createTrainer = (request, response) => {
  const FirstName = request.body.firstName;
  const LastName = request.body.lastName;
  const Description = request.body.description;
  const values = [FirstName, LastName, Description];
  const queryString =
    "INSERT INTO Trainers (FName,LName,Description)VALUES($1,$2,$3)";
  pool.query(queryString, values, (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send("Record Entered");
  });
};

const addWorkingHours = (request, response) => {
  const WorkingHoursID = uuidv4();
  const TrainerId = request.params.trainerId;
  const StartDateUtc = request.body.startDateUtc;
  const EndDateUtc = request.body.endDateUtc;
  const Duration = request.body.duration;
  const IsRecurring = true;
  const RecurrencePattern = request.body.recurrencePattern;
  values = [
    WorkingHoursID,
    TrainerId,
    StartDateUtc,
    EndDateUtc,
    Duration,
    IsRecurring,
    RecurrencePattern,
  ];
  //First we should check if the trainer exists
  getTrainer(TrainerId)
    .then((res) => {
      if (res.rowCount > 0) {
        const queryString =
          "INSERT INTO WorkingHours" +
          "(WorkingHoursId, TrainerId, StartDateUtc, EndDateUtc, Duration, IsRecurring, RecurrencePattern)" +
          "VALUES ($1, $2, $3, $4, $5, $6, $7)";
        pool.query(queryString, values, (err, res) => {
          if (err) {
            throw err;
          }
          response.status(200).send("Record Entered");
        });
      } else {
        response.status(404).send("Trainer not Found");
      }
    })
    .catch((err) => {
      response.status(400).send(err);
    });
};

/* TO ADD 

app.post("/service", db.createService);
app.post("/trainer", db.createTrainer);
app.post("/trainer-service".db.addServiceToTrainer);
/*

/*
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
};*/

module.exports = {
  addWorkingHours,
  getTrainerById,
  createTrainer,
  /*
  getEventSchedules,
  getEventScheduleById,
  createSchedule,*/
};
