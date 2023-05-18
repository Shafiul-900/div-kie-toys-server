const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('dickie toys is running');
});

app.listen(port, () => {
    console.log(`Dickie server is running on port: ${port}`);
});
