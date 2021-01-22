import Matter from 'matter-js';
import canvas from './main';

let windowWidth = document.documentElement.clientWidth,
    windowHeight = document.documentElement.clientHeight;

canvas(Matter, windowWidth, windowHeight);

// == Resize handler ==
window.addEventListener('resize', (e) => {
    windowWidth = document.documentElement.clientWidth;
    windowHeight = document.documentElement.clientHeight;
    
    // == Canvas reload optimization ==
    if (e.timeStamp % 2 == 0) {
        document.querySelector('canvas').remove()

        canvas(Matter, windowWidth, windowHeight);
    }
  }, true);


  


