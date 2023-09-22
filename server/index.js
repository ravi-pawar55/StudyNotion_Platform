const express = require('express');
const app = express();
 
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const port = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

cloudinaryConnect();

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/course', courseRoutes);

app.get('/', (req, res) => {
    res.json({
        sucess: true,
        message: 'Welcome to the StudyNotion'});
} 
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});







