const mongoose = require('mongoose');
const { update } = require('./products');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart:{
        items:[{
            productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
            producttitle:{
                type:String,
                required:false
            },
            productprice:{
                type:Number,
                required:false
            },
            productimg:{
                type:String,
                required:false
            },
            quantity:{
                type:Number,
                required:false
            }
        }],
        totalprice:{
            type:Number,
            required:false
        },
        required:false
    }
})

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp=>{
        return cp.productId.toString()===product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    let totprice = this.cart.totalprice;
    if(totprice>0){
        totprice = totprice+product.price;
    }
    else{
        totprice = product.price;
    }
    if(cartProductIndex>=0){
        newQuantity = this.cart.items[cartProductIndex].quantity+1;
        updatedCartItems[cartProductIndex].quantity=newQuantity;
    }
    else{
        updatedCartItems.push({
            productId: product._id,
            producttitle:product.title,
            productprice:product.price,
            productimg:product.img,
            quantity: newQuantity
        })
    }
    
    const updatedCart = {
        items:updatedCartItems,
        totalprice:totprice
    };
    this.cart = updatedCart;
    return this.save();
}
userSchema.methods.deletecart = function(product,productquantity){
    const productId = product._id;
    const updatedCartItems = this.cart.items.filter(item=>{
        return item.productId.toString()!==productId.toString();
    });
    
    let updatedTotalprice = this.cart.totalprice;
    updatedTotalprice=updatedTotalprice-productquantity*product.price;

    this.cart.items = updatedCartItems;
    this.cart.totalprice = updatedTotalprice;
    return this.save();
}
module.exports = mongoose.model('User',userSchema);