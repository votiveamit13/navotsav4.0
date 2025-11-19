import { callApi } from "../utils/api";

export const forgotPassword = (payload) => {
    return callApi("post", "/forgot-password", payload);
};

export const resendOpt = (payload) => {
    return callApi("post", 'resend-otp', payload)
}

export const otpVerification = (payload) => {
    return callApi("post", "/verify-otp", payload);
}

export const resetPassword = (payload) => {
    return callApi("post", "/reset-password", payload);
}
