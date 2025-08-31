export enum PageEnum {
    //登录页面
    LOGIN = '/login',
    BIND_GOOGLE = '/bind-google',
    //无权限页面
    ERROR_403 = '/403',
    // 404
    ERROR_404 = '/:pathMatch(.*)*',
    INDEX = '/'
}
