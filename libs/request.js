const http = require("http");
const https = require("https");

function request(url,params = {}) {
    return new Promise((resolve) => {
        const protos = {https,http};
        const proto = protos[url.split("://")[0] ?? "http"];
        params = {
            ...params,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(params.headers || {})
            },
            host: url.split("://")[1].split("/")[0],
            path: "/"+url.split("://")[1].split("/").slice(1).join("/")
        };
        const req = proto.request(params, res => {
            let data = [];
            res.on("data", chunk => data.push(chunk));
            res.on("end", () => {
                const out = {
                    body: Buffer.concat(
                        data,
                        data.reduce((acc, item) => acc + item.length, 0)
                    ).toString(),
                    status: res.statusCode
                }
                resolve(out);
            });
        });
        if (params.body)
            req.write(params.body);
        req.end();
    });
}

module.exports = request;
