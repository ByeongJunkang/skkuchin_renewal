import { useState, useEffect } from "react";
import {  TextField, Button, Typography, Box, Select, MenuItem, Link} from '@mui/material';
import back from '../../../image/arrow_back_ios.png';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { find_username } from '../../../actions/auth/auth';

export default function Step1(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [emailId, setEmailId] = useState('');
    const [domain, setDomain] = useState('@g.skku.edu');

    const handleLinkClick = () => {
        router.push('/login');
    }

    const handleSubmit= (e) => {
        e.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(find_username(emailId+domain, ([result, message]) => {
                if (result) {
                    props.handleNextStep();
                } else {
                    alert(message);
                }
            }));
        }
    }

    return (
        <Box
            sx={{
            marginTop: '45px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
        <header style={{display: 'flex',  width: '100%', justifyContent: 'space-between', marginBottom: '55px'}}>
                <Image width={12.02} height={21.55} src={back} />
                <Typography align='center' style={{margin: 'auto', fontSize: '18px', fontWeight: '700'}}>아이디 찾기</Typography>
        </header>
        <form onSubmit={handleSubmit}>
        <Typography style={{fontSize: '14px', fontWeight: '400', marginBottom: '13px'}}>이메일 입력</Typography>
            <div style={{textAlign: 'center', display: 'flex'}}>
            <TextField
                variant="standard"
                placeholder="킹고 이메일 주소"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                InputProps={{
                    style: {
                        fontSize: '12px',
                        padding: '4px 24px 5px 0',
                        height: '32px'
                    }
                }}    
            />
            <Select
                variant="standard"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                InputProps={{
                    style: {
                        fontSize: '12px',
                    }
                }}
            >
                <MenuItem value="@g.skku.edu">@g.skku.edu</MenuItem>
                <MenuItem value="@skku.edu">@skku.edu</MenuItem>
            </Select>
            </div>
            <Typography sx={{fontSize: '9px', fontWeight: '500', color: '#505050', mt: '6px', marginBottom: '200px'}}>회원가입시 입력하신 이메일을 입력해주세요.</Typography>
            {emailId != '' ?
                <Button variant="contained" onClick={handleSubmit} style={{width: '100%', backgroundColor: "#FFCE00", color: '#fff', fontSize: '16px', fontWeight: '700',  borderRadius: '15px', height: '38px', boxShadow: 'none'}}>
                    확인
                </Button>
                :
                <Button variant="contained"  disabled style={{width: '100%', backgroundColor: "#BABABA", color: '#fff', fontSize: '16px', fontWeight: '700',  borderRadius: '15px', height: '38px', boxShadow: 'none'}}>
                    확인
                </Button>
            }
    
            </form>
            <div style={{textAlign: 'center', fontSize: '12px', fontWeight: '500', padding: '6px 0', color: '#505050'}}>
                    <Link component="button" onClick={handleLinkClick} color="#BABABA" sx={{fontSize: '12px', mb: '18px'}}>로그인 홈 가기</Link>
            </div>
        </Box>
    );
}