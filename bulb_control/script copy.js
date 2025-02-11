// script.js

function turnOn() {
    document.getElementById('bulb').classList.add('on');
    document.getElementById('bulb').classList.remove('off');
}

function turnOff() {
    document.getElementById('bulb').classList.remove('on');
    document.getElementById('bulb').classList.add('off');
}
