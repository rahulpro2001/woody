const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {userModel} = require("./schema");


function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser =  (email, password, done) => {
    //  const  user =  getUserByEmail(email)

   return userModel.findOne({email: email}, (err, data)=>{
      if(err){
        return next(new Error("at: initialize passport"));
      }
      else{
        // console.log("passort init :", data);
        // if(data) return data;
        // else return null;

        if (data == null) {
      
          return done(null, false, { message: 'No user with that email' })
        }

        // try {
        //   if (await bcrypt.compare(password, user.password)) {
        //     return done(null, user)
        //   } else {
        //     return done(null, false, { message: 'Password incorrect' })
        //   }
        // } catch (e) {
        //   return done(e)
        // }
        bcrypt.compare(password, data.password, function(err, result) {
            if(err){
              return done(err);
            }
            else{
               if(result){
                 done(null, data);
               }
               else{
                return done(null, false, {message: "password incorrect"})
               }
            }
        });
      }
    })

    //      console.log(email);
    //  console.log("config",user);


  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => {
    // return done(null, getUserById(id))
   
    return userModel.findOne({_id: id}, (err, data)=>{
       if(err){
         return next(new Error("at: initialize passport"));
       }
       else{
          done(null, data);
       }
     })
   })
}

module.exports = initialize