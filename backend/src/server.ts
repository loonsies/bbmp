import express from 'express';
var cors = require('cors')
import userRoutes from './routes/user';
import songRoutes from './routes/song';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
