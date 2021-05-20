import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from '../App.vue'
import Projects from '../pages/Projects.vue'
import Login from '../pages/Login.vue'
import Project from '../pages/ProjectInfo.vue'
import Roles from '../pages/Roles.vue'
import Settings from '../pages/Settings.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'App',
  //   component: App
  // },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/project',
    name: 'Project',
    component: Project
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles
  },
  {
    path: '/project/:id',
    component: Project,
    props: true,
  },
  {
    path: '/settings',
    component: Settings,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
