import mongoose, { Schema } from "mongoose";

export interface ISubscription{
    channel:mongoose.Types.ObjectId;
    subscriber:mongoose.Types.ObjectId;
}

const subscriptionSchema = new Schema<ISubscription>({
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
})

const Subscription = mongoose.models?.Subscription || mongoose.model("Subscription",subscriptionSchema);
export default Subscription;