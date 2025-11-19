import { callApi } from "../utils/api";

export const contactLead = (payload) => {
    return callApi("post", "/contact-lead", payload);
};

export const fetchNotifications = (params) => {
    return callApi("GET", "/notifications", {}, params);
}

export const fetchBlogs = (params) => {
    return callApi("GET", "/blogs", {}, params);
}

export const fetchBlogInfo = (blogId) => {
    return callApi("GET", `/blogs/${blogId}`, {});
}

