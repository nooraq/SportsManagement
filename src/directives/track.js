/**
 * 打点统计
 */
export default {
  bind(el) {
    el.handler = () => {};
    el.addEventListener('click', el.handler);

    // touch for mobile
    // el.addEventListener('touch', el.handler)
  },
  unbind(el) {
    el.removeEventListener('click', el.handler);
    delete el.handler;
    // el.removeEventListener('touch', el.handler)
  }
};
