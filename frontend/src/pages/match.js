import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"; 
import { CssBaseline, Box, ThemeProvider, Slide, Card, CardContent, Typography, Grid, Container, Stack, useScrollTrigger } from '@mui/material';
import theme from '../theme/theme';
import Layout from "../hocs/Layout";

import Friends from '../components/Matching/Friends';
import { width } from '@mui/system';

const MatchPage = () => {
    const user = useSelector(state => state.auth.user); 

    return(
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout
                title='스꾸친 | Match'
                content='Match page'
            > 
            <Container sx={{p: '0 15px'}}>
                <Typography sx={{fontSize: '18px', fontWeight: '700'}}>
                    안녕하세요 {user!=null && user.nickname} 님 <br/>
                    오늘의 AI 매칭 추천을 확인해보세요 👀
                </Typography>
                {/* 상대 프로필 */}
                <Grid container sx={{overflowX: 'auto', flexWrap: 'nowrap', p: '0px'}}>
                    <Grid item sx={{flexShrink: 0, pr: '13px'}}>
                        <Friends />
                    </Grid>
                    <Grid item sx={{flexShrink: 0, pr: '13px'}}>
                        <Friends />
                    </Grid>
                    <Grid item sx={{flexShrink: 0}}>
                        <Friends />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
       </ThemeProvider>
    )
} 

export default MatchPage;