import { Schema, model } from "mongoose";

interface IEvent {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [4, "Title must be at least 4 characters long"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    validate: {
      validator: function (value: Date) {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        return value >= todayMidnight;
      },
      message: "Date must be in the future",
    },
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    minlength: [4, "Location must be at least 4 characters long"],
  },
  capacity: {
    type: Number,
    min: [1, "Capacity must be at least 1"],
    required: [true, "Capacity is required"],
  },
});

const Event = model<IEvent>("Event", eventSchema);

export { Event };
