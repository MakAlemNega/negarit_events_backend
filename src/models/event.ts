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
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    default: 0,
  },
});

const Event = model<IEvent>("Event", eventSchema);

export { Event };
