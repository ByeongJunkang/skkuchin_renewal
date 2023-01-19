// 지역별 메뉴 불러오기
import cookie from 'cookie';
import { API_URL } from "../../../../config";

export default async(req, res) => {
    if(req.method == 'GET'){
       
        const place_id = parseInt(req.query.id, 10);
         //
         const cookies = cookie.parse(req.headers.cookie ?? '');
         const access = cookies.access ?? false;
 
         if(access == false){
             return res.status(401).json({
                 error: 'User unauthorized to make this request'
             });
         }
         //

        try {
            const apiRes = await fetch(`${API_URL}/api/menu/place/${place_id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${access}`
                }
            });

            const data = await apiRes.json();

            if(apiRes.status == 200){
                return res.status(200).json({
                    menu: data.data
                });
            } else {
                return res.status(apiRes.status).json({
                    error: data.error_message
                });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: 'Something went wrong when retrieving menu'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.statusa(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};