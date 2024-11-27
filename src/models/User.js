import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  name: {type: String, default: ""},
  email: {type: String, default: ""},
  image: {type: String, default: ""},
  emailVerified: Date,
});

export const User = models?.User || model("User", UserSchema);
