const getCodes = (vm) => {
  const { systemId } = vm.$store.state.settings
  const { menuList } = vm.$store.getters
  const curSystem = menuList.find((item) => item.systemId === systemId)
  if (curSystem) {
    const list = curSystem.childMenuList
    // 全局的路由 code 只有一层，所以不用遍历子路由
    return list
      .filter((item) => item.menuCode.includes('-GLOBAL-'))
      .map((item) => item.menuCode)
  }
  return []
}

const searchCode = (codes, code) => {
  // eslint-disable-next-line no-unused-vars
  const [systemName, realCode] = code.split('-GLOBAL-')
  return codes.find((itemCode) => itemCode.includes(realCode))
}

const RouteCodePermissionFn = function (el, binding, vnode) {
  try {
    const { code, codes = getCodes(vnode.context) } = binding.value
    if (!searchCode(codes, code)) {
      el.parentNode.removeChild(el)
    }
  } catch (e) {
    //
  }
}

export default {
  install(Vue) {
    Vue.directive('grcode', {
      inserted: RouteCodePermissionFn,
      update: RouteCodePermissionFn
    })
    Vue.prototype.grcode = function ({ code, codes }) {
      return searchCode(codes || getCodes(this), code)
    }
    Vue.prototype.getGlobalRouteCodes = getCodes
  }
}
