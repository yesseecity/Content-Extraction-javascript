function removeIframe(e) {
  console.log('removeIframe');
  chrome.tabs.executeScript(
    null,
    {
      file: "content_script.js"
    },
    function(obj) {
      console.log('callback function')
      console.log(obj)
    }
  )

}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('rmIframe').addEventListener('click', removeIframe);
});