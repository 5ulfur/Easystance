const config = {
    apiUrl: "http://127.0.0.1:4343",
    endpoints: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/check",
        getTicket: "/tickets/ticket",
        getTicketsList: "/tickets/list",
        createTicket: "/tickets/create",
        editTicket: "/tickets/edit",
        getComments: "/tickets/comments/list",
        createComment: "/tickets/comments/create",
        getActions: "/tickets/actions/list",
        createAction: "/tickets/actions/create",
        createCustomer: "/users/customers/create",
        getTechniciansList: "/users/technicians/list",
        getComponentsList: "/warehouse/list"
    },
    language: "it"
};
  
export default config;