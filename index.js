import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './Routes/userRouter.js';
import productRouter from './Routes/producrRouter.js';
import verifyJWT from './middleWare/verifyJwt.js';
import orderRouter from './Routes/orderRouter.js';


const app = express();
mongoose.connect("mongodb+srv://admin:123@cluster0.cnart.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    () => {
        console.log("connected to the database");
    }
).catch(
    () => {
        console.log("connection failed");
    }
)

app.use(bodyParser.json());
app.use(verifyJWT);


app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/order",orderRouter)


app.listen(3000, () => {

    console.log("server is running on port 3000")

})