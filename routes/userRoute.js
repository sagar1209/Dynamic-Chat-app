const express = require('express');
const router = express();
// const bodyParser = require('body-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const session = require('express-session');
const {SESSION_SECRET} = process.env;
router.use(session({secret:SESSION_SECRET}));


router.set('view engine','ejs');
router.set('views','./views');

router.use(express.static('public'));

const path = require('path');
const multer = require('multer');
const auth = require('../middlewares/auth')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename :function(req,file,cb){
        const name = Date.now()+file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage:storage});

const userController = require('../controllers/userController')

router.get('/register',auth.isLogout,userController.registerLoad);
router.post('/register',upload.single('image'),userController.register);

router.get('/',auth.isLogout,userController.loadLogin);
router.post('/',userController.login);

router.get('/logout',auth.isLogin,userController.logout);

router.get('/dashboard',auth.isLogin,userController.loadDashboard);

router.post('/save-chat',auth.isLogin,userController.saveChat);

router.delete('/delete-chat',auth.isLogin,userController.deleteChat);

router.get('*',(req,res)=>{
    res.redirect('/')
})

module.exports = router;


