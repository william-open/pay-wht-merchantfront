<script setup lang="ts">
import { useDark, useWindowSize, useThrottleFn } from "@vueuse/core";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import useAppStore from "./stores/modules/app";
import useSettingStore from "./stores/modules/setting";
import { ScreenEnum } from "./enums/appEnums";
import { usePopupStore } from '@/stores/popup'
import EditGooglePopup from './components/EditGooglePopup.vue'

// const popupStore = usePopupStore()
const googlePopupRef = ref<InstanceType<typeof EditGooglePopup>>()
//
// watchEffect(() => {
//   if (popupStore.showGoogleBindPopup) {
//     googlePopupRef.value?.open()
//   }
// })
import { eventBus } from '@/utils/eventBus'

onMounted(() => {
  eventBus.on('open-google-popup', () => {
    googlePopupRef.value?.open()
  })
})

// watch(
//     () => popupStore.showGoogleBindPopup,
//     (val) => {
//       alert("watch:"+popupStore.showGoogleBindPopup)
//       if (val) {
//
//         googlePopupRef.value?.open()
//       }
//     }
// )

function onBindSuccess() {
  popupStore.closeGoogleBindPopup()
}

const appStore = useAppStore();
const settingStore = useSettingStore();
const elConfig = {
  zIndex: 3000,
  locale: zhCn,
};
const isDark = useDark();
onMounted(async () => {
  //设置主题色
  settingStore.setTheme(isDark.value);
  // 获取配置
  const data: any = await appStore.getConfig();
  // 设置网站logo
  let favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]')!;
  if (favicon) {
    favicon.href = data.webFavicon;
    return;
  }
  favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = data.webFavicon;
  document.head.appendChild(favicon);
});

const { width } = useWindowSize();
watch(
  width,
  useThrottleFn((value) => {
    if (value > ScreenEnum.SM) {
      appStore.setMobile(false);
      appStore.toggleCollapsed(false);
    } else {
      appStore.setMobile(true);
      appStore.toggleCollapsed(true);
    }
    if (value < ScreenEnum.MD) {
      appStore.toggleCollapsed(true);
    }
  }),
  {
    immediate: true,
  }
);
</script>

<template>
  <el-config-provider :locale="elConfig.locale" :z-index="elConfig.zIndex">
    <router-view />
  </el-config-provider>
<!--  <EditGooglePopup v-if="popupStore.showGoogleBindPopup" ref="googlePopupRef" @success="onBindSuccess" />-->
  <EditGooglePopup ref="googlePopupRef" @success="onBindSuccess" />
</template>

<style></style>
