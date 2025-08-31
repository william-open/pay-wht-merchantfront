// stores/popup.ts
import { defineStore } from 'pinia'

export const usePopupStore = defineStore('popup', {
    state: () => ({
        showGoogleBindPopup: false
    }),
    actions: {
        openGoogleBindPopup() {

            this.showGoogleBindPopup = true
            alert(this.showGoogleBindPopup)
        },
        closeGoogleBindPopup() {
            this.showGoogleBindPopup = false
        }
    }
})
