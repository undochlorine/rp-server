import pool from '../pool.js'
import {Request, Response} from "express";

async function logout(req: Request, res: Response) {
    try {
        if(req.cookies.session) {
            const sessionId = req.cookies.session
            await pool.query(
                'UPDATE sessions SET open = false WHERE id = $1',
                [sessionId]
            )
            res.clearCookie('session')
            res.send('Success')
        } else {
            res.send('Already logged out')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('Unexpected issue')
    }
}

export default logout