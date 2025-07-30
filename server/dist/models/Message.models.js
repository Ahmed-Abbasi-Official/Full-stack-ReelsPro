import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    reportedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});
export const Message = models?.Message || model('Message', messageSchema);
//# sourceMappingURL=Message.models.js.map