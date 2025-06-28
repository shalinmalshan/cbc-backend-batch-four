import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "unauthorized"
        })
        return;
    }

    if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }

    const body = req.body
    const orderData = {
        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0
    }
    Order.find().sort({
        date: -1
    }).limit(1).then(async (lastBills) => {
        if (lastBills.length == 0) {
            orderData.orderId = "ORD0001"
        } else {
            const lastBill = lastBills[0]
            const lastOrderId = lastBill.orderId  //ORD001
            const lastOrderNumber = lastOrderId.replace("ORD", "")  //001
            const lastOrderNumberInt = parseInt(lastOrderNumber) //1
            const newOrderNumberInt = lastOrderNumberInt + 1
            const newOrderNumberstr = newOrderNumberInt.toString().padStart(4, "0")
            orderData.orderId = "ORD" + newOrderNumberstr
        }

       for (let i = 0; i < body.billItems.length; i++) {
				const product = await Product.findOne({
					productId: body.billItems[i].productId,
				});
				if (product == null) {
					res.status(404).json({
						message:
							"Product with product id " +
							body.billItems[i].productId +
							" not found",
					});
					return;
				}
				

				orderData.billItems[i] = {
                    productId : product.productId,
                    productName : product.name,
                    image : product.images[0],
                    quantity : body.billItems[i].quantity,
                    price : product.price
                };
                orderData.total = orderData.total + product.price * body.billItems[i].quantity
			}
        if (orderData.total == 0) {
            res.status(400).json({
                message: "Total cannot be zero"
            })
            return;
        }

        const order = new Order(orderData)
        order.save().then(() => {
            res.json({
                message: "Order saved successfully"
            })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                message: "An error occurred"
            })
        })
    })


}

export function getOrder(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "unauthorized"
        })
        return;
    }
    if (req.user.role == "admin" || req.user.role =="superadmin") {
        Order.find().then(
            (orders) => {
                res.json(orders)
            }
        ).catch(
            (err) => {
                res.status(500).json({
                    message: "order not found" 
                })
            }
        )
    }
    else {
        Order.find({
            email: req.user.email
        }).then(
            (orders) => {
                res.json(orders)
            }
        ).catch(
            (err) => {
                res.status(500).json({
                    message: "order not found"
                })
            }
        )
    }

}




export async function updateOrder(req, res) {
    try {
        if (req.user == null) {
            res.status(401).json({
                message: "unauthorized"
            })
            return;
        }
        if (req.user.role !== "admin" && req.user.role !=="superadmin") {
            res.status(403).json({
                message: "unauthorized"
            })
            return;
        }

        const orderId = req.params.orderId
        const order = await Order.findOneAndUpdate({ orderId: orderId }, req.body)
        res.json({
            message: "Order updated successfully"
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json(
            {
                message: "An error occurred"
            }
        )

    }

}

export async function deleteOrder(req,res) {
    try{
        if(req.user ==null){
            res.status(401).json({
                message:"unauthorized"
            })
            return
        }
        if(req.user.role !=="admin" && req.user.role !=="superadmin"){
            res.status(403).json({
                message:"unauthorized"
            })
            return
        }

        const orderId =  req.params.orderId
        const order = await Order.findOneAndDelete({orderId:orderId})
        if(order == null){
            res.status(404).json({
                message:"Order not found"
            })
            return
        }
        res.json({
            message:"Order deleted successfully"
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"An error occurred"
        })
    }
}