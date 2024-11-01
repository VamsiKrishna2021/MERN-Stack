import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products});
    } catch (error) {
        console.log("error in fetching products:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
} );

router.post("/", async (req,res) => {
    const product = req.body; //User will send this data

    if(!product.name || !product.price || !product.image) {
        return res.statusCode(400).json({ success:false, message: "Please provide all fields"});
    }

    const newProduct = new Product(product);
    
    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch (error) {
        console.error("Error in creating product:",error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }    
});

router.put("/:id", async (req, res) => {
    const {id} = req.params;

    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Invalid Product Id" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product,{new:true});
        res.status(200).json({ success: true, data: updatedProduct});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
} );

router.delete("/:id", async (req, res) => {
    const {id} = req.params;

    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    }   catch (error) {
        console.log("Error in deleating product:", error.message);
        res.status(404).json({ success: false, message: "Product not found" });
    }
});


export default router;