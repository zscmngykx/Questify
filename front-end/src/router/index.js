import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    redirect: '/home',  // 重定向到主页
    children: [
      { path: '403', name: 'NoAuth', meta: { name: 'Unauthorized' }, component: () => import('../views/manager/403') },
      { path: 'home', name: 'Home', meta: { name: 'Dashboard' }, component: () => import('../views/manager/Home') },
      { path: 'admin', name: 'Admin', meta: { name: 'Admin Management' }, component: () => import('../views/manager/Admin') },
      { path: 'adminPerson', name: 'AdminPerson', meta: { name: 'Profile' }, component: () => import('../views/manager/AdminPerson') },
      { path: 'password', name: 'Password', meta: { name: 'Reset Password' }, component: () => import('../views/manager/Password') },
      { path: 'notice', name: 'Notice', meta: { name: 'Announcement Management' }, component: () => import('../views/manager/Notice') },
      { path: 'user', name: 'User', meta: { name: 'User Inforamtion' }, component: () => import('../views/manager/User') },
      { path: 'pages', name: 'Pages', meta: { name: 'Pages Inforamtion' }, component: () => import('../views/manager/Pages') },
      { path: 'question', name: 'Question', meta: { name: 'Question Inforamtion' }, component: () => import('../views/manager/Question') },
      { path: 'questionItem', name: 'QuestionItem', meta: { name: 'Question Content' }, component: () => import('../views/manager/QuestionItem') },
    ]
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/Front.vue'),
    children: [
      { path: 'home', name: 'Home', meta: { name: 'Home' }, component: () => import('../views/front/Home') },
      { path: 'person', name: 'Person', meta: { name: 'Person' }, component: () => import('../views/front/Person') },
    ]
  },
  { path: '/login', name: 'Login', meta: { name: 'Login' }, component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', meta: { name: 'Register' }, component: () => import('../views/Register.vue') },
  { path: '*', name: 'NotFound', meta: { name: 'NotFound' }, component: () => import('../views/404.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注：不需要前台的项目，可以注释掉该路由守卫
// 路由守卫
// router.beforeEach((to ,from, next) => {
//   let user = JSON.parse(localStorage.getItem("xm-user") || '{}');
//   if (to.path === '/') {
//     if (user.role) {
//       if (user.role === 'USER') {
//         next('/front/home')
//       } else {
//         next('/home')
//       }
//     } else {
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })

export default router
