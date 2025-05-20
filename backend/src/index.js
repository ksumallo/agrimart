import express from 'express'
import { router } from './router.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app)

app.listen(3000, () => { console.log("API listening on Port 3000") });
