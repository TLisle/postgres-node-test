const { v4: uuidv4 } = require("uuid");
const Pool = require("pg").Pool;
const helpers = require("./helpers");

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "events",
  password: "testtest123",
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

function getEventGroup(eventGroupId) {
  const queryString = "SELECT * FROM EventGroups where EventGroupId = $1";
  const values = [eventGroupId];
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
  const WorkingHoursId = uuidv4();
  const TrainerId = request.params.trainerId;
  const StartDateUtc = request.body.startDateUtc;
  const EndDateUtc = request.body.endDateUtc;
  const Duration = request.body.duration;
  const IsRecurring = true;
  const RecurrencePattern = request.body.recurrencePattern;
  values = [
    WorkingHoursId,
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

const createEventGroup = (request, response) => {
  const EventGroupId = uuidv4();
  const Name = request.body.name;
  const InstanceDuration = request.body.instanceDuration;
  const Intervals = request.body.intervals;
  const PrepTime = request.body.prepTime;
  const AfterTime = request.body.afterTime;
  const Description = request.body.description;
  const Archived = false;
  const Deleted = false;
  const AvailableSpots = request.body.availableSpots;

  values = [
    EventGroupId,
    Name,
    InstanceDuration,
    Intervals,
    PrepTime,
    AfterTime,
    Description,
    Archived,
    Deleted,
    AvailableSpots,
  ];

  const queryString =
    "INSERT INTO EventGroups" +
    "(EventGroupId, Name, InstanceDuration, Intervals, PrepTime, AfterTime, Description, Archived, Deleted, AvailableSpots)" +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
  pool.query(queryString, values, (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send("Record Entered");
  });
};

const addAbilityToTrainer = (request, response) => {
  const TrainerId = request.params.trainerId;
  const EventGroupId = request.body.eventGroupId;

  values = [EventGroupId, TrainerId];

  //First we check if the trainer exists.
  getTrainer(TrainerId)
    .then((res) => {
      if (res.rowCount > 0) {
        //Then we check if the EventGroup exists.
        getEventGroup(EventGroupId).then((res) => {
          if (res.rowCount > 0) {
            //If both exist we insert the record.
            const queryString =
              "INSERT INTO TrainerAbilities" +
              "(EventGroupId, TrainerId)" +
              "VALUES ($1, $2)";
            pool.query(queryString, values, (err, res) => {
              if (err) {
                throw err;
              }
              response.status(200).send("Record Entered");
            });
          } else {
            response.status(404).send("EventGroup not Found");
          }
        });
      } else {
        response.status(404).send("Trainer not Found");
      }
    })
    .catch((err) => {
      response.status(400).send(err);
    });
};

module.exports = {
  addWorkingHours,
  getTrainerById,
  createTrainer,
  createEventGroup,
  addAbilityToTrainer,
};
