import { callApi } from "../utils/api";

export const fetchEvents = (params) => {

    return callApi('GET', '/events', {}, params)
}

export const pastEvents = (params) => {

    return callApi('GET', '/past-events', {}, params)
}

export const fetchCategories = () => {
    return callApi('GET', 'event/categories');
}

export const eventDetail = (id) => {

    return callApi('GET', `/event/${id}`)
}

export const collectedAmount = (id) => {

    return callApi('GET', `/event/${id}/collected-amount`)
}

export const reserveTicket = (payload) => {

    return callApi('POST', `/event/reserve-ticket`, payload)
}

export const reservedTickets = (id) => {
    return callApi('GET', `/event/${id}/reserve-ticket`)
}

export const bookingTickets = (payload) => {
    return callApi('POST', `/event/book-ticket`, payload)
}

export const addFavoriteEvent = (eventId) => {
    return callApi('POST', `/event/${eventId}/favourite`)
}

export const fetchFavourites = (params) => {
    return callApi('GET', `/event/favourite-events`, {}, params)
}

export const TicketHistory = (params) => {
    return callApi('GET', `/event/ticket-history`, {}, params);
}

export const claimPrize = (payload) => {
    return callApi('POST', '/claim-prize', payload);
}