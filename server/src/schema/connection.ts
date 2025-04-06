import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

mongoose.connect(connectionString);

export default mongoose.connection;
