const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 80;
const db = require("./queries");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express and Postgres API" });
});
/*
app.get("/event-schedules", db.getEventSchedules);
app.get("/event-schedule/:eventscheduleid", db.getEventScheduleById);
app.post("/event-schedule", db.createSchedule);
*/

//Round 2
app.post("/working-hours/:trainerId", db.addWorkingHours);
app.post("/event-group", db.createEventGroup);
app.get("/trainer/:trainerId", db.getTrainerById);
app.post("/trainer", db.createTrainer);
app.post("/trainer-ability/:trainerId", db.addAbilityToTrainer);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
