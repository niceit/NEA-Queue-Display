import Vue from 'vue'
import Router from 'vue-router'
import StallPage from '@/components/Stall/StallPage.vue'

Vue.use(Router)
const routes = [
    {
        path: '/',
        component: StallPage,
        meta: {
            requiresAuth: true,
            showHeader: false
        }
    }
]

const router = new Router({
    routes,
    base: '/',
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})

export default router
