import React, { useState } from 'react';
import { Box, Typography, Avatar, Grid, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from "react-redux";

const GoLogin = dynamic(() => import('../GoLogin'));

// id, article_type, title, content, user_id, nickname, user_image, display_time, article_like_count, comment_count
const CommunityItem = ({ id, title, content, article_like_count, comment_count, display_time, image }) => {
    const router = useRouter();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isLogin, setIsLogin] = useState(false);

    const handleClick = () => {
        if (isAuthenticated) {
            router.push(`/posts/${id}`); 
        } else {
            setIsLogin(true);
        }
    };    

    return (
        <>
            {isLogin && <GoLogin open={isLogin} onClose={setIsLogin} /> }
            <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', width: '100%', p: '13px 0px', borderBottom: '1px solid #E2E2E2'}}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{fontSize: '14px', fontWeight: 800, color: '#3C3C3C'}}>{title}</Typography>
                    <Typography sx={{p:' 8px 0px', fontSize: '14px', fontWeight: 400, color: '#3C3C3C', textOverflow: 'ellipsis'}}>
                        {content}
                    </Typography>
                    <Grid container sx={{ alignItems: 'center', p: 0, m: 0 }}>
                    <Grid item sx={{ display: 'flex', alignItems: 'center'}}>
                        <FavoriteBorderIcon sx={{width: '15px', color: '#FFCE00'}} />
                        <Typography sx={{fontSize: '12px', ml: '3px', color: '#FFCE00', fontWeight: 600}}>
                        {article_like_count}
                        </Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: '7px' }}>
                        <ChatBubbleOutlineIcon sx={{width: '13px', color: '#72D270'}} />
                        <Typography sx={{fontSize: '12px', ml: '3px', color: '#72D270', fontWeight: 600, ml: 0.5}}>
                        {comment_count}
                        </Typography>
                    </Grid>
                    <Divider orientation='vertical' sx={{width: '2px', height: '10px'}}/>
                    <Grid item sx={{ml: '7px'}}>
                        <Typography sx={{color: '#BABABA', fontWeight: 700, fontSize: '12px'}}>
                        {display_time}
                        </Typography>
                    </Grid>
                    </Grid>
                </Box>
                {image && (
                    <Box sx={{pl: '15px'}}>
                        <img src={image} alt="" width={75} height={75} style={{borderRadius: '20px'}}/>
                    </Box>
                )}
            </Box>
        </>
  );
};

export default CommunityItem;
