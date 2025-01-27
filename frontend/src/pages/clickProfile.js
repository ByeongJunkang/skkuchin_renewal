import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { useRouter } from "next/router";
import { load_other_matching_info } from '../actions/matchingUser/matchingUser';
import { CssBaseline, Typography, Grid, Container,ThemeProvider, Card, Box, Button, Divider } from '@mui/material';
import theme from '../theme/theme';
import Image from 'next/image';
import { displayMBTI } from '../components/Matching/MBTIList';
import close from '../image/close.png';
import dynamic from 'next/dynamic';
import MBTITypes from '../components/SkkuChat/MBTITypes';
import { clear_matching } from '../actions/matchingUser/matchingUser';
import CustomPopup from '../components/SkkuChat/CustomPopup';
import CustomPopupNoBtn from '../components/SkkuChat/CustomPopupNoBtn';
import { request_chat } from '../actions/chat/chatRoom';

const clickProfile = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const friendId = router.query.id; 

    const requestId = useSelector(state => state.chatRoom.requestId);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const matchingUser = useSelector(state => state.matchingUser.matchingUser);

    const [keywordCategories, setKeywordCategories] = useState([]);

    if (typeof window !== 'undefined' && !isAuthenticated) {
        router.push('/login');
    }
    
    useEffect(() => {
        dispatch(clear_matching());
        if (friendId) {
            dispatch(load_other_matching_info(friendId));
        }  
    }, []);

    
    useEffect(() => {
        if (matchingUser && matchingUser.keywords) {
            const categories = Object.keys(matchingUser.keywords);
            setKeywordCategories(categories);
        }
    }, [matchingUser]);
    
    const handleBack = (e) => {
        router.back();
    }

    const [open, setOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);

    const [isPopupMessageOpen, setIsPopupMessageOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleOpen = (id) => {
        setOpen(true);
        setSelectedPersonId(id);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleSubmit = (id) => {
        setOpen(false);
        dispatch(request_chat(id));

        setPopupMessage('신청이 완료되었습니다!');
        setIsPopupMessageOpen(true);
    }

    return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth="md"  style={{ position:'fixed', zIndex:'4', padding:'14px 24px 5px', overflow: "hidden", height:'max-content', maxWidth:'420px', top: '0', backgroundColor: '#fff'}} >
                    <Card style={{
                        top: '18px',
                        height: '120%',
                        zIndex: '4',
                        borderRadius: 0,
                        boxShadow: 'none',
                    }}>
                        <Grid container style={{justifyContent: 'space-between', alignItems: 'center'}}>
                            <Grid sx={{width: '24px'}}>
                            </Grid>
                            <Grid>
                                <Typography sx={{fontSize: '18px', fontWeight: 700, color: '#3C3C3C'}}>프로필</Typography>
                            </Grid>
                            <Grid onClick={handleBack}>
                                <Image src={close} width={24} height={24} name='search' layout='fixed' />
                            </Grid>
                        </Grid>
                    </Card>
                </Container>

                <div style={{
                    padding: '0',
                    margin:'48px 24px 0',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                
                {matchingUser !== null ?
                    <>
                        <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px 0'}}>
                            <Grid item sx={{mr: '18px'}}>{displayMBTI(matchingUser.mbti, 80, 80)}</Grid>
                            <Grid item sx={{flexGrow: 1, height: '80px'}}>
                                <Typography sx={{p: '10px 0px', fontSize: '16px', fontWeight: '700'}}>{ matchingUser.nickname}</Typography>
                                <Grid item sx={{display: 'flex', fontSize: '12px', alignItems: 'center', fontWeight: 400, color: '#3C3C3C'}}>
                                    {
                                        matchingUser !== null && 
                                        matchingUser.campus == '명륜' ?
                                        <Typography sx={{width: 'max-content',color: '#FFAC0B', backgroundColor: '#FFFCE4', fontSize: '12px', fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{matchingUser.campus}</Typography>
                                        : 
                                        <Typography sx={{color: '#58C85A', backgroundColor: '#DCF8DB', fontSize: '12px',fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{matchingUser.campus}</Typography>
                                    }
                                    <Grid item sx={{flexGrow: 1, fontSize: '12px'}}>
                                        {matchingUser.major}/
                                        {matchingUser.student_id}학번/
                                        {(matchingUser.gender).charAt(0)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: '20px' }}>
                            <Typography sx={{ fontSize: '12px', color: '#3C3C3C', fontWeight: 700, pl: '4px', mb: '8px' }}>MBTI</Typography>
                            <MBTITypes types={['E', 'N', 'F', 'P', 'I', 'S', 'T', 'J']} matchingUser={matchingUser} />
                        </Box>

                        <Box>
                            <Typography sx={{fontSize: '12px', color: '#3C3C3C', fontWeight: 700, p: '16px 4px 8px'}}>한 줄 자기소개</Typography>
                            <Typography sx={{ fontSize:'13px', fontWeight: '500', p: '12px 18px', borderRadius: '8px', border: '1px solid #E2E2E2'}}>
                                {matchingUser.introduction}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: '30px', mb: '100px' }}>
                            <Typography sx={{ fontSize: '16px', color: '#3C3C3C', fontWeight: 800}}>관심사 태그</Typography>
                            {keywordCategories && keywordCategories.map((category, index) => (
                                <div key={index}>
                                    <Typography sx={{ fontSize: '16px', color: '#3C3C3C', fontWeight: 700, pl: '4px', mt: '20px' }}>{category}</Typography>
                                    <Grid container sx={{ display: 'flex', columnGap: '8px' }}>
                                        {matchingUser.keywords[category] && matchingUser.keywords[category].map((keyword, index) => (
                                            <Grid item key={index} sx={{ backgroundColor: '#FFFCE4', color: '#3C3C3C', fontSize: '14px', fontWeight: 400, p: '4.5px 18px', m: '11px 0px 0px',borderRadius: '100px', whiteSpace: 'nowrap', border: '1px solid #FFCE00' }}>
                                                {keyword}
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            ))}
                        </Box>
                    </>
                    : null}
                    </div>
                { matchingUser && 
                    <>
                        <Container sx={{position: 'fixed', backgroundColor: '#fff', width: '100%', height: '100px', bottom: '0px'}}>
                            <Button
                                disableElevation
                                disableTouchRipple
                                sx={{
                                    position: 'fixed',
                                    color: '#FFF',
                                    fontSize: '16px',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    backgroundColor: requestId && requestId.includes(matchingUser.id) ? '#E2E2E2' : '#FFCE00',
                                    borderRadius: '8px',
                                    bottom: '24px',
                                    width: '327px',
                                    height: '56px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                                onClick={() => {
                                    if (matchingUser !== null && !(requestId && requestId.includes(matchingUser.id))) {
                                        handleOpen(matchingUser.id);
                                    }
                                }}
                                disabled={requestId && requestId.includes(matchingUser.id)}
                            >
                                {requestId && requestId.includes(matchingUser.id) ? '밥약 신청완료' : '밥약 신청하기'}
                            </Button>
                        </Container>
                        <CustomPopup
                            open={open}
                            onClose={handleClose}
                            content={`밥약 신청을 하시겠어요?`}
                            leftButtonLabel="아니요"
                            rightButtonLabel="신청"
                            onLeftButtonClick={handleClose}
                            onRightButtonClick={() => {
                                handleSubmit(selectedPersonId);
                        }}
                        />

                        <CustomPopupNoBtn
                            open={isPopupMessageOpen}
                            onClose={() => setIsPopupMessageOpen(false)}
                            content={popupMessage}
                        />
                    </>
                }
        </ThemeProvider>
    )
}

export default dynamic(() => Promise.resolve(clickProfile), {
    ssr: false,
});