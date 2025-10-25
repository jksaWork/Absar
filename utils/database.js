import mongoose from "mongoose";
let isconected = false;
export const connectToDB = async () => {
  if (isconected) {
    console.log("The MongoDB Already Is Connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "optical_center",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isconected = true;
    console.log("MongoDB Connected Successfully");
  } catch (e) {
    console.log("MongoDB Connection Error:", e.message);
  }
};
