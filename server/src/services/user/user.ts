import mongoose, { Schema } from "mongoose";
import { UserFull } from "../../types/user";

const UsersSchema = new Schema<UserFull>({
    email: { type: String, required: true },
    name: { type: String, required: true },
    // saved_colors: {
    //     type: [
    //         {
    //             name: { type: String, required: false },
    //             color: { type: String, required: true },
    //         },
    //     ],
    //     default: () => [],
    // },
    picture: { type: String, required: false },
    google_identifier: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, required: true },
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

const Users = mongoose.model<UserFull>("Users", UsersSchema);

export default Users;
