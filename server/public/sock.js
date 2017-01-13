console.log('lelelasl')
var socket = io.connect('http://localhost:3000')
socket.on('news', function (data) {
  console.log(data)
  socket.emit('my other event', { my: 'data' })
  var node = document.createElement('p')
  node.innerHTML = data.message
  document.getElementById('log').appendChild(node)
});
