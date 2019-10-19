function required () {
  var empt = document.getElementById('initform').value
  if (empt === '') {
    alert('Please input a Value')
    return false
  }
}
