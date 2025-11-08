//菜单主题类型
export enum ThemeEnum {
    LIGHT = 'light',
    DARK = 'dark'
}

// 菜单类型
export enum MenuEnum {
    CATALOGUE = 'M',
    MENU = 'C',
    BUTTON = 'A'
}

export enum AccountFinanceType {
    RECEIVE = 1,
    PAYOUT = 2,
    BACK_RECHARGE  =3,
    BACK_WITHDRAW =4,
    BACK_ADD_BALANCE =5,
    BACK_SUB_BALANCE =6,
    BACK_FREEZE =7,
    BACK_UNFREEZE =8,
    API_PAY_AWARD =11,
    API_PAYOUT_AWARD =21,
    API_FREEZE =60,
    API_UNFREEZE =61,
    API_DELETE_FREEZE =62,

}

export enum AuditStatus {
    PENDING = 1,
    SUCCESS = 2,
    REFUND = 3,
}

// 屏幕
export enum ScreenEnum {
    SM = 640,
    MD = 768,
    LG = 1024,
    XL = 1280,
    '2XL' = 1536
}

// 客户端类型
export enum ClientEnum {
    MP_WEIXIN = 1, // 微信-小程序
    OA_WEIXIN = 2, // 微信-公众号
    H5 = 3, // H5
    PC = 4, // PC
    IOS = 5, //苹果
    ANDROID = 6 //安卓
}

export const ClientMap = {
    [ClientEnum.MP_WEIXIN]: '微信小程序',
    [ClientEnum.OA_WEIXIN]: '微信公众号',
    [ClientEnum.H5]: '手机H5',
    [ClientEnum.PC]: '电脑PC',
    [ClientEnum.IOS]: '苹果APP',
    [ClientEnum.ANDROID]: '安卓APP'
}
