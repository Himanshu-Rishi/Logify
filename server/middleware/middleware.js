import UserModel from "../model/User.js";
import ENV from "../config.js";
import jwt from "jsonwebtoken";


export async function verifyUsername(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;
    const exist = await UserModel.findOne({username});
    if(!exist)
    {
        return res.status(404).send({error: "User not found"});
    }
    next();
  } catch (error) {
    res.status(404).send({error: "Authentication Error"})
  }
}

export async function auth(req, res, next){
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded_token = jwt.verify(token, ENV.JWT_SECRET);
      req.user = decoded_token;
      next();
  } catch (error) {
    return res.status(401).send({error: "Authentication Error"});
  }
}

export async function localvariable(req, res, next)
{
  req.app.locals = {
    OTP: null,
    resetSession: false
  }
  next();
}