require('dotenv').config();
const { User } = require('../models');
const jwt = require('jsonwebtoken');

module.exports = {
  // POST auth/sign-up
  signup : async (req, res) => {
    // connecting test
    console.log(req.body);
    
    // input data validation
    const inputEmail = req.body.email;
    const inputNickname = req.body.nickname;
    const inputPassword = req.body.password;

    if ( !inputEmail || !inputNickname || !inputPassword ) {
      res.status(400).send("필수 입력요소가 누락되었습니다");
    } else {
      User.findOrCreate({
        where: { email: inputEmail },
        defaults: {
          nickname: inputNickname,
          password: inputPassword
        }
      })
      .then(( [ data, created ] ) => {
        console.log(data, created);
        if ( !created ) {
          res.status(400).send("입력하신 이메일은 이미 사용 중입니다");
        } else {
          console.log(data);
          res.status(201).send("회원가입에 성공하였습니다")
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("서버에 오류가 발생했습니다")
      })
    }
  },
  // POST auth/log-in
  login : async (req, res) => {
    // connecting test
    // console.log(req.body);

    // input data validation
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    if( !inputEmail || !inputPassword ) {
      res.status(400).send("필수 입력요소가 누락되었습니다");
    } else {
      User.findOne({
        where: {
          email: inputEmail
        }
      })
      .then(data => {
        // console.log(data);
        if( !data ) {
          res.status(404).send("입력하신 이메일 정보와 일치하는 회원정보가 없습니다")
        } else {
          if( data.password !== inputPassword ) {
            res.status(404).send("비밀번호가 일치하지 않습니다")
          } else {
            // console.log("DATA : ", data);
            const { email } = data.dataValues;
            const accessToken = jwt.sign(
              { email },
              process.env.ACCESS_SECRET,
              { expiresIn: "1d" }
            );
            const refreshToken = jwt.sign(
              { email },
              process.env.REFRESH_SECRET,
              { expiresIn: "30d" }
            )
            // token check
            console.log(accessToken);
            console.log(refreshToken);
            // console.log(req.headers)
            // response
            res.cookie("refreshToken", refreshToken, {httpOnly: true, expiresIn: "30d"})
            res.json({ accessToken, refreshToken })
          }
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("서버에 오류가 발생했습니다")
      })
    }
  },
  // POST auth/log-out
  logout : async (req, res) => {
    const authorization = req.headers.authorization;
    // console.log(authorization);
    const refreshToken = req.cookies.refreshToken
    // console.log(req.headers)

    //헤더에서 authorization이 안사라진다
  //  res.send('로그아웃')
  if(!authorization) {
    res.status(400).send("권한 인증에 실패했습니다(토큰없음)")
  } else {
    try {
      res.status(200).cookie("refreshToken", "").send('로그아웃 되었습니다')
    } catch {
      return res.status(500).send('서버오류')
    }
  }
  
  },
  // DELETE auth/sign-out
  signout : async (req, res) => {
    console.log(req.headers)
    res.send('회원탈퇴 완료');
  },
  // GET auth/mypage
  getMypage : async (req, res) => {
    res.send('Get auth/mypage');
  },
  // GET auth/mypage/posts
  getMyposts : async (req, res) => {
    res.send('Get auth/mypage/posts');
  },
  // PATCH auth/mypage
  patchMypage : async (req, res) => {
    
    // 1. 권한 확인
    const authorization = req.headers.authorization;
    console.log(authorization);

    if ( !authorization ) {
      res.status(401).send("권한인증에 실패했습니다(엑세스 토큰 부재)")
    } else {
      const accessToken = authorization.split(' ')[1];
      console.log(accessToken);

      let accessData;
      try {
        accessData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      } catch {
        // 엑세스 토큰이 유효하지 않을 때
        const refreshToken = req.cookies.refreshToken;
        if ( refreshToken ) {
          // 리프레쉬 토큰이 req.cookies에 담겨 있다면,
          try {
            // 리프레쉬 토큰을 통한 엑세스 데이터 임시추출
            accessData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
          } catch {
            // 리프레쉬 토큰 마저 유효하지 않을 때(30일 경과 또는 토큰 훼손)
            return res.status(401).send("권한인증에 실패했습니다(토큰 유효하지 않음)")
          }
        } else {
          // 리프레쉬 토큰이 없다면 바로 에러메시지 전송
          return res.status(401).send("권한인증에 실패했습니다(토큰 유효하지 않음)")
        }
      }

      // 2. 입력 데이터 DB 반영
      const inputNickname = req.body.nickname;
      const inputProfileImage = req.body.profile_image;
      const { email } = accessData;
      console.log(accessData);

      User.update({
        nickname: inputNickname,
        profile_image: inputProfileImage
      }, {
        where: {
          email
        }
      })
      .then(result => {
        console.log(result);
        res.status(201).send("회원정보가 수정되었습니다")
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("서버에 오류가 발생했습니다")
      })
    }
  },
  // PATCH auth/password
  patchPassword : async (req, res) => {
    res.send('Patch auth/password');
  }

}