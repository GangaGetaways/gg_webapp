module.exports = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/v1/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:12999" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};
