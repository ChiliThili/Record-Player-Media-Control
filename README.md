# Record-Player-media-control
This Project uses express/nodejs to create an record player in your browser that can control your media if you want to host it there are a couple of steps.

# Installation

Make sure you have Nodejs and npm setup and in the project you run:<br>
 `npm install`<br>
And for running use:<br>
 `npm run start`<br>
If you use dont use firefox you need to run:<br>
  `playerctl metadata mpris:artUrl`<br>
And the output (only the folder not the file) you change in the 14th line:<br>
  `const sourceDir = path.join('(your output)');`
