import mongoose from "mongoose";

const sequenceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter ID"]
        },
        val: {
            type: Number,
            required: [true, "Please enter the sequence name"]
        }
    },
    {
        timestamps: true
    }
)

const Sequence = mongoose.models.sequence ||mongoose.model('sequence', sequenceSchema);

export default Sequence;