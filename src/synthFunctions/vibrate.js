export default ({ duration }) => {
  window.navigator.vibrate && window.navigator.vibrate(duration)
}
