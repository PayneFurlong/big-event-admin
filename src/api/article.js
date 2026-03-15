import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

// 新增文章分类
export const artAddChannelService = (data) => request.post('my/cate/add', data)

// 编辑文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

// 删除文章分类
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 获取文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 添加文章
// 注意：data 需要是一个 formData 格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)

// 获取文章详情
export const artGetDetailService = (id) =>
  request.get('my/article/info', {
    params: {
      id
    }
  })

// post 请求直接写入参数，而 get delete 的参数需要写入 params 对象

// 编辑提交文章
export const artEditService = (data) => request.put('/my/article/info', data)

// 删除文章
export const artDeleteService = (id) =>
  request.delete('/my/article/info', {
    params: {
      id
    }
  })
