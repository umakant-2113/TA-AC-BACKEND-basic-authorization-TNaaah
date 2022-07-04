let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let commentSchema=new Schema({
    content:{type:String,required:true},
    author:String,
    likes :{type:Number,default:0},
    articleId:{type:Schema.Types.ObjectId,ref:"Article"},
    authorId:{type:Schema.Types.ObjectId , ref: "User"}
})


module.exports=mongoose.model("Comment",commentSchema)