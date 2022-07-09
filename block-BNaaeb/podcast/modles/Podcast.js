let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let podcastSchema=new Schema({
    
podcastImage:{type:String,required:true},
audio:{type:String,required:true},
songName:{type:String,required:true},
singer:String,
discription:String,
category:{type:String}
})

module.exports=mongoose.model("Podcast",podcastSchema);