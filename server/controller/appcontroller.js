import UserModel from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import ENV from '../config.js'
export async function register(req, res) {
  try {
    const { username, password, email, profile } = req.body;

    // checking for existence for username

    const userexist = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Please use unique username" });
        resolve();
      });
    });

    // checking for existence for username

    const emailexist = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Please use unique email" });
        resolve();
      });
    });

    Promise.all([emailexist, userexist])
      .then(() => {
        // return res.send({ msg: "hello" });
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedpassword) => {
              const user = new UserModel({
                username,
                email,
                password: hashedpassword,
                profile: profile || "",
              });

              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User registered." })
                )
                .catch((error) => {
                  res.status(500).send({ error });
                });
            })
            .catch((error) => {
              return res.status(500).send({ error: "Enable to hash passowrd" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    UserModel.findOne({ username }).then((user)=>{
        bcrypt.compare(password, user.password).then((passwordcheck)=>
        {
            if(!passwordcheck){
                return res.status(400).send({error: "does not have password"})
            }
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
                msg: "Login Successful...!",
                username,
                token
            })
        }).catch(error=>
            {
                res.status(400).send({error: "password does not match"})
            })
    }
    ).catch(error=>
        {
            return res.status(404).send({error: "username not found"});
        })
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getuser(req, res)
{
  const {username} = req.params;
  try {
    UserModel.findOne({username}, function(err, user)
    {
      if(err)
      {
        return res.status(500).send({err});
      }
      if(!user)
      {
        return res.status(501).send({error: "Could not find user."})
      }
      const {password, ...rest} = Object.assign({}, user.toJSON());
      res.status(201).send(rest);
    })
  } catch (error) {
    return res.status(404).send({error: "Can't find user data"});
  }
}

export async function updateuser(req, res)
{
  try {
    const {userId} = req.user;
    if (userId) {
      const body = req.body;
      UserModel.updateOne({ _id: userId}, body, function (err, data) {
        if (err) {
          throw err;
        }
        res.status(201).send({ msg: "Record updated...!" , body});
      });
    } else {
      return res.status(401).send({ error: "user not found." });
    }
  } catch (error) {
    res.status(401).send({error})
  }
}

export async function generateOTP(req, res)
{
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const {code} = req.query;
  if(parseInt(req.app.locals.OTP) === parseInt(code))
  {
    req.app.locals.OTP = null
    req.app.locals.resetSession = true;
    res.status(201).send({msg: "Verify Successfully...!"});
  }
  else
  {
    return res.status(400).send({error: "Invalid OTP"})
  }
}

export async function createResetSession(req, res)
{
  if(req.app.locals.resetSession)
  {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  else
  {
    return res.status(440).send({error: "Session Expired."})
  }
}

export async function resetPassword(req, res)
{
  if(!req.app.locals.resetSession)
  {
    return res.status(440).send({error: "Session Expired"});
  }

  const {username, password} = req.body;
  try {
    UserModel.findOne({username}).then(user=>
      {
        bcrypt.hash(password, 10).then((hashedpassword) => {
          UserModel.updateOne(
            { username: user.username },
            { password: hashedpassword },
            function (err, data) {
              if (err) {
                throw err;
              }
              return res.status(201).send({ msg: "Record Updated" });
            }
          );
        });
      }
    ).catch(error=>
      {
        return res.status(404).send({error: "Username not found"})
      })
  } catch (error) {
    return res.status(500).send({error})
  }
}
