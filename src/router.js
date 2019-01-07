const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/detail/',
        meta: {
            title: '详情页'
        },
        component: (resolve) => require(['./views/detail.vue'], resolve),
        children: [
            {
                path: 'edit',
                component: (resolve) => require(['./views/edit.vue'], resolve)
            },
            {
                path: 'edit1',
                component: (resolve) => require(['./views/edit.1.vue'], resolve)
            }
        ]
    },
    // {
    //     path: '/edit/detail',
    //     component: (resolve) => require(['./views/edit.vue'], resolve)
    // },
    {
        path: '/breadcrumb',
        component: (resolve) => require(['./components/breadcrumb/index.vue'], resolve),
        children: [
            
            {
                path: 'two',
                component: (resolve) => require(['./components/breadcrumb/submenuTwo.vue'], resolve) 
            }
        ]
    },
    {
        path: '/one',
        component: (resolve) => require(['./components/breadcrumb/submenuOne.vue'], resolve) 
    },
];
export default routers;