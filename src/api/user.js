import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户的基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

// 修改个人信息
export const userUpdateInfoService = ({ nickname, id, email }) =>
  request.put('/my/userinfo', { nickname, id, email })

// 修改用户头像
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 重置密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
