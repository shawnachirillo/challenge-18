import jwt from 'jsonwebtoken';
const secret = 'mysecretsshhhhh';
const expiration = '2h';
export function signToken({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
export function authMiddleware({ req }) {
    // Get token from headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = token.split(' ').pop()?.trim();
    }
    if (!token)
        return req;
    try {
        const { data } = jwt.verify(token, secret);
        req.user = data;
    }
    catch (err) {
        console.error('Invalid token');
    }
    return req;
}
