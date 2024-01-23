// import express from 'express';
// import fs from 'fs';

// Using require instead of import to use __dirname as of now.
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// This middleware is used to parse json data into JS object and attaches it to req object as 'req.body'.
app.use(express.json());

// Middleware runs from top to bottom of code written.
app.use((req, res, next) => {
  console.log('Hello from the middleware 2.');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from the middleware 1.');
  next();
});

// Here we are reading data from another file and sending it from server to client.
// BUT in real life data will be stored in databases.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  // console.log(req.url, req.params);
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: {
      tours, // tours: tours can be written as tours.
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // Converting string into number.
  const tour = tours.find((el) => el.id === id);

  // Handling case when tour not found.
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour, // tour: tour can be written as tour.
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  // Checking if ID is valid.
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updating the tour...>',
    },
  });
};

const deleteTour = (req, res) => {
  // Checking if ID is valid.
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // 204 means no content.
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id/:x?', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// This is same as above mentioned
app.route('/api/v1/tours').get(getAllTours).post(createTour);

/********* This middleware will only run if requests below it are called.
           because route don't have next function. Hence, it blocks/end req-res cycle. ********/
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 3');
//   next();
// });

app.route('/api/v1/tours/:id').patch(updateTour).delete(deleteTour);
app.route('/api/v1/tours/:id/:x?').get(getTour);

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
