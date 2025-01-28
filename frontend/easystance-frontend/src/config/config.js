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
        deleteProfile: "/settings/delete"
    },
    language: "it"
};
  
export default config;