const mongoose = require('mongoose');
const mongourl = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/schoolapp';
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
