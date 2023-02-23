import { Model, Document, ObjectId } from "mongoose";

interface Accommodation {
  name: string;
  description: string;
  city: string;
  numberOfGuests: number;
  user: ObjectId;
}

export interface AccommodationDocument extends Accommodation, Document {}
