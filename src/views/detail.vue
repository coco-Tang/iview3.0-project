<template>
    <div class="detail">
        <!-- <h3>面包屑导航</h3> -->
            <!-- <Breadcrumb>
              <BreadcrumbItem to="/">首页</BreadcrumbItem>
              <BreadcrumbItem to="/detail">详情页</BreadcrumbItem>
              <BreadcrumbItem to="/detail/edit">音频编辑</BreadcrumbItem>
              <BreadcrumbItem to="/detail/edit1">expand</BreadcrumbItem>
            </Breadcrumb> -->
            <router-link to='/detail/edit'>1</router-link>
            <router-link to='/detail/edit1'>2</router-link>

            <router-view></router-view>
    </div>
</template>
