// const express = require("express");
// const app = express();
// const morgan = require("morgan");
// // to use path.join => must require path!
// const path = require("path");
// const layout = require("./views/layout");
// const { db, Page, User } = require("./models");
// const wikiRouter = require('./routes/wiki');
// const userRouter = require('./routes/users');
// // ...
// app.use('/wiki', wikiRouter);
// app.use('/users', userRouter);

// // or, in one line: app.use('/wiki', require('./routes/wiki'));
// app.use(morgan("dev")); // logging middleware

// // app.use(express.static(__dirname + "/public")) => same thing without path.join
// app.use(express.static(path.join(__dirname, "/public")));
// //middleware: manipulate incoming or outgoing data NEEDED FOR POST AND PUT
// //method inbuilt in express to recognize the incoming Request Object as strings or arrays.

// //Express.urlencoded() expects request data to be sent encoded in the URL, usually in strings or arrays:
// app.use(express.urlencoded({ extended: true }));
// // Express.json() expects request data to be sent in JSON format, which often resembles a simple JS object:
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send(layout(""));
// });

// const PORT = 3000;
// const init = async () => {
//   try {
//     await db.sync();
//     // make sure that you have a port constant
//     app.listen(PORT, () => {
//       console.log(`Listening at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error starting server:", error);
//   }
// };

// init();
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const { db, Page, User } = require("./models");
app.use(morgan("dev")); //logging middleware
app.use(express.static(path.join(__dirname, "./public"))); //serving up static files (e.g. css files)
app.use(express.urlencoded({ extended: false })); //parsing middleware for form input data
app.use(express.json());
app.use(require('method-override')('_method'));



app.use("/wiki", require("./routes/wiki"));
app.use("/users", require("./routes/users"));

app.get("/", function (req, res) {
  res.redirect("/wiki/");
});
// const app = require("./app");

const PORT = 3000;

const init = async () => {
  try {
    // Reference: https://sequelize.org/master/manual/model-basics.html#model-synchronization
    // `.sync()` creates the table in the database if it doesn't exist (and does nothing if it already exists)
    // We can do this two ways:
    // 1. call `.sync()` on each individual Sequelize model (see commented out code below), or
    // await Page.sync();
    // await User.sync();

    // 2. call `.sync()` on the entire Sequelize instance (e.g. `db`) since our models are defined on it (i.e. `db.define(...)`)
    await db.sync({force:true});

    app.listen(PORT, () => {
      console.log(`Listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error)
  }
};

init();


