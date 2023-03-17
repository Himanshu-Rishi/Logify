import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:8080";
export async function getUsername()
{
  const token = localStorage.getItem('token');
 var decodedHeader = jwt_decode(token);
 return decodedHeader;
}

export async function authenticate(username)
{
    try {
        return await axios.post('/api/authenticate', {username});
    } catch (error) {
        return {error: "username does not exist...!"}
    }
}

export async function getuser({username})
{
    try {
        const {data} = await axios.get(`/api/user/:${username}`);
        return {data};
    } catch (error) {
        return {error: "Password does not match...!"}
    }
}

export async function register(credentials)
{
    try {
        const {username, email} = credentials;
        const {
          data: { msg },
          status,
        } = await axios.post('/api/register', credentials);

        if(status === 201)
        {
            await axios.post("/api/registermail", {username, userEmail: email, text: msg});
        }
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({error});
    } 
}

export async function verfiypassword(username, password)
{
    try {
       const data = await axios.post("/api/login", {username, password});
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject({ error: "Password does not match...!" });
    } 
}

export async function updateUser(response){
    try {
        
        const token = localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });

    if (status === 201) {
      let {
        data: { email },
      } = await axios.get(`/api/user/${username}`);
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}