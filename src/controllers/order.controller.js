import Order from "../models/Order.js";

export async function getMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("eventId", "title eventDate coverImageUrl venue");
  res.json(orders);
}