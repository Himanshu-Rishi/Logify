import { Router } from "express";
import * as controller from '../controller/appcontroller.js'
import * as mailer from '../controller/mailer.js'
import * as middleware from '../middleware/middleware.js'
const router = Router();

// post methods
router.route('/register').post(controller.register);
router.route("/login").post(middleware.verifyUsername, controller.login);
router.route('/registermail').post(mailer.registerMail);
router.route('/authenticate').post(middleware.verifyUsername, (req, res)=>(res.end()));

// get methods
router.route('/user/:username').get(controller.getuser)
router.route('/generateOTP').get(middleware.verifyUsername, middleware.localvariable, controller.generateOTP)
router.route("/verifyOTP").get(middleware.verifyUsername,controller.verifyOTP);
router.route("/createresetsession").get(controller.createResetSession);

// put methods
router.route('/updateuser').put(middleware.auth ,controller.updateuser)
router.route('/resetpassword').put(middleware.verifyUsername ,controller.resetPassword)


export default router;