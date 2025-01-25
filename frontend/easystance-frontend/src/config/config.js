const config = {
    apiUrl: "http://127.0.0.1:4343",
    endpoints: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/check",
        getTicket: "/tickets/ticket",
        getTicketsList: "/tickets/list",
        getData: "/settings/data/user",
        setEmail: "/settings/data/email",
        setPassword: "/settings/data/password",
        deleteProfile: "/settings/data/delete"
    },
    language: "it"
};
  
export default config;