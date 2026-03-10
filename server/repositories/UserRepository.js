import {User} from "../models/User.js"

export class UserRepository {
    async findByEmail(email) {
        return await User.findOne({email});
    }
    async create(userData) {
        return await User.create(userData);
    }
}
