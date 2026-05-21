import { defineStore } from "pinia";
export const useWorkflowStore = defineStore("workflowStore", {
  state: () => ({
    userId: "",
    promoterDrawer: false,
    promoterConfig: {},
    approverDrawer: false,
    approverConfig: {},
    copyerDrawer: false,
    copyerConfig: {},
    conditionDrawer: false,
    conditionsConfig: {},
    lowCodeFormField: {},
  }),
  actions: {
    setUserId(payload) {
      this.userId = payload;
    },
    setPromoter(payload) {
      this.promoterDrawer = payload;
    },
    setPromoterConfig(payload) {
      this.promoterConfig = payload;
    },
    setApprover(payload) {
      this.approverDrawer = payload;
    },
    setApproverConfig(payload) {
      this.approverConfig = payload;
    },
    setCopyer(payload) {
      this.copyerDrawer = payload;
    },
    setCopyerConfig(payload) {
      this.copyerConfig = payload;
    },
    setCondition(payload) {
      this.conditionDrawer = payload;
    },
    setConditionsConfig(payload) {
      this.conditionsConfig = payload;
    },
    setLowCodeFormField(payload) {
      this.lowCodeFormField = payload;
    },
  },
});
