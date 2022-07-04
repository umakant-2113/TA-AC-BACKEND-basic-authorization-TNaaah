let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let artilceSchema=new Schema({
    title:{type:String,required:true},
    description:String,
    likes:{type:Number,default:0},
    comment : [{type:Schema.Types.ObjectId, ref:"Comment"}],
    userId: {type:Schema.Types.ObjectId, ref: "User"},
    tags:[String]
})

module.exports=mongoose.model("Article",artilceSchema);