import Product from "../models/product.js";

export async function createProduct(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }

    if (req.user.role !== "admin" && req.user.role !=="superadmin") {
        res.status(403).json({
            message: "You are not authorized to create a product"
        })
        return;
    }
     if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }

    if (req.body.price <= 0 || req.body.stock < 0 || req.body.labeledPrice <= 0) {
        res.status(400).json({
            message: "Invalid product data"
        })
        return
    }

    const product = new Product(req.body);
    try {
        await product.save()
        res.json(
            {
                message: "Product saved successfully"
            }
        )

    } catch (err) {
        res.status(500).json(
            {
                message: "Product not saved"
            }
        )

    }
}

export function getProducts(req, res) {
    Product.find().then(
        (products) => {
            res.json(products)
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Products not found"
            })
        }
    )
}
export async function getProductById(req, res) {
    const productId = req.params.id
    const product = await Product.findOne({ productId: productId })
    if (product == null) {
        res.status(404).json({
            message: "Product not found"
        })
        return
    }
    res.json({
        product: product
    })
}



export function deleteProduct(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }

    if (req.user.role !== "admin" && req.user.role !=="superadmin") {
        res.status(403).json({
            message: "You are not authorized to delete a product"
        })
        return;
    }
     if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }

    Product.findOneAndDelete({
        productId: req.params.productId
    }).then(
        () => {
            res.json({
                message: "Product deleted successfully"
            })
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Product not deleted"
            })
        }
    )
}

export function updateProduct(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        })
        return;
    }

    if (req.user.role !== "admin" && req.user.role !=="superadmin") {
        res.status(403).json({
            message: "You are not authorized to update a product"
        })
        return;
    }
     if(req.user.isDisabled){
        res.status(403).json({
            message: "Your account is disabled"
        })
        return;

    }

    if (req.body.price <= 0 || req.body.stock < 0 || req.body.labeledPrice <= 0) {
        res.status(400).json({
            message: "Invalid product data"
        })
        return
    }

    Product.findOneAndUpdate({
        productId: req.params.productId
    }, req.body).then(
        () => {
            res.json({
                message: "Product updated successfully"
            })
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Product not updated"
            })
        }
    )
}