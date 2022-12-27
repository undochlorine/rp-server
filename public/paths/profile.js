import pool from '../pool.js';
async function profile(req, res) {
    try {
        const headers = req.headers;
        if (headers.cookie?.includes('session')
            && headers?.cookie[headers?.cookie.indexOf('session') + 7] === '=') {
            const doesntExist = Boolean((await pool.query('SELECT count(*) FROM sessions WHERE id = $1 AND open = true', [headers.cookie.split('=')[1]])).rows[0].count == 0);
            if (doesntExist) {
                return res.status(400).send('Has wrong cookie');
            }
            const sessionId = headers.cookie.split('=')[1];
            const { expires, user_id } = (await pool.query('SELECT expires, user_id FROM sessions WHERE id = $1', [sessionId])).rows[0];
            if (Date.now() > expires) {
                await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
                return res.status(403).send('Session has expired. Log in again');
            }
            const user = (await pool.query('SELECT username, name, lastname, avatar, theme FROM users WHERE id = $1', [user_id])).rows[0];
            res.json(user);
        }
        else {
            res.send('Log in first');
        }
    }
    catch (e) {
        res.status(500).send('Unexpected issue');
        console.log(e);
    }
}
export default profile;
