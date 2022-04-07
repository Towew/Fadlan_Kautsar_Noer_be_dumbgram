const { user, transaction, product } = require('../../models')

exports.addTransaction = async (req, res) => {
    try {
        let data = req.body;
        let buyer = req.user; 

        const dataproduct = await product.findOne({
            attributes:{
                exclude:['name','desc','image','qty','createdAt','updatedAt']
            },
            where:{
                id: data.idProduct,
            },
          });

          const dataseller = await user.findOne({
            attributes:{
                exclude:['email','password','createdAt','updatedAt','name','status']
            },
            where:{
                id: dataproduct.idUser,
            },
          });

          if(!data.price){
            data = {
                ...data,
                price: dataproduct.price,
                status: "success"
            };
        };

        await transaction.create({
            idProduct: data.idProduct,
            idBuyer: buyer.id,
            idSeller: dataseller.id,
            price: data.price,
            status: data.status
        });

        res.send({
            status: 'success',
            data: {
                transaction: {
                    id: data.id,
                    idProduct: data.idProduct,
                    idBuyer: buyer.id,
                    idSeller: dataseller.id,
                    price: data.price
                }
            }
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

exports.getTransactions = async (req, res) => {
    try {

        const data = await transaction.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller', 'idProduct']
            },
            include: [
                {
                    model: product,
                    as: 'product',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser', 'qty', 'price', 'image']
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
            ]
        })

        res.send({
            status: 'success',
            data: {
                transaction: data
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

