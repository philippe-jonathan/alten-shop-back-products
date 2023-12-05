const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Works!');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });