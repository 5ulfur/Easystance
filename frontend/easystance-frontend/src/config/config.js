const config = {
    apiUrl: "http://127.0.0.1:4343",
    endpoints: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/check",
        getTicket: "/tickets/ticket",
        getTicketsList: "/tickets/list",
        createTicket: "/tickets/create",
        getTechniciansList: "/users/technicians/list",
        getComponentsList: "/warehouse/list"
    },
    language: "it"
};
  
export default config;