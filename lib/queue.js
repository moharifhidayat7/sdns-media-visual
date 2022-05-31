var Queue = require("bull");
const EmailResetPasswordToken = require("./nodemailer");
var settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300, // A timeout for when the queue is in drained state (empty waiting for jobs).
};

var taskQueue = new Queue(
  "employee registration",
  {
    redis: {
      host: "apn1-tough-redfish-32910.upstash.io",
      port: "32910",
      password: "3325f4bf98df42c391a2567da6d01f44",
    },
  },
  settings
);

taskQueue
  .process(function (job, done) {
    console.log(job.data);
    EmailResetPasswordToken(job.email);
    // TODO process the new employee event
    done();
  })
  .catch((err) => {
    console.log(err);
  });

taskQueue.add({ email: "moharifhidayat7@gmail.com" });
