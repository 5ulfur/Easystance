const config = {
    apiUrl: "http://127.0.0.1:4343",
    endpoints: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/check",
        getTicket: "/tickets/ticket",
        getTicketsList: "/tickets/list",
        getData: "/settings/data",
        setEmail: "/settings/email",
        setPassword: "/settings/password",
        deleteProfile: "/settings/delete",
        createTicket: "/tickets/create",
        editTicket: "/tickets/edit",
        getComments: "/tickets/comments/list",
        createComment: "/tickets/comments/create",
        getActions: "/tickets/actions/list",
        createAction: "/tickets/actions/create",
        createCustomer: "/users/customers/create",
        getTechniciansList: "/users/technicians/list",
        getComponent: "/warehouse/component",
        getComponentsList: "/warehouse/list",
        createComponent: "/warehouse/create",
        setQuantity: "/warehouse/quantity"
    },
    language: "it"
};
  
export default config;