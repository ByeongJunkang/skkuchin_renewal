import cookie from 'cookie';
import { API_URL } from '../../../config/index';
import pino from "pino";


export default async (req, res) => {
    const logger = pino(pino.destination({
        dest: './login-file', // omit for stdout
        minLength: 4096, // Buffer before writing
        sync: false // Asynchronous logging
    }))

    if (req.method === 'POST') {
        const { username, password } = req.body;
        
        const body = JSON.stringify({
            username,
            password
        });
        logger.info('로그인 시작')
        try {
            const apiRes = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            logger.info(apiRes, '데이터 받아옴')
            const resValue = await apiRes.json();
            logger.info(resValue)
            if (apiRes.status === 200) {
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', resValue.data.access, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', resValue.data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    )
                ]);
                logger.info(res)

                return res.status(200).json({
                    success: resValue.message
                });
            } else {
                logger.info(apiRes)
                return res.status(apiRes.status).json({
                    error: resValue.message
                });
            }
        } catch(err) {
            logger.info(err)
            return res.status(500).json({
                error: 'Something went wrong when attempting login'
            });
        }
    } else {
        console.log(`Method ${req.method} now allowed`);
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} now allowed` });
    } 
};