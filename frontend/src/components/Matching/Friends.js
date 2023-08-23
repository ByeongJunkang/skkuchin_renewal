import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"; 
import { Button, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Grid, Divider } from '@mui/material';
import { displayMBTI } from './MBTIList';
import { load_candidate } from '../../actions/candidate/candidate'
import { load_request_id, request_chat } from '../../actions/chat/chatRoom';
import noCharacter from '../../image/mbti/profile/noCharacter.png'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const GoLogin = dynamic(() => import('../GoLogin'));

const Friends = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector(state => state.matchingUser.matchingUser);
    const candidate = useSelector(state => state.candidate.candidate);
    const requestId = useSelector(state => state.chatRoom.requestId);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(load_request_id(([result, message]) => {
                if (result) {
                    dispatch(load_candidate());
                }
            }))
        }
    }, [isAuthenticated]);
    

    // 대화 요청하기 버튼
    const [open, setOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);

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
    }
    
    const handleSettingOpen = () => {
        if (isAuthenticated) {
            router.push({
                pathname: '/makeProfile',
                query: { src : '스꾸챗프로필설정', }
            });
        } else {
            setIsLogin(true);
        }
    }

    return (
        <Grid container sx={{overflowX: 'auto', flexWrap: 'nowrap', p: '0px', m: '0'}}>
            {isLogin && <GoLogin open={isLogin} onClose={setIsLogin} /> }
            { candidate ? 
            candidate.map((person, index) => (
            <Card key={index} variant="outlined" sx={{height: '292px', width: '242px', borderRadius: '10px', border: '1px solid #E2E2E2', p: '15px', flexShrink: 0, mr: '19px', mb: '21px'}}>
                <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                    {displayMBTI(person.mbti, 80, 80)}
                    <Typography sx={{p: '8px 0px', fontSize: '14px', fontWeight: '700'}}>{person !== null && person.nickname}</Typography>
                    <Grid item sx={{display: 'flex', fontSize: '12px', alignItems: 'center', fontWeight: 400, color: '#3C3C3C'}}>
                        {
                            person !== null && 
                            person.campus == '명륜' ?
                            <Typography sx={{width: 'max-content',color: '#FFAC0B', backgroundColor: '#FFFCE4', fontSize: '12px', fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{person.campus}</Typography>
                            : 
                            <Typography sx={{color: '#58C85A', backgroundColor: '#DCF8DB', fontSize: '12px',fontWeight: 700, p: '3.5px 5px 2.5px', borderRadius: '10px', mr: '5px'}}>{person.campus}</Typography>
                        }
                        <Grid item sx={{flexGrow: 1, fontSize: '12px'}}>
                            {person.major}/
                            {person.student_id}학번/
                            {(person.gender).charAt(0)}
                        </Grid>
                    </Grid>
                    
                    <Grid item sx={{display: 'flex', p: '10px 0', m: '10px 0'}}>
                        <Grid item sx={{color: '#9E9E9E', p: '0px 1.5px', fontSize: '12px', fontWeight: 700}}>
                            {'#'+person.mbti}
                        </Grid>
                        {(person.keywords) != null ?
                            ((person.keywords).slice(0, 2).map((interest, index)=> (
                                <Grid item key={index} sx={{ color: '#9E9E9E', p: '0px 1.5px', fontSize: '12px', fontWeight: 700}}>
                                    {'#'+interest}
                                </Grid>
                            )))
                        : null}
                    </Grid >
                    <Typography sx={{ fontSize:'12px', fontWeight: 700, backgroundColor: '#FBFBFB', color: '#777', p: '3px 7px 2px', borderRadius: '10px', mb: '10px'}}>{person.introduction}</Typography>
                    <Grid item sx={{ display: 'flex',  alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                        <Button
                            disableElevation
                            disableTouchRipple
                            key="profile-button"
                            onClick={() => router.push('/clickProfile')}
                            sx={{
                                color: '#FFAC0B',
                                fontSize: '12px',
                                fontWeight: 800,
                                textAlign: 'center',
                                pr: '15px',
                            }}
                        >
                            프로필 보기
                        </Button>
                        <div
                            style={{
                                width: '2px',
                                height: '12px', 
                                backgroundColor: '#E2E2E2',
                                borderRadius: '10px',
                            }}
                        />
                        {requestId && requestId.includes(person.id) ? (
                            <Button
                                disableElevation
                                disableTouchRipple
                                key="completed-button"
                                sx={{
                                    color: '#505050',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    pl: '15px',
                                }}
                            >
                                신청 완료
                            </Button>
                        ) : (
                            <Button
                                disableElevation
                                disableTouchRipple
                                key="apply-button"
                                onClick={() => handleOpen(person.id)}
                                sx={{
                                    color: '#FFAC0B',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    pl: '15px',
                                }}
                            >
                                밥약 신청하기
                            </Button>
                        )}
                    </Grid>

                    <Dialog
                        key={person.id}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: { 
                                borderRadius: '10px', 
                                boxShadow: 'none', 
                                maxWidth: '100vw', 
                                maxHeight: '100vh'
                            }
                        }}
                        BackdropProps={{
                            sx: {
                                backgroundColor: 'rgba(50, 50, 50, 0.25)',
                                maxWidth: '100vw',
                                maxHeight: '100vh'
                            }
                        }}
                    >
                        <DialogContent sx={{p: '20px 24px 13px'}}>
                            <DialogContentText sx={{textAlign: 'center', fontWeight: '500px'}}>
                                <DialogTitle sx={{color: '#000', fontSize: '15px', p: '11px 23px 5px', m: '0'}}>{"대화를 요청하시겠습니까?"}</DialogTitle>
                                <Typography sx={{color: '#BABABA', fontSize: '9px'}}>*신청 후 취소는 불가능</Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{p:'0'}}>
                            <div style={{width: '100%', paddingBottom: '16px'}}>
                                <Button sx={{width: '50%', p: '0', m: '0', color: '#000', borderRadius: '0',borderRight: '0.25px solid #A1A1A1'}} onClick={handleClose}>취소</Button>
                                <Button sx={{width: '50%', p: '0', m: '0', color: '#D72D2D', borderRadius: '0', borderLeft: '0.25px solid #A1A1A1'}} onClick={() => handleSubmit(selectedPersonId)}>신청</Button>
                            </div>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Card> 
            )) 
            :
            <>
                <Card variant="outlined" sx={{height: '292px', width: '242px', borderRadius: '30px', border: '1px solid #BABABA', m: '13px 0px 25px', p: '16px 0 13px', flexShrink: 0, mr: '13px'}}>
                    <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image src={noCharacter} width={140} height={140} placeholder="blur" layout='fixed' />
                        <Typography sx={{p: '8px 0px', fontSize: '15px', fontWeight: '700'}}>바뱍</Typography>
                        <Grid item sx={{display: 'flex', fontSize: '10px', alignItems: 'center', fontWeight: '500', color: '#BABABA'}}>
                            <Typography sx={{border: "1px solid #BABABA", fontSize: '10px', p: '1px 6.5px', borderRadius: '17px'}}>명륜</Typography>&nbsp;
                            경영학과 &nbsp;/&nbsp; 
                            23학번 &nbsp;/&nbsp; 
                            남
                        </Grid>
                        <Grid item sx={{display: 'flex'}}>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                ENFP
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                일식
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                음악
                            </Grid>
                        </Grid >
                        <Grid item sx={{width: '169px', height: '48px',textAlign: 'center', pb: '8px'}}>
                            <Typography sx={{ fontSize:'13px', fontWeight: '500', whiteSpace: 'pre-wrap'}}>
                                {
                                    user?.matching === false ?
                                    '성대 학우와 대화를 나누시려면\n\n[내 프로필 보기]에서\n대화 활성화 버튼을 켜주세요 👀' 
                                    : '성대 학우와 대화를 나누시려면 추가 프로필을 등록해주세요 👀'
                                }
                            </Typography>
                        </Grid>
                        {
                            user?.matching === false ?
                            null
                            :
                            <Button onClick={()=>handleSettingOpen()}  sx={{backgroundColor: '#FFCE00', borderRadius: '30px', color: '#fff', fontSize: '12px', fontWeight: '700', textAlign: 'center', p: '8.5px 11.5px', m : '5px 0px'}}>
                                프로필 등록하기
                            </Button>
                        }
                    </Grid>
                </Card>
                <Card variant="outlined" sx={{height: '292px', width: '242px', borderRadius: '30px', border: '1px solid #BABABA', m: '13px 0px 25px', p: '16px 0 13px', flexShrink: 0, mr: '13px'}}>
                    <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image src={noCharacter} width={140} height={140} placeholder="blur" layout='fixed' />
                        <Typography sx={{p: '8px 0px', fontSize: '15px', fontWeight: '700'}}>김꾸친</Typography>
                        <Grid item sx={{display: 'flex', fontSize: '10px', alignItems: 'center', fontWeight: '500', color: '#BABABA'}}>
                            <Typography sx={{border: "1px solid #BABABA", fontSize: '10px', p: '1px 6.5px', borderRadius: '17px'}}>명륜</Typography>&nbsp;
                            무용학과 &nbsp;/&nbsp; 
                            20학번 &nbsp;/&nbsp; 
                            여
                        </Grid>
                        <Grid item sx={{display: 'flex'}}>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                ISFJ
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                여행
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                동아리
                            </Grid>
                        </Grid >
                        <Grid item sx={{width: '169px', height: '48px',textAlign: 'center', pb: '8px'}}>
                            <Typography sx={{ fontSize:'13px', fontWeight: '500', whiteSpace: 'pre-wrap'}}>
                                {
                                    user?.matching === false ?
                                    '성대 학우와 대화를 나누시려면\n\n[내 프로필 보기]에서\n대화 활성화 버튼을 켜주세요 👀' 
                                    : '성대 학우와 대화를 나누시려면 추가 프로필을 등록해주세요 👀'
                                }
                            </Typography>
                        </Grid>
                        {
                            user?.matching === false ?
                            null
                            :
                            <Button onClick={()=>handleSettingOpen()}  sx={{backgroundColor: '#FFCE00', borderRadius: '30px', color: '#fff', fontSize: '12px', fontWeight: '700', textAlign: 'center', p: '8.5px 11.5px', m : '5px 0px'}}>
                                프로필 등록하기
                            </Button>
                        }
                    </Grid>
                </Card>
                <Card variant="outlined" sx={{height: '292px', width: '242px', borderRadius: '30px', border: '1px solid #BABABA', m: '13px 0px 25px', p: '16px 0 13px', flexShrink: 0, mr: '13px'}}>
                    <Grid container direction="column" sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image src={noCharacter} width={140} height={140} placeholder="blur" layout='fixed' />
                        <Typography sx={{p: '8px 0px', fontSize: '15px', fontWeight: '700'}}>웅</Typography>
                        <Grid item sx={{display: 'flex', fontSize: '10px', alignItems: 'center', fontWeight: '500', color: '#BABABA'}}>
                            <Typography sx={{border: "1px solid #BABABA", fontSize: '10px', p: '1px 6.5px', borderRadius: '17px'}}>율전</Typography>&nbsp;
                            반도체시스템공학과 &nbsp;/&nbsp; 
                            22학번 &nbsp;/&nbsp; 
                            여
                        </Grid>
                        <Grid item sx={{display: 'flex'}}>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                INTP
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                연극 / 뮤지컬
                            </Grid>
                            <Grid item sx={{backgroundColor: '#BABABA', color: '#fff', p: '4.5px 7.5px', fontSize: '12px', fontWeight: '500px', borderRadius: '116px', m: '11px 2.5px 20px'}}>
                                카페
                            </Grid>
                        </Grid >
                        <Grid item sx={{width: '169px', height: '48px',textAlign: 'center', pb: '8px'}}>
                            <Typography sx={{ fontSize:'13px', fontWeight: '500', whiteSpace: 'pre-wrap'}}>
                                {
                                    user?.matching === false ?
                                    '성대 학우와 대화를 나누시려면\n\n[내 프로필 보기]에서\n대화 활성화 버튼을 켜주세요 👀' 
                                    : '성대 학우와 대화를 나누시려면 추가 프로필을 등록해주세요 👀'
                                }
                            </Typography>
                        </Grid>
                        {
                            user?.matching === false ?
                            null
                            :
                            <Button onClick={()=>handleSettingOpen()}  sx={{backgroundColor: '#FFCE00', borderRadius: '30px', color: '#fff', fontSize: '12px', fontWeight: '700', textAlign: 'center', p: '8.5px 11.5px', m : '5px 0px'}}>
                                프로필 등록하기
                            </Button>
                        }
                    </Grid>
                </Card>
            </>
            }
    </Grid>
    )
}

export default Friends;