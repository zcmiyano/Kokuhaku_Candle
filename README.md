# COMP5411_Kokuhaku_Candle

There are two main files in our project
one is index.html
the other is main.js

main.js contains major work and right now we have mainV2.js

mainV2.js contains such features and structure:


First define some global variables such as scene, renderer, camera, etc.

then run the main() function
and then run render();

what we need to do is to add enough features in main() to make it look fancy
currenly our main looks like this:


function main() {

  //note that there is a logical order to add below things
  //e.g. initScene() always needs to be called first because it initialize a scene object, everything else comes later else will be added on this scene object.
  //the current order is correct
  //be careful if you change the order since it might not work after change.
  
  initScene();
  initCamera();
  initRenderer(container1);
  initLight();
  candleCylinder();
  candlewick();
  candleLight();
  table();
  initControls();
  //initStats();
  initStats(container2);
  window.addEventListener('resize', onWindowResize, false);

}


So...we will add more functions regaring shape of candles, fireflies, music, etc.
and we call them (in a correct order) in our main() function.

☆( ͡° ͜ʖ ͡°) (
