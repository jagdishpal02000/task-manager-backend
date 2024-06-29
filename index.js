const app = require("./app");

let PORT = process.env.LISTEN_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;