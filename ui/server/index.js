import path from 'path';
import fs from 'fs';

import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript'
import App from '../src/App';

const PORT = process.env.PORT || 3006;
const app = express();



app.get('/', (req, res) => {
  console.log(req.query)
  debugger;
  const { launch_year, launch_success, land_success } = req.query
        const initialState = {
            yearProp: launch_year ? launch_year: "",
            launchProp: launch_success ? launch_year:  "",
            landingProp: land_success ? land_success: ""
        }

        const app = ReactDOMServer.renderToString(<App initialState={initialState} />);
  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div><script>window.__initial_data=${JSON.stringify(initialState)}</script>`)
    );
  });
});

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});