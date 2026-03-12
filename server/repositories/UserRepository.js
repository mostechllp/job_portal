import { User } from "../models/User.js";

export class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }
    
    async create(userData) {
        return await User.create(userData);
    }
    
    async findById(id) {
        return await User.findById(id);
    }
    
    async updateProfileImage(userId, imageUrl) {
        try {
            return await User.findByIdAndUpdate(
                userId,
                { profileImg: imageUrl },
                { returnDocument: 'after', runValidators: true }
            ).select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordExpires");
        } catch (error) {
            throw new Error("Error updating profile image: " + error.message);
        }
    }
    
    async deleteProfileImage(userId) {
        try {
            return await User.findByIdAndUpdate(
                userId,
                { profileImg: null },
                { returnDocument: 'after' }
            ).select("-password -otp -otpExpires -resetPasswordOTP -resetPasswordExpires");
        } catch (error) {
            throw new Error("Error deleting profile image: " + error.message);
        }
    }
}