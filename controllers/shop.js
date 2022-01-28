const Product = require("../models/products");
const User = require("../models/user");
exports.getIndex = (req, res, next) => {
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  Product.find().then((products) => {
    //console.log(products);
    res.render("shop/index", {
      isAuthenticated: req.session.isLoggedIn,
      prods: products,
      isAdmin:isAdmin
    });
  });
};
exports.getProductCategorywise = (req, res, next) => {
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  category = req.params.category;
  Product.find({ categories: { 
      $in: [category] 
    }})
    .then((products) => {
    //console.log(products);
    res.render("shop/products-categorywise", {
      category: category,
      isAuthenticated: req.session.isLoggedIn,
      prods:products,
      isAdmin:isAdmin
      // isAdmin:req.session.user.isAdmin
    });
  });
};

exports.getSingleProduct = (req,res,next)=>{
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
    const productId = req.params.productId;
    Product.findById(productId).then((product)=>{
        //console.log(product);
        res.render('shop/single-product',{
            isAuthenticated: req.session.isLoggedIn,
            prod:product,
            isAdmin:isAdmin
        })
    });
}
exports.getCart = (req,res,next)=>{
    var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
    const cart= req.user.cart.items;
    //console.log(req.user.cart.items);
    const totprice = req.user.cart.totalprice;
    res.render('shop/cart',{
        isAuthenticated: req.session.isLoggedIn,
        cartprod:cart,
        totalprice:totprice,
        isAdmin:isAdmin
    })
}
exports.postCart = (req,res,next)=>{
    const productID = req.body.productId;
    Product.findById(productID).then((product)=>{
        return req.user.addToCart(product);
    }).then((result)=>{
        console.log(result);
        res.redirect('/product/'+productID);
    })
}

//admin
exports.getaddproduct = (req,res,next)=>{
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  res.render('shop/addproduct-admin',{
    isAuthenticated: req.session.isLoggedIn,
    isAdmin:isAdmin
  })
}

//admin
exports.postaddproduct = (req,res,next)=>{
  const title = req.body.producttitle;
  const price = req.body.productprice;
  const desc = req.body.productdescription;
  const size = req.body.productsize;
  const categories = req.body.productcategories;
  const color = req.body.productcolor;
  const img = req.body.productimg;
  var Size = size.split(',');
  console.log(Size);
  var Color = color.split(',');
  console.log(Color);
  var Categories = categories.split(',');
  console.log(Categories);
  if(req.user.isAdmin){
    const product = new Product({
      title:title,
      price:price,
      desc:desc,
      size:Size,
      categories:Categories,
      color:Color,
      img:img
    })
    product.save().then(result=>{
      console.log('New Product Created!!!');
      res.redirect('/addproduct');
    }).catch(err=>{
      console.log(err);
    })
  }
}

exports.getallproductadmin = (req,res,next) =>{
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  if(req.user.isAdmin){
    Product.find().then((products)=>{
      res.render('shop/getproduct-admin',{
        isAuthenticated: req.session.isLoggedIn,
        isAdmin:req.session.user,
        prods:products,
        isAdmin:isAdmin
      })
    })
    
  }
}
exports.geteditproduct = (req,res,next)=>{
  var isAdmin=false;
  if(req.user){
    isAdmin = req.user.isAdmin;
  }
  if(req.user.isAdmin){
  const productId = req.params.productId;
  Product.findById(productId).then((product)=>{
    console.log(product);
    res.render('shop/editproduct-admin',{
      isAuthenticated: req.session.isLoggedIn,
      isAdmin:req.session.user,
      product:product,
      isAdmin:isAdmin
    })
  })
}
}
exports.posteditproduct = (req,res,next)=>{
  if(req.user.isAdmin){
    const title = req.body.producttitle;
    const price = req.body.productprice;
    const desc = req.body.productdescription;
    const size = req.body.productsize;
    const categories = req.body.productcategories;
    const color = req.body.productcolor;
    const img = req.body.productimg;
    var Size = size.split(',');
    console.log(Size);
    var Color = color.split(',');
    console.log(Color);
    var Categories = categories.split(',');
  console.log(Categories);
    const productId = req.body.productId;
    Product.findByIdAndUpdate(productId,{
      title:title,
      price:price,
      desc:desc,
      size:Size,
      categories:Categories,
      color:Color,
      img:img
    }).then(result=>{
      console.log('Product Details updated successfully!!!');
      res.redirect('/getproducts');
    })
  }
} 
exports.deleteproduct = (req,res,next)=>{
  if(req.user.isAdmin){
  const productId = req.body.productId;
  Product.findByIdAndDelete(productId).then((result)=>{
    console.log('Product (id:'+productId+') deleted successfully!!!!');
    res.redirect('/getproducts');
  })
}
}
exports.deletecart = (req,res,next)=>{
  const productId = req.body.productId;
  const productquantity = req.body.productquantity;
  Product.findById(productId).then((product)=>{
    return req.user.deletecart(product,productquantity);
  }).then((result)=>{
    res.redirect('/cart');
  })
  // const userId = req.user._id.toString();
  // User.findById(userId).then((user)=>{
  //   console.log('User ')
  // })
}