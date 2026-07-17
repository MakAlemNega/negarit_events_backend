import mongoose from "mongoose";

const ticketTierSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "General Admission" },
  price: { type: Number, required: true, min: 0 },
  totalCapacity: { type: Number, required: true, min: 1 },
  remainingCapacity: { type: Number, required: true, min: 0 },
});

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Music",
        "Tech",
        "Food & Drink",
        "Art",
        "Sports",
        "Networking",
        "Comedy",
        "Film",
        "Wellness",
        "Dance",
        "Business",
      ],
    },
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    eventDate: { type: Date, required: true },
    coverImageUrl: { type: String, default: "" },
    galleryImageUrls: { type: [String], default: [] },
    inviteOnly: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected"],
      default: "draft",
    },
    rejectionReason: { type: String, default: "" },
    computedBadge: {
      type: String,
      enum: ["trending", "selling_fast", "popular", "tonight", null],
      default: null,
    },
    ticketTiers: { type: [ticketTierSchema], default: [] },
  },
  { timestamps: true },
);

eventSchema.index({ title: "text", "venue.name": "text" });

export default mongoose.model("Event", eventSchema);
