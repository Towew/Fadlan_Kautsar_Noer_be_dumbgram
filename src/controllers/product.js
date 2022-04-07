const {
    product,
    user
} = require('../../models');


//Menambahkan Produk
exports.addProduct = async (req, res) => {
    try {
      const data = req.body;
  
      data.image = req.file.filename;
      data.idUser = req.user.id;
  
      const newProduct = await product.create(data);
  
      let productdata = await product.findOne({
        where: {
          id: newProduct.id,
        },
        include: [
          {
            model: user,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'idUser'],
        },
      });
  
      res.send({
        status: 'success',
        data:{
            productdata: {
                id: productdata.id,
                image: productdata.image,
                title: productdata.name, //Ini keynya berubah jadi title
                desc: productdata.desc,
                price: productdata.price,
                qty: productdata.qty,
                user: productdata.user
            }
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 'failed',
        message: 'Server Error',
      });
    }
};

//Fetch Product 
exports.getProducts = async (req, res) => {
    try {

        let data = "";
        let sortNameAsc = false;
        let sortNameDsc = false;
        let sortPriceAsc = false;
        let sortPriceDsc = false;

        if(sortNameAsc == true){
             data = await product.findAll({
                order: [['name', 'ASC']],
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'idUser'],
                }
              });
        };
        if(sortNameDsc == true){
            data = await product.findAll({
               order: [['name', 'DESC']],
               attributes: {
                 exclude: ['createdAt', 'updatedAt', 'idUser'],
               }
             });
       };
        if(sortPriceAsc == true){
             data = await product.findAll({
                order: [['price', 'ASC']],
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'idUser'],
                }
              });
        };
        if(sortPriceDsc == true){
            data = await product.findAll({
               order: [['price', 'DESC']],
               attributes: {
                 exclude: ['createdAt', 'updatedAt', 'idUser'],
               }
             });
       };
        if(sortPriceAsc == false && sortPriceDsc == false && sortNameAsc == false && sortNameDsc == false){
             data = await product.findAll({
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'idUser'],
                }
              });
        };
    
        const PATH_FILE = "http://localhost:5000/uploads/"

        data = data.map((item) => {
          item.image = PATH_FILE + item.image;
          return item;
        });
    
        res.send({
          status: 'success',
          data:{
              products: data
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          message: 'Server Error',
        });
      }
};

//Fetch Detail Product
exports.getProduct = async (req, res) => {
    try {

        const id = req.params.id;

        let data = await product.findAll({
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
            where: {
                id,
              }
          });
    
        const PATH_FILE = "http://localhost:5000/uploads/"

        data = data.map((item) => {
          item.image = PATH_FILE + item.image;
          return item;
        });
    
        res.send({
          status: 'success',
          data:{
              products: data
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          message: 'Server Error',
        });
      }
};

//Update Product
exports.updateProduct = async (req, res) => {
    try {

        const id = req.params.id;
        const data = req.body;
        data.image = req.file.filename;

        await product.update(data, {
          where: {
            id,
          },
        });
    
        res.send({
          status: 'success',
          data:{
            products: {
                id: data.id,
                image: data.image,
                title: data.name, //Ini keynya berubah jadi title
                desc: data.desc,
                price: data.price,
                qty: data.qty,
            }
        },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          message: 'Server Error',
        });
      }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
    
        await product.destroy({
          where: { 
            id,
          },
        }),
    
        res.send({
          status: "success",
          data: {
              id: id
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "failed",
          message: "server error",
        });
      }
};