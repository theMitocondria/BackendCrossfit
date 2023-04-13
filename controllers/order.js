import Order from "../models/order.js";
import User from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = async(req, res) => {
    try{
        const {token} = req.headers;
        const user = await User.findOne({token});


        if(!user.hasShippingAddress){
            return res.status(400).json({
                success: false,
                message:"Please enter a shipping address"
            })
        }

        const shippingAddress =  user.shippingAddress;
        const {orderItems, amount} = req.body;


        if(orderItems?.length<=0){
            return res.status(400).json({
                success: false,
                message:"your card is empty"
            })
        }

        const order =await Order.create({
            orderedBy:user._id,
            orderItems,
            shippingAddress,
            amount
        })

        user.orders.push(order._id);
        user.save();

        const convertedOrders = orderItems?.map((item) => {
            return {
                price_data:{
                    currency: "inr",
                    product_data:{
                        name:item?.name,
                        description: item?.description,
                    },
                    unit_amount: item?.price * 100,
                },
                quantity: item?.qty,
            }
        })


        const session = await stripe.checkout.sessions.create({
            line_items: convertedOrders,
            metadata:{
                orderId : JSON.stringify(order?._id),
            },
            mode: 'payment',
            success_url: `http://localhost:3001/success`,
            cancel_url: `http://localhost:3001/cancel`,
          });
        
       

        res.status(200).json({
            success:true,
            message:"Your order has been created",
            order,
            url:session.url
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getAllOrder = async(req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json({
            success: true,
            message:"all orders",
            orders,
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getSingleOrder = async(req, res) => {
    try{
        const id = req.params.id
        const order = await Order.findById(id);
    
        if(!order){
            return res.status(404).json({
                success:false,
                message:"order not found"
            })
        }
    
        res.status(200).json({
            success: true,
            message: "single order",
            order,
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}