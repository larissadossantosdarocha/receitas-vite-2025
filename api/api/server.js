const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001
const routes = require("../src/routes");
    
app.use(cors());
app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
    console.log(`API respondendo em http://localhost:${port}`);
});