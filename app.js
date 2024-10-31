const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const session = require('express-session');
const Vacancy = require('./app/db-connection');
const Cities = require('./app/topCities')
const Salaries = require('./app/topSalary')

// Создаем экспресс-приложение
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false, cookie: {maxAge: 1000*60*24*7} }));

app.get("/main", async (req, res) => {
  try {
    const vacancy = await Vacancy.find({});
    const data_сity = await Cities;
    const data_salary = await Salaries;
    res.render('vacancy', { vacancies: vacancy, data_сity: data_сity, data_salary: data_salary });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/data1',async function(req,res) {
  const data_сity = await Cities;
  res.send(data_сity)
})
app.get('/data2',async function(req,res) {
  const data_salary = await Salaries;
  res.send(data_salary)
})

// Запускаем экспресс-сервер
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/main`);
});