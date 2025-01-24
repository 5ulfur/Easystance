const config = {
    apiUrl: "http://127.0.0.1:4343",
    endpoints: {
        login: "/auth/login",
        logout: "/auth/logout",
        getData: "/data/user",
        checkAuth: "/auth/check",
        getTicket: "/tickets/ticket",
        getTicketsList: "/tickets/list",
        editEmail: "/settings/edit/email",
        editPassword: "/settings/edit/password"
    },
    language: "it"
};
  
export default config;