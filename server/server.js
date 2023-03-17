import express from 'express'
import cors from 'cors'
import Morgan from 'morgan';
import connect from './database/connect.js';
import router from './router/route.js';

const app = express();
const Port = 8080;

// middlewares
app.use(express.json());
app.use(cors());
app.use(Morgan('tiny'))


app.get('/', (req, res)=>
{
    res.status(201).json({message: "hello world"})
})

app.use('/api', router);


connect().then(()=>
{
    try {
        app.listen(Port, ()=>
        {
            console.log(`Server started at http://localhost:${Port}`)
        })        
    } catch (error) {
        console.log(error);
    }
}).catch(
    error =>{
        console.log("Failed to connect database.")
    }
)

