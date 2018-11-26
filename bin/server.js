#!/usr/bin/env node
const { default: app } = require('../server');


app.listen(process.env.PORT || 4000);
