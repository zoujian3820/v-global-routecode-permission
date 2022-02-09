const getCodes = (vm) => {
  const { systemId } = vm.$store.state.settings
  const { menuList } = vm.$store.getters
  const curSystem = menuList.find((item) => item.systemId === systemId)
  if (curSystem) {
    const list = curSystem.childMenuList
    // 全局的路由 code 只有一层，所以不用遍历子路由
    const codes = list.filter((item) => item.menuCode.includes('-GLOBAL-')).map((item) => item.menuCode)
    return codes
  }
  return []
}

const RouteCodePermission = {
  inserted(el, binding, vnode) {
    if (binding.arg) {
      el.parentNode.removeChild(el)
    } else {
      const { code, codes = getCodes(vnode.context) } = binding.value
      if (codes.indexOf(code) === -1) {
        el.parentNode.removeChild(el)
      }
    }
  }
}

export default {
  install(Vue) {
    Vue.directive('grcode', RouteCodePermission)
    Vue.prototype.grcode = function ({ code, codes }) {
      return (codes || getCodes(this)).indexOf(code) !== -1
    }
    Vue.prototype.getGlobalRouteCodes = getCodes
  }
}