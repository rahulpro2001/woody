const mongoose =require("mongoose");
const {Schema} = mongoose;

//User Schema
const userSchema = new Schema ({
  email:String,
  name: String,
  password:String
})


const userModel = new mongoose.model("User", userSchema);
module.exports.userModel = userModel;




/*


db.data.find({},{_id:0});
// db.data.remove({"user.id":"2344"});
// 
// db.data.find({},{_id:0});


//delete a particular element_value
// db.data.update({"user.id":"2344"}, {"$unset": {"data.element_value1":""}}, {multi:true});
// db.data.find({},{_id:0});


//adding a new element_value
db.data.update({"user.id":"2344"}, {"$set": {"data.element_value2":{name:"lkj"}}}, {multi:true});
db.data.find({},{_id:0});
*/