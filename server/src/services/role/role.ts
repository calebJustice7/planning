import mongoose, { Schema } from "mongoose";
import { RoleFull } from "../../types/role";

const RolesSchema = new Schema<RoleFull>({
    name: { type: String, required: true },
    default: { type: Boolean, default: false },
    permissions: {
        type: [
            {
                action: { type: String, required: true },
                subject: { type: String, required: true },
                conditions: { type: Object, required: false },
            },
        ],
        required: true,
    },
});

const Roles = mongoose.model<RoleFull>("Roles", RolesSchema);

export default Roles;
