import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { fetchSignUp, initialize } from '../feature/userSlice';


const AuthBackground = styled.div`
  height: 80vh;
  display:flex;
  justify-content: center;
  align-items: center;
`

const AuthJoinBlock = styled.div`
  border-radius: 10px;
  padding: 20px;
  max-width: 320px;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;

  .auth-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #575f95;
    font-weight: 700;
  };

  .auth-message-box {
    position: relative;
    padding-top: 4px;
    padding-bottom: 1px;
  }
`;

const AuthJoinForm = styled.div`
  display: flex;
  flex-direction: column;

  .auth-input-box {
    position: relative;
    margin-top: 25px;
    display: flex;
    align-items: end;
    justify-content: space-between;
  };

  input {
    width: 155px;
    border-bottom: solid 1.25px #D8D9DE;
  };

  .auth-input-title {
    display: flex;
    min-width: fit-content;
    font-size: 14px;
  };
`;

const Message = styled.div`
  position: absolute;
  right: 0;
  top: 20px;
  display: flex;
  justify-content: end;
  font-size: 9px;
  color: red;
  margin-left: 2px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 13px;
  color: #fa8072;
  margin-left: 2px;
`;

const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled(Button)`
  width: 135px;
  margin-right: 10px;
  height: 30px;
  color: #575f95;
  background-color: white;
  border: solid 1px #575f95;
  font-weight: 500;
`;

const JoinButton = styled(Button)`
  width: 150px;
  height: 30px;
  font-weight: 500;
`;

const Join = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isSignUp, signUpError } = useSelector((state) => state.user);

  // ??????, ?????????, ????????????, ???????????? ?????? 
  const [joinInfo, setJoinInfo] = useState({ 
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ???????????????
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  // ????????? ????????? ??????
  const handleInputNickname = (e) => {
    setJoinInfo({ ...joinInfo, [e.target.name] : e.target.value });
    const testNickname = /[a-zA-Z0-9_-]{4,12}$/;
    if (!testNickname.test(e.target.value)) { 
      setNicknameMessage('?????? ????????????/?????? 4-12??? ?????? ??????????????????');
    } else {
      setNicknameMessage('');
    }
  }; 

  const handleInputEmail = (e) => {
    setJoinInfo({...joinInfo, [e.target.name] : e.target.value});
    const { email } = joinInfo;
    const testEmail = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if(!testEmail.test(email)) {
      setEmailMessage('???????????? ?????? ????????? ???????????????');
    } else {
      setEmailMessage('');
    }
  };
  
  const handleInputPassword = (e) => {
    setJoinInfo({...joinInfo, [e.target.name] : e.target.value});
    const testPassword = /(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    if(!testPassword.test(e.target.value)){
      setPasswordMessage('?????? ????????????/??????/???????????? ?????? 8-16??? ???????????? ?????????');
    } else {
      setPasswordMessage('');
    }
  };

  const handleInputConfirmPassword = (e) => {
    setJoinInfo({...joinInfo, [e.target.name] : e.target.value});
    const { password } = joinInfo;
    if(e.target.value !== password ) {
      setConfirmPasswordMessage('??????????????? ???????????? ????????????')
    } else {
      setConfirmPasswordMessage('');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if(nicknameMessage === "" && emailMessage === "" && passwordMessage === "" && confirmPasswordMessage === "") {
      dispatch(fetchSignUp(joinInfo));
    }
    setJoinInfo({
      nickname: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  const onKeyPress = (e) => {
    if(e.key === 'Enter'){
      handleSubmit(e);
    }
  }

  useEffect(() => {
    if(isSignUp){
      history.push('/login');
    } 
    if(signUpError) {
      setServerErrorMessage(signUpError);
    }
    return () => { //??????????????? ??? ?????????
      dispatch(initialize());
    }
  },[dispatch, history, isSignUp, signUpError])

  return (
    <AuthBackground>
      <AuthJoinBlock>
        <div className="auth-title">
          Join
        </div>
        <AuthJoinForm onKeyPress={onKeyPress}>
          <div className="auth-input-box">
            <div className="auth-input-title">
              nickname
            </div>
            <input
              className="auth-input"
              autoComplete="off"
              name="nickname"
              type="text"
              value={joinInfo.nickname}
              onChange={handleInputNickname}
            />
          <Message>{nicknameMessage}</Message>
          </div>
          <div className="auth-input-box">
            <div className="auth-input-title">
              email
            </div>
            <input
              className="auth-input"
              autoComplete="off"
              name="email"
              type="email"
              value={joinInfo.email}
              onChange={handleInputEmail}
            />
          <Message>{emailMessage}</Message>
          </div>
          <div className="auth-input-box">
            <div className="auth-input-title">
              password
            </div>
            <input
              className="auth-input"
              name="password"
              type="password"
              value={joinInfo.password}
              onChange={handleInputPassword}
            />
          <Message>{passwordMessage}</Message>
          </div>
          <div className="auth-input-box">
            <div className="auth-input-title">
              confirm password
            </div>
            <input
              className="auth-input"
              name="confirmPassword"
              type="password"
              value={joinInfo.confirmPassword}
              onChange={handleInputConfirmPassword}
            />
            <Message>{confirmPasswordMessage}</Message>
          </div>
        </AuthJoinForm>
        <Buttons>
          <Link to="/login">
          <CancelButton>CANCEL</CancelButton>
          </Link>
          <JoinButton onClick={handleSubmit}>JOIN</JoinButton>
        </Buttons>
        <div className="auth-message-box">
          <ErrorMessage>{serverErrorMessage}</ErrorMessage>
        </div>
      </AuthJoinBlock>
    </AuthBackground>
  );
};

export default Join;