---
layout: single
title: "Processing JS in Khan Academy"
nav_exclude: true
---

[![Khan Academy](https://img.shields.io/badge/Khan_Academy-Profile-blue)](https://www.khanacademy.org/profile/kaid_952911577858513019620187/projects) [![Ghost Blogpost](https://img.shields.io/badge/Ghost_Blog-Post-black)](https://sifter.ghost.io/processingjs/) 

Khan Academy offers a free platform for burgeoning programmers to create and share visual projects using [ProcessingJS](https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/advanced-development-tools/a/using-processingjs-outside-khan-academy). At least one of my programs is [featured](https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-buttons/a/what-are-buttons) on the official Khan Academy curriculum! (Look for 3D Roller Coaster.)

## Background

Processing.js/ProcessingJS is a JavaScript library developed in 2008 meant to make the Processing programming language accessible to the web by transpiling any code in Processing.js to JavaScript. Processing is a free, open-source software built on top of Java and first developed in 2001 that allows developers to create interactive visualizations and animations using a simplified syntax and drawing API. The visual outputs are easy to generate and quite reactive, serving very well to gain practice in design, gaming, and art. 

Despite Processing.js being a very simple way to write Processing for the web, this library is actually no longer actively maintained nor recommended; it has been superseded by the p5.js library which came out in 2013. Both are interpretations of Processing to the web, but p5.js has departed from trying to mimic original Processing syntax in order to better match JavaScript syntax. I chose to write only about Processing.js in this blog post in order to highlight the library through which I and many other young programmers originally learned to code. Many of the principles encountered whilst programming in Processing.js are perfectly translatable to the p5.js library up to some syntax modifications. It's for this reason that I wrote the remainder of this post with beginner/intermediate programmers in mind; but I think even advanced programmers can get something out of this, if not just inspiration. 

For clarity, we are not discussing Processing 3+, the version of Processing released as early as 2015 meant to respond to browsers having removed the ability to run applets and which introduced new features like surface and settings(). Processing.js doesn't support anything new to Processing 3. 

If one were to compare Processing.js to other similar options in its time, several key properties would have stood out: 

Natively offers an HTML5 canvas element on which a user can draw pixel-based graphics (alternatively, one may use Scalable Vector Graphics (SVGs) for rendering). 
Easy cross-platform & cross-browser capabilities as based on JavaScript.
Offers a simplified syntax and intuitive API. 

Non-optimized performance, so not the best suited option for data visualization nor game development. 

Limited 3D support (as compared to, say, Three.js), as primarily focuses on 2D graphics. 

## Khan Academy

KhanAcademy.org offers an environment to write in a language based on the Processing.js library with ah HTML5 canvas immediately visible to the side of the editor in order to visualize what is being drawn. Changes are instantaneous between the editor and the canvas, so developing through this site is a pleasant experience. Typically Processing.js is embedded within an HTML file as follows:

<!DOCTYPE html>
<html>
	<head>
		<title>Example Processing.js Embedding</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.min.js"></script>
	</head>
	<body>
		<script type="application/processing">
			void setup(){
				size(200, 200);
			}
			void draw(){
				background(64);
				ellipse(mouseX, mouseY, 20, 20);
			}
		</script>
		<canvas id="sketch"></canvas>
	</body>
</html>

The resulting render would contain a canvas element which is interactive. 
<!DOCTYPE html>
<html>
	<head>
		<title>Example Processing.js Embedding</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.min.js"></script>
	</head>
	<body>
		<script type="application/processing">
			void setup(){
				size(200, 200);
			}
			void draw(){
				background(64);
				ellipse(mouseX, mouseY, 20, 20);
			}
		</script>
		<canvas id="sketch"> </canvas>
	</body>
</html>


The key to the interactivity here is the use of `mouseX` and `mouseY`, which are quite easy ways to access the current coordinates of the user's mouse on the canvas. 

In contrast, Khan Academy removes much of the overhead to begin writing in Processing.js. There is no setup required to make the canvas, only instructions for what to draw. Moreover, KA follows a slightly different formatting rule: there is no need nor way to specify output type for a function, so `void draw() { ... }`. Instead, we must use the alternative function constructor `draw = function() { }`.

![Basic Setup](/my_assets/images/basic_processing_js.png)

Unfortunately, the platform does not offer a great deal of wiggle-room to withstand heavy computations, so it limits just how demanding of methods may be run. Some other small differences include:
- KA assuming angles to be expressed in degrees, not radians,
- KA offering a custom image/sticker library accessed via the `image` and `getImage` commands,
- KA offering a Gaussian random generator through the `Random` class,
- The keyword `mousePressed` in Processing.js is written `mouseIsPressed` on KA,
- Transformations like `translate` and `rotate` can appear anywhere in a KA script; but Processing.js usually acts on them only in a `draw` loop,
- KA offers a `Program` object which contains some of the metadata/methods that can refer to the whole program, such as with its method `Program.reset` to simply start the program from zero; it's not native to Processing.js. 

KhanAcademy's Processing.js environment is the platform through which I initially learned to code, and I've created dozens of programs since. I will proceed in this blog post by highlighting some of these programs and identifying elements of Processing.js that made these programs possible. 

## My First Program: Draw Loop
The following script and accompanying output represent my first program on Khan Academy (and ever!). The code attempts to illustrate an oscillating car. 

```javascript
var x = 200;
var speed = 5;
var draw = function() {
    noStroke();
    background (252, 255, 214);
    fill (0, 0, 0);
    rect (350, 160, 50, 100);
    fill (0, 0, 0);
    rect (50, 160, 50, 100);
    fill (255, 0, 0);
    rect (x, 200, 100, 20);
    rect(x + 15, 178, 70, 40);
    fill (77, 66, 66);
    ellipse (x+25, 221, 24, 24);
    ellipse (x+75, 221, 24, 24);
    x = x + speed;
    if (x> 250) {
        speed = -5;
    }
    if (x < 100) {
        speed = 5;
    }
};
```

My first Processing.js program through Khan Academy

<!DOCTYPE html>
<html>
	<head>
		<title>Example Processing.js Embedding</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.min.js"></script>
	</head>
	<body>
        <script type="application/processing">
			void setup(){
				size(400, 400);
			}
            var x = 200;
            var speed = 5;
			void draw(){
				noStroke();
                background (252, 255, 214);
                fill (0, 0, 0);
                rect (350, 160, 50, 100);
                fill (0, 0, 0);
                rect (50, 160, 50, 100);
                fill (255, 0, 0);
				rect (x, 200, 100, 20);
                rect(x + 15, 178, 70, 40);
                fill (77, 66, 66);
                ellipse (x+25, 221, 24, 24);
                ellipse (x+75, 221, 24, 24);
                x = x + speed;
                if (x> 250) {
                    speed = -5;
                }
                if (x < 100) {
                    speed = 5;
        		}
			}
		</script>
        <canvas id="sketch2"></canvas>
        <p>My first every program!</p>
	</body>
</html>

Leaving behind how poorly written the code may be deemed, the code exemplifies a straightforward use of the `draw` method offered by Processing.js: we simply state which colors to be used for fills or outlines (a.k.a. strokes), which geometric objects to be displayed, and however certain variables should change over time. In particular, the `draw` method is special as it is repeatedly called by the page according to a fixed frame rate, constantly redrawing its contents. Drawing is also possible outside of the `draw` loop, but if your canvas should update over time, most drawing commands will belong in the `draw` loop. 

For the the remainder of the page, I'll present most of my programs in GIF form, because running all of the corresponding canvases would break all of our browsers! 

## Games

### Curve Ball: Perspective and Computer Opponent

Now I present my remake of a classic online game called Curve Ball. I call it [Curve Ball 2.0](https://www.khanacademy.org/computer-programming/curve-ball-20-red-paddle-can-lose-now/4800314033569792). The originaly version allows a user to compete against a computer player in a game of 3D pong. The catch is that either player may apply spin to the ball  in a similar fashion to ping-pong. My version allows for any number of balls to be served, calculating the physics of each separately. 

![Visual gameplay of Curve Ball 2.0](/my_assets/gifs/curve-ball.gif)

One custom method featured in this game is to resize objects based on their relative distance from the camera, an effect called perspective or foreshortening. The following method takes applies a perspective change according to the object's depth in the scene.

```javascript
// hyperparameter to determine the strength of perspective
var persp = 200;
// apply perspective to something of size `size`
var perspective_calc = function(size, depth){ 
    return (size * persp) / (depth + persp);
}; 
```

Moreover, the spin is accomplished by keeping track of paddle speeds and setting the ball's lateral acceleration proportional to that speed once rebounded off either player's paddle. The opponent is controlled by having it hunt for the closest ball's current lateral position but having only a fixed speed at which it can traverse its lateral space to chase that ball. 

### Tom the Koala's Surfing Adventure: Math and Character Design
The next game I'd like to present is [Tom the Koala's Surfing Adventure](https://www.khanacademy.org/computer-programming/tom-the-koalas-surfing-adventure/5963406608826368). 

![Visual gameplay of Tom the Koala's Surfing Adventure Game](/my_assets/gifs/tom.gif)

The point of this game is for the player to help Tom the Koala to surf past all of the unhealthy items in red and pursue healthy items in green using his limited vertical boost. 

One key feature to this game is having a virtually non-repeating landscape. It was a primary goal of mine to make sure the wave on which Tom surfs to never appear to repeat. Using the OOP nature of Processing.js, I proceeded in two steps: 

First, define a custom `Sin` class which can store the parameters of a sine function like its amplitude, period, and phase, as well as an individual function to evaluate that function at any argument, plus get its derivative at any argument as well. 

```javascript
// Sin class
Sin = function(z) {
    this.amp = z.amp || 1;
    this.per = z.per || width;
    this.phase = z.phase || 0;
    this.angFreq = Math.TAU / this.per;
    this.get = function(arg) {
        return this.amp * Math.sin(this.angFreq * arg - this.phase);
    };
    this.getDeriv = function(arg) {
        return this.amp * this.angFreq * Math.cos(this.angFreq * arg - this.phase);
    };
},
```

You'll notice the use of the logical or `||`, which behaves as follows in Processing.js: 
> `A || B` evaluates to `A` if `A` is not false, and `B` otherwise. 

Effectively, if the argument `z` already has a non-`None` value at `z['amp']`, then `this.amp` will take on the value `z.amp`; otherwise, `this.amp` is set to a default value `1`. 

Second, define a custom `Wave` object which will represent a sum of many `Sin` functions. 

```javascript
// Wave object
Wave = {
    list: [],
    N: 15,
    Amp: {
        start: height / 3,
        stop: height / 2.2,
        next: function() {
            return map(random(), 0, 1, this.start, this.stop);
        },
    },
    Per: {
        avg: width,
        std: width * 67 / 400,
        next: function() {
            return Math.abs(randomGaussian() * this.std + this.avg);
        },
    },
    Phase: {
        start: 0,
        stop: Math.TAU,
        next: function() {
            return map(random(), 0, 1, this.start, this.stop);
        },
    },
    const: function() {
        for(var n = 0; n < this.N; n ++){
            this.list.push(new Sin(
                { amp: this.Amp.next() / this.N, 
                  per: this.Per.next(), 
                  phase: this.Phase.next()
                }));
        }
    },
    get: function(arg) {
        var sum = 0;
        for(var w in this.list) {
            sum += this.list[w].get(arg);
        }   return sum;
    },
    getDeriv: function(arg) {
        var sum = 0;
        for(var w in this.list) {
            sum += this.list[w].getDeriv(arg);   
        }   return sum;
    }
},
```


Mathematically, a `Wave` *will* necessarily be periodic, but that periodicity will be made so large as `N increases, meaning the player will not notice the periodicity. 

I also feel that the system for displaying objects throughout the game is sensible in its approach. Each `draw` iteration will loop through all visible items (the red or green objects) and call their dis`play method. The prototype display method is shown below.

```javascript
// Display an Item instance
Item.prototype.display = function() {
    // set local environment for transformations
    pushMatrix();
    	// center us at position of the object
        translate(this.pos.x, this.pos.y);
        // rotate object to be parallel to gradient of Wave
        rotate(atan(Wave.getDeriv(this.outputX)) / 2);
    	// the display instructions depend on which type of object this is
        switch(this.image.substring(2)){
            // in the case our object is a Shark
            case "Shark":
                fill(Theme.Item.SharkFill);
                stroke(Theme.Item.SharkStroke); 
                strokeWeight(2);
                beginShape();
                    vertex(-20, 20);
                    bezierVertex(-9, -4, -12, -11, 10, -16);
                    bezierVertex(21, -16, 9, -5, 9, 4);
                    bezierVertex(8, -6, 10, 10, 10, 20);
                endShape();
                break;
            case "Buoy":
                //...
                break;
            //...
            default: break;
        }
	popMatrix();
};
```

Despite us having used very specific numbers to draw each component of the items, the transformations like `translate` and `rotate` within the `pushMatrix() ... popMatrix()` block allow us to generalize these commands to any position/orientation at which the item may be. 

### Jogo da Onça: Only do the Hard Work Once
I was in Brazil writing a paper about the Ethnomathematical study of indigenous Brazilian mathematics when I encountered a game called the [Jogo da Onça](https://www.khanacademy.org/computer-programming/jogo-da-ona/6694083696050176?qa_expand_key=ag5zfmtoYW4tYWNhZGVteXJACxIIVXNlckRhdGEiHWthaWRfMzUxNDY1NTMyODE1NzgyNDMzNjIwNjc1DAsSCEZlZWRiYWNrGICAs_adyYQLDA&qa_expand_type=comment): the Game of the Jaguar. Having found no online ways to play this game, I decided to code it up myself. The game works a bit like checkers: 

- There are two teams: the cachorros (dogs) versus the onça (jaguar). 
- The teams alternate in turns. Each player can move to any node to which their player is directly connected. - The dogs may only move one dog per turn. 
- The jaguar may hop over a dog in the same style as checkers in order to capture the dog. 
- The jaguar hopes to capture 5 dogs in order to win. The dogs aim to trap the jaguar by giving it nowhere to move for its next turn. 

Take a look at the GIF to get a sense of the gameplay:

![Jogo da Onça gameplay](/my_assets/gifs/jogo-da-onca.gif)

To implement this game is inherently slightly complicated:

- The jaguar and dogs all have pre-defined initial positions.
- The triangular portion of the board complicates programming the positions of the vertices.
- We have to encode all of the connections between vertices.
- We have to write a method in order to express not just how a player can hop to an adjacent vertex, but also for the jaguar to be able to jump a cachorro. These jumps don't just follow from the connectivity: they must also be across three colinear vertices. 
- We would like to highlight in blue the valid moves able to be taken by a player throughout the game, which requires the same types of routines as expressed earlier.

Most of these tasks require writing by-hand the valid coordinates or combinations of vertices involved. After having fixed an enumeration of the vertices, I resulted to storing all of the tedious connections in a few lists:

```javascript
var GRID = {
    positions: [],
    cachorro_indices: [0, 1, 2, 5, 6, 7, 10, 11, 15, 16, 17, 20, 21, 22],
    jaguar_index: 12,
    connections: [[1, 5, 6], [0, 2, 6], [1, 3, 6, 7, 8], [2, 4, 8], [3, 8, 9], [0, 6, 10], [0, 1, 2, 5, 7, 10, 11, 12], [2, 6, 8, 12], [2, 3, 4, 7, 9, 12, 13, 14], [4, 8, 14], [5, 6, 11, 15, 16], [6, 10, 12, 16], [6, 7, 8, 11, 13, 16, 17, 18], [8, 12, 14, 18], [8, 9, 13, 18, 19, 25, 26, 27], [10, 16, 20], [10, 11, 12, 15, 17, 20, 21, 22], [12, 16, 18, 22], [12, 13, 14, 17, 19, 22, 23, 24], [14, 18, 24], [15, 16, 21], [16, 20, 22], [16, 17, 18, 21, 23], [18, 22, 24], [18, 19, 23], [14, 26, 28], [14, 25, 27, 29], [14, 26, 30], [25, 29], [28, 30], [27, 29]],
    jumping: [[0, 10], [5, 15], [10, 20], [1, 11], [6, 16], [11, 21], [2, 12], [7, 17], [12, 22], [3, 13], [8, 18], [13, 23], [4, 14], [9, 19], [14, 24], [0, 2], [1, 3], [2, 4], [5, 7], [6, 8], [7, 9], [10, 12], [11, 13], [12, 14], [15, 17], [16, 18], [17, 19], [20, 22], [21, 23], [22, 24], [0, 12], [6, 18], [12, 24], [4, 12], [8, 16], [12, 20], [2, 10], [10, 22], [28, 14], [25, 18], [14, 22], [2, 14], [8, 27], [14, 30], [25, 27], [28, 30], [13, 26], [14, 29]],
    jumped: [5, 10, 15, 6, 11, 16, 7, 12, 17, 8, 13, 18, 9, 14, 19, 1, 2, 3, 6, 7, 8, 11, 12, 13, 16, 17, 18, 21, 22, 23, 6, 12, 18, 8, 12, 16, 6, 16, 25, 14, 18, 8, 14, 27, 26, 29, 14, 26]
};
```

Notice how the `connections` list is filled with tuples of various lengths: the information stored here asks: "what are the indices of the vertices to which this vertex is connected?" For example, vertex 0 is connected to vertices 1, 5, and 6. The edge relation is reflexive, but I opted to write all of the connections for each vertex for simplicity in the code. The `jumping` list contains tuples of vertices from which it would be valid to jump from one to the next over a dog as the jaguar. The `jumped` list contains the corresponding "jumped" vertex. All of these pieces of information were necessary and sufficient to run the full dynamics of the game. Moreover, having these hand-written, I was able to write the rest of the code without any reference to specific indices or positions: the logic of the game could simply be my focus throughout the remainder of the program. For instance, the following method checks if a dog with index `index_in_cachorros` is allowed to move to an intended position `intended_index`:

```javascript
// Check if dog at position index_in_cachorros may move to position at intended_index in the GRID.cachorro_indices list
var check_cachorro_valid_move = function(index_in_cachorros, intended_index) {
    var current_index = GRID.cachorro_indices[index_in_cachorros];
    if( // not another dog already occupying this space
        GRID.cachorro_indices.indexOf(intended_index) === -1 
        // this vertex is connected to the dog's current position
        && GRID.connections[current_index].indexOf(intended_index) !== -1 
		// the jaguar is not blocking this space
       	&& intended_index !== GRID.jaguar_index 
      ) {
        // return that the move is valid
        return { final: intended_index };
    }
    // return that the move is invalid
    return undefined;
};
```


## Animations

### Adjustable Roller Coaster: 3D Graphics in Processing?!

One of my major successes during my heyday on Khan Academy was when I published my [Adjustable Roller Coaster](https://www.khanacademy.org/computer-programming/adjustable-3d-roller-coaster-track/5851102203346944). It was probably the first 3D program to obtain many upvotes on the community page, accruing 2000+ votes and hundreds of "spin-offs." It's even [featured](https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-buttons/a/what-are-buttons) in the Khan Academy curriculum for its use of custom-made buttons! 

![My first 3D roller coaster](/my_assets/gifs/original-roller-coaster.gif)

I learned the basics behind 3D graphics and transformations through Peter Collingridge's great tutorial on [3D Graphics with Processing.js](https://www.petercollingridge.co.uk/tutorials/3d/processing/https://www.petercollingridge.co.uk/tutorials/). The original methods for rotation may not be available through his page any longer, but here I provide a sample of one of my methods inspired by his: 

```javascript
// Rotate a list `track` of vectors about the x-axis by an angle `theta`
// 	where each vector is of the form [x, y, z]
var rotateX3D = function(theta) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    var node, y, z;
    for (var n = 0; n < track.length; n ++) {
        node = track[n];
        y = node[1]; 
        z = node[2]; 
        track[n][1] = y * cos_t - z * sin_t; 
        track[n][2] = z * cos_t + y * sin_t;
    }
};
```

### Light Vectors and Solid 3D Faces: True 3D Graphics

While producing a few 3D programs, I usually resorted to translucent faces because I hadn't figured out how to handle drawing based on depth. While producing the following 3D environment called [Light Vectors and Solid 3D Faces](https://www.khanacademy.org/computer-programming/light-vectors-and-solid-3d-faces/6331893204254720), I actually got around this problem by only using convex shapes: no need to sort faces by depth, all we needed to do was determine which ones were facing forward. This program demonstrates 4 basic (convex) shapes that I was able to fully flesh out into subclasses of a generic `Object3D` class. 

![Animation of all four classes of objects offered with a lightsource off to the right](/my_assets/gifs/rotating-shapes.gif)

This program features inheritance: each type of object like `Cuboid`, `Sphere`, `Pillow`, and `Tetrahedron` inherit from the more general `Object3D` class specified below:

```javascript
// Constructor
var Object3D = function(z) {
    // location
    this.position = z.position || new PVector();
    // size
    this.dimensions = z.dimensions || PVector.construct(function() { return width / 3; });
	
    this.points = []; this.edges = []; this.faces = [];
    
    // Presets
    this.rotate = z.q("rotate", true);
    this.paused = z.q("paused", false);
    this.faceColor = z.faceColor || color(255);
    this.edgeColor = z.edgeColor || color(100);
    this.pointColor = z.pointColor || color(255, 128, 0);
    this.displayPoints = z.q("displayPoints", true);
    this.displayEdges = z.q("displayEdges", true);
    this.displayFaces = z.q("displayFaces", true);
    this.flip = false;
    
    this.alpha = new PVector(); // angular acceleration
    this.omega = new PVector(); // angular velocity
    this.theta = new PVector(); // angular position
    
    this.rotateX = function(theta, center) {
        //...
    };
    this.rotateY = function(theta, center) {
        //...
    };
    this.rotateZ = function(theta, center) {
        //...
    };
};

// default hyperparameter to how perspective changes with depth
Object3D.perspectiveStandard = width;
// method to change size with depth
Object3D.perspectiveCoefficient = function(depth) {
    return (addPerspective)? this.perspectiveStandard / (Math.max(depth, 1 - this.perspectiveStandard) + this.perspectiveStandard) : 1;
};
// scale location by perspective coefficient
Object3D.getLocation = function(P) {
    return PVector.mult(P, this.perspectiveCoefficient(P.z));
};
// computes normal vector to a face P
Object3D.prototype.getNormalVectorToFace = function(P) {
    var vector = PVector.cross(PVector.sub(P[0], P[1]), PVector.sub(P[2], P[1]));
    if(P.length > 3 && vector.mag() === 0){
        vector = PVector.cross(PVector.sub(P[1], P[2]), PVector.sub(P[3], P[2]));
    }
    vector.capMag(1);
    return vector;
};
// update an object by setting random acceleration
Object3D.prototype.update = function(center) {
    if(this.rotate && !this.paused) {
        this.alpha = PVector.construct(function(){ return Math.random_0(); }); 
        // update angular motion
        this.alpha.capMag(0.1);
        this.omega.add(this.alpha);
        this.theta.add(this.omega); this.theta.capMag(1);
        // update angular position of all points in the object
        this.rotateX(this.theta.x, center); 
        this.rotateY(this.theta.y, center); 
        this.rotateZ(this.theta.z, center);
    }
};
// return color of a face P depending on angle to lightsource
Object3D.prototype.color = function(P) {
    // compute shadow constant
    var c = (PVector.dot(globalLightVector, this.getNormalVectorToFace(P)) / globalLightVector.mag() / this.getNormalVectorToFace(P).mag() + 1) / 2;
    // return corresponding shaded face color
    return lerpColor(color(0, 0, 0), this.faceColor, (this.flip ? 1 - c : c));
};
// display the object
Object3D.prototype.display = function() {
    var P = new Array(this.faces[0].length);
    // display points
    //...
    // display edges
    // ...
    // display faces 
    // ...
};
```


Inheritance looks like this in the case of the subclass `Cuboid`:

```javascript
// Inheriting class constructor
var Cuboid = function(z) {
    // pass to the Object3D constructor
    Object3D.call(this, z);
    // Class specific instructions 
    //...
};
// any Cuboid instance should act like an instance of Object3D
Cuboid.prototype = Object.create(Object3D.prototype);
```

Finally, instantiation of a `Cuboid` woud look like this:

```javascript
var redCube = new Cuboid({ 
    position: new PVector(- width / 4, - height / 5, 0), 
    dimensions: PVector.construct(function() { return width / 5; }), 
    faceColor: color(255, 0, 0), 
    displayPoints: false, 
    displayEdges: false
});
```

The display of each object works in a straightforward way: 

```javascript
// display a 3D object
Object3D.prototype.display = function() {
	//...
    // display a face
    var face = this.faces[0];
    // adjust vertices of face to perspective 
    var P = []; 
    for(var i = 0; i < face.length; i ++){
        P[i] = Object3D.getLocation(this.points[face[i]]);
    }
    // only draw if facing forward
    if(PVector.dot(globalForwardVector, this.getNormalVectorToFace(P)) >= 0) { 
        fill(this.color(P)); 
        beginShape();
        for(var i = 0; i < face.length; i ++) {
            vertex(P[i].x, P[i].y);
        }
        endShape(CLOSE);
    }
    //...
};
```


This algorithm wouldn't work if our objects weren't convex! Moreover, this program won't do well trying to display multiple objects in the same line-of-sight. 

### Depth Sorter
Another attempt I made to display 3D objects, [Depth Sorter](https://www.khanacademy.org/computer-programming/depth-sorter-oop-3d/4860425851633664). The general approach was to store all items in a global object called `Frame` and to have the ability to sort all objects. 

![Visual representation of Depth Sorter program](/my_assets/gifs/oop.gif)

The problem is that the code is quite inefficient and naïve: it assumes that sorting by depth can be done by calculating the average depth of all the vertices in an object and sorting by those average depths. I don't want to harp on this program too much, but I would like to highlight a few methods:

I made use of a more general set of rotation functions like so:

```javascript
// Rotate a provided coordinate by an angle theta about a center 
var rotateX3D = function(config){
    var coordinate = config.coordinate || origin;
    var theta = config.theta || 0;
    var center = config.center || origin;
    var sint = sin(theta);
    var cost = cos(theta);
    var y = coordinate.y;
    var z = coordinate.z;
    coordinate.y = (y - center.y) * cost - (z - center.z) * sint + center.y; 
    coordinate.z = (z - center.z) * cost + (y - center.y) * sint + center.z; 
    return coordinate; 
};
```

Unfortunately, this way of performing rotations is much less efficient because `sin` and `cos` are evaluated at `theta` for each point in the scene rather than all at once. It would have been better to run these on an object-basis rather than vertex-basis. 

We also have an example in this program of interacting with keys:

```javascript
// Whenever a key is pressed with code keyCode
var keyPressed = function(){
    if(!keys[keyCode]){
        sign = (R.angle.x >= 90 && R.angle.x < 270)? 1: -1;
    }
    keys[keyCode] = true;
};
// Whenever a key is released with code keyCode
var keyReleased = function(){
    keys[keyCode] = false;
};
// What to do if keys is true for the arrow buttons
var checkkeys = function(){
    //Movement if statements
    if(keys[UP]){ R.angle.y += sign * 5; }
    if(keys[DOWN]){ R.angle.y -= sign * 5; }
    if(keys[RIGHT]){ R.angle.x += 5; }
    if(keys[LEFT]){ R.angle.x -= 5; }
};
```

For Proccesing.js, this is a generally good approach: store the keys that are currently pressed or free, and make actions based on these booleans. This especially works when the event of pressing isn't what matters, but the fact that the key is currently pressed is what matters. 

### Roller Coaster 2.0: Mathematically-Sound Coaster

I created [Roller Coaster 2.0](https://www.khanacademy.org/computer-programming/adjustable-roller-coaster-but-better/5699963521875968) to be a more useful 3D graphics engine and to beat my previous Adjustable Roller Coaster program shown above. The mathematics and logic behind this program are a bit more advanced than those previous.

![Visual representation of the Roller Coaster 2.0](/my_assets/gifs/roller-coaster-2.gif)

My general idea was simple:
- Building a roller coaster track should not be about defining every face and vertex explicitly. Instead, our three degrees of freedom are *path*, *tilt*, and *size*. 
- A good roller coaster is a loop: so let us assume that the path of the coaster is described by a continuous function $f: [0, 1] \to \mathbb{R}^3$ which satisfies $f(0) = f(1)$. 
- A good roller coaster not only loops but returns in the same orientation in which it started. So let us assume that the angular tilt of the track is a continuous functio $\alpha: [0,1] \to \mathbb{R}$ such that $\alpha(1) - \alpha(0) \equiv 0 \pmod{2 \pi}$.
- Finally, we may have that a piece of the track has a certain width which also behaves in a periodic way. So let's assume the size of the track is a continuous function $R: [0,1] \to \mathbb{R}_{ > 0}$ such that $R(0) = R(1)$. 

With these three mathematical ingredients, it is easy to automatically generate a discretized version of the roller coaster track that they determine: simply define a class `TrackElement` to calculate the face of the track at a certain value of `t`:

```javascript
// Faces drawn are based on TrackElement objects that are calculated using f, Alpha, and R
var TrackElement = function(config) {
    this.t = config.t || 0;
    this.pos = config.pos || new PVector(0, 0, 0);
    this.a = config.a || 0;
    this.R = config.R || 1;
};
// Returns a TrackElement with all of the built parts at time t given previous special vector old_w
TrackElement.get = function(t, old_w) {
    var e = new TrackElement({
        t: t, pos: f(t), a: Alpha(t), R: R(t)
    });
    e.build(old_w);
    return e;
};
// Given previous orientation vector old_w, calculates all of the necessary vector attributes
TrackElement.prototype.build = function(old_w) {
    // direction of motion
    this.d = PVector.normalize(PVector.sub(f(this.t), f(this.t - 0.001)));
    // mapping old orientation onto direction
    this.w = PVector.normalize(PVector.proj(old_w, this.d));
    // perpendicular to d and w
    this.pi = PVector.normalize(PVector.cross(this.d, this.w));
    var v = PVector.mult(PVector.add(PVector.mult(this.w, Math.cos(this.a)), PVector.mult(this.pi, Math.sin(this.a))), this.R);
    // "outside" of the track
    this.varphi = PVector.add(this.pos, v);
    // "inside" of the track
    this.phi = PVector.sub(this.pos, v);
    // how a person would be oriented riding
    this.perp = PVector.normalize(PVector.cross(this.d, v));
};
```

To display the scene, simply fill an array `faces` with `Face` objects created for each `TrackElement` as well as any other objects like for the cart and person riding the coaster, and sort the objects by depth. 

## Processing.js Components
After creating a few programs which benefiting by offering user interactions with on-screen components like buttons and sliders, I decided that I (and other users of Processing.js) needed a better way to make use of UI components. The system of [Processing.js Components](https://sifter.ghost.io/ghost/#/editor/post/64c367a764e3be00016e0f1d) that I developed worked very similarly to that of Java's JComponents, and included functionalities for drop-downs, text fields, sliders, buttons, check boxes, check box groups, popups, icons, hyperlinked text, and even speech bubble groups. Try interacting with the components below:

<!DOCTYPE html>
<html>
	<head>
		<title>Example Processing.js Embedding</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.0/processing.min.js"></script>
	</head>
	<body>
        <script type="application/processing">
			void setup(){
				size(400, 400);
			}
            /* 
                *This program contains multiple "Components" that are useful in any interactive game. 
                *These were inspired by Java's JComponents
                *All can be modified to display the text that you want and be anywhere on the screen
                *backspace in textfield is shift+backspace or backspace. Sometimes in google chrome the backspace key alone does not work well
                */

                /** IF YOU COPY AND PASTE THIS CODE, MAKE SURE TO GET RID OF ALL TUTORIAL STUFF. HERE IS A LIST OF THINGS YOU CAN ERASE:

                * tm_count, tutorial_message[], next_message(), 

                * everything between blue-colored 'STEP 1' and 'DRAWS ALL THE PANES AND COMPONENTS'

                * mass variable, bg_menu(), 

                * this message!

                Once you have deleted all occurrences of these, you can createa all of your components where step 1 used to be located

                Remember: first create panes and then components. 

                **/



                var gameState = 'MENU';

                var panes = [];



                var Theme = {

                    BACKGROUND:         color(66, 189, 140), 

                    OUTLINE:            color(255, 119, 0),

                    FILL:               color(199, 199, 199), 

                    ON_TEXT:            color(255, 0, 255), 

                    OFF_TEXT:           color(97, 97, 97), 

                    POPUP:              color(252, 226, 199, 215),

                    POPUP_X:            color(190, 0, 0, 215), 

                    BLACK:              color(0, 0, 0), 

                    WHITE:              color(255, 255, 255), 

                    GRAY:               color(127, 127, 127), 

                    HYPERTEXT_NEW:      color(0, 0, 255),

                    HYPERTEXT_CLICKED:  color(196, 104, 175)

                };



                var f = createFont("regular");

                textFont(f);

                textAlign(CENTER, CENTER);

                rectMode(CENTER);

                imageMode(CENTER);

                strokeCap(ROUND);





                var Text = {

                    On: Theme.ON_TEXT,

                    Off: Theme.OFF_TEXT,

                    Black: Theme.BLACK,

                    White: Theme.WHITE,

                    Size: 17,

                    Font: f,

                };



                 //translate screen values

                var t_x = 200;

                var t_y = 200;



                //current component index

                var current = [];



                //dragging

                var movex = 0;

                var movey = 0;

                var mouse = false;

                var mousePane;



                //cursor changing: ARROW, CROSS, HAND, MOVE, TEXT, WAIT

                var cursorState = true;

                var setCursor = function(c) {

                    cursorState = c;

                };

                var pcursorState;

                var updateCursor = function() {

                    switch (cursorState) {

                        case true: cursor(); break;

                        case false: noCursor(); break;

                        default: cursor(cursorState);

                    }

                };

                //creates any n-sided polygon

                var n_gon = function(n, x, y, s, fill_color, outline_color){

                    pushMatrix();

                        translate(x, y);

                        var delta_theta = 360 / n * Math.PI / 180;

                        var r = s / (2 * sin(delta_theta/2));

                        var rotate_theta = 360 * Math.PI / 180;

                        fill(fill_color); stroke(outline_color); strokeWeight(1);

                        beginShape();

                        for(var theta = 0; theta <= 361; theta += delta_theta * 180 / Math.PI){

                            var X = r * sin(theta * Math.PI / 180 + rotate_theta);

                            var Y = r * cos(theta * Math.PI / 180 + rotate_theta); 

                            vertex(X, Y);

                        } 

                        endShape();

                    popMatrix();

                };

                //updates the speed of the mouse

                var mouse_movement = function(){

                    movex = mouseX - pmouseX;

                    movey = mouseY - pmouseY;

                };

                //will shift a color by a constant

                var shift_color = function(Color, shift){

                    var r = red(Color) + shift;

                    var g = green(Color) + shift;

                    var b = blue(Color) + shift;

                    return color(r, g, b);

                };

                //creates underlined text

                var underline = function(inputtext, x, y, Font, Size, Color){

                    textFont(Font, Size);

                    textAlign(CENTER, CENTER);

                    var w = textWidth(inputtext);

                    var h = (textAscent() + textDescent()) /2;

                    fill(Color); stroke(Color); strokeWeight(1);

                    text(inputtext, x, y);

                    line(x - w/2, y + h, x + w/2, y + h);

                };



                //used for this example program (can delete this)

                var mass = 10;

                var say_hello = function(){

                    println("Hello");

                };

                var tm_count = 0;

                var tutorial_message = ["Welcome!", "Here you will find many items known as Components", "Components exist in a GUI, or graphical user interface","These Components range from Buttons to Sliders to Icons and more","In the way that this program is set-up, one can create new Components in a systematic process", "Scroll to the blue line which starts with STEP 1 (line # in the 700's)", "In green, comments will show the parameters to each component when creating one", "Check out some of the already-created components. You may notice some patterns in how they are declared", "Generally, to create a component you would type: panes[n].add_component (new SomeComponent( {param1: ___, param2: ___, param3: ___} ));", "Most components usually have a similar first set of parameters: x and y positions, widths, heights, etc", "The Component.call just serves as a way of not repeating code for all of those like parameters", "Any parameters specific to a component will be in the key (which is in the multiline comment)", "For example, when declaring a new Slider, you must declare all of the usual x:__ and y:__, but also Start, Min, Max, etc.", "Also because of the way this program is set up, another object also exists: a Pane", "Panes are a way of showing certain components in different layers. For example, the Popup Component can be dragged around, and if all components stay in the same pane, then the popup might not be able to be seen on top of all others", "By placing the Popup Component on the topmost pane, it will appear above all other components.", "By default, a pane is closer to the top when its index in panes[] is higher",  "When declaring a new Component, you must put it into a pane", "To do this, first create some panes. You can manually do so through this function: create_n_panes(gameState, n);", "We will get back to gameState shortly, but first, by using the create_n_panes function, the program will automatically make n panes numbered 0 to n-1 in the panes array", "Each pane is stored in the panes array and has an add_component() method. The add method can add a new component to that pane, where it will be stored in the pane's component array", "Sounds tricky, but for the user it is just inessential knowledge. All the programmer and user care about is adding a new component and using it.", "Back to the gameState thing. As you can see at the top of the code, the global variable gameState was declared to equal 'MENU'", "I use gameState as my way of switching between scenes or screens. Consider if you wanted to make an interactive game, you would have a start menu, instructions page, leaderboard, etc.", "gameState allows you to switch between them." , "The reason we care about the gameState with components is because you only want, say, the 'Instructions' button to be on the main menu page and not on the title screen.", "By specifying the gameState of a set of components in a pane, you can tell the pane when to appear and not to appear.", "All components in the same Pane will appear at the same time when the global variable gameState is the same as the Pane's gameState", "Now we can finally get to the specific components!", "The Slider is the first component on the list.", "With the slider, one can manipulate a global value by sliding a rectangle on a line", "In this program, the variable 'mass' is changed with the slider, which is then used in the draw loop to affect the background", "the global variable 'mass' is changed by defining the Slider's 'Value' function", "Example Code -- Value : function(){mass = this.value;}", "By defining this, the mass variable will be continuously updated to be what the slider changes it to be", "Moving on to textfields, these can be clicked and typed on easily.", "To get the string typed inside to be usable, you must call its return_value function.", "In this case, I could set the variable 'a' equal to its value.", "Code: var a = panes[0].components[1].return_value();", "For Buttons, one must simply press it to make it perform a function.", "In order to specify the functionality of any button, define its perform attribue",  "Example Code: perform: function(){println('Hello');}", "Like any of the other attributes, this code will be put inside the new object's initialization", "Popups: You give them some inputtext and tell it whether it can have a close button or not.", "All popups can be dragged about the screen.", "When a popup is displayed in its own pane, you sometimes want to stop all functionality of components in other panes so that the user must deal with the popup", "To do this, just call the popup-object's 'disable_all_other_panes()' method, or specify which panes to disable by passing an array of the number-panes in the popup-object's 'disable_panes(array)' method", "When the popup's X button is pressed, those panes will be re-enabled. To disable a pane would cause it to still get drawn but never ineract with the mouse.", "Bubbles are more simplistic. You provide the orientation and inputtext and then it displays",  "Bubble Groups just display a multitude of bubbles.", "This tutorial is a bubble group, where every click of the button creates a new bubble with text from an array", "I added the functionality of dragging and transparency changes to have a cool effect for the viewer",  "CheckBoxes can be created in an initial true/false state, and can be switched by the user", "These also return values in the same way as the other components; they will return a true or false",  "CheckBoxGroups  can hold multiple checkboxes", "In CheckBoxGroups, only one checkbox can be on at one time", "To add checks to a group, you must use the add method of checkboxgroup. You must add a checkbox object when doing this.",  "Icons are very simple.", "You just specify the image you would like and all the regular parameters and then an icon is made",  "to specify the image, you have to define the parameter getimg of the new Icon", 'Example Code-- getimg : function(){ getImage ("cute/Blank"); }', "Khan Academy will provide the actual images", "Hypertext is also pretty staightforward. Any hypertext has highlighted text and a corresponding link", "So when you declare a new HyperText, specify its 'link: '. the 'inputtext' will act as what is displayed.","When clicked, the hypertext will change color and print the link which the user should follow. Opening other web pages is not allowed on Khan Academy", "Finally, the last component discussed is the DropDown component.", "The DropDown can display a list of options that the user can pick between", "The programmer must specify the options before the user can pick them", "When creating the DropDown, you can choose to initialize the object with the array of options or you can use one of its multiple methods", "the addOptions() method takes an array and attaches the new options onto the current list", "the resetOptions() will take an array and change the options of the dropdown to only be those", "the removeOptions() will take an array of options that you wish to remove and will delete them from the list", "The DropDown's return_value() will return the option chosen. Say 'Winston' is chosen, the return_value will return the string 'Winston'.", "As a side note, the move() and shift() methods of the Component object can apply to any object. move() will place an object at some x and y, while shift() will push a component a certain x and y.", "Don't forget that inside the draw_components function that everything is translated over by t_x and t_y",  "Thanks for reading! Feel free to use any of these components and methods in you programs.", "Bye! the BubbleGroup will now display the milliseconds you have spent on this page"];

                //will loop through tutorial message

                var next_message = function(){

                    if(tm_count < tutorial_message.length){

                        panes[0].components[3].add(tm_count + ": " + tutorial_message[tm_count]); //adds bubble to bubblegroup

                        tm_count ++;

                    }

                    if(tm_count >= tutorial_message.length){

                        panes[0].components[3].add(millis());

                    }

                };



                /* OBJECTS */



                var Pane = function(config){

                    this.gameState = config.gameState || gameState;

                    this.n = config.n || 0;

                    this.disabled = config.disabled || false;

                    this.components = [];

                };

                Pane.prototype.add_component = function(object){

                    this.components.push(object);

                    current[this.n] ++;

                };

                Pane.prototype.draw = function() {

                    for(var j in this.components){

                        this.components[j].draw();

                    }

                };

                Pane.prototype.update = function(){

                    for(var j = this.components.length - 1; j >= 0; j --){

                        this.components[j].update();

                    }

                };

                var create_n_panes = function(GAMESTATE, n){

                    var l = panes.length;

                    for(var i = 0; i < n; i ++){

                        panes.push(new Pane({gameState: GAMESTATE, n: i + l, disabled: false}));

                        current[panes.length - 1] = 0;

                    }

                };









                //all components will inherit these behaviors and characteristics

                var Component = function(config){

                    this.pane = config.pane || 0;

                    this.type = config.type || "";

                    this.x = config.x || 0;

                    this.y = config.y || 0;

                    this.w = config.w || 50;

                    this.h = config.h || 50;

                    this.fill = config.fill || Theme.FILL;

                    this.outline = config.outline || Theme.OUTLINE;

                    this.inputtext = config.inputtext || "";

                    this.inputtext = this.inputtext.toString();

                    this.n = current[this.pane];

                };

                Component.prototype.setText = function(newtext){

                    this.inputtext = newtext.toString();

                };

                Component.prototype.setFill = function(Original){

                    return shift_color(Original, this.color_shift);

                };

                Component.prototype.setPane = function(pane){

                    mousePane = pane;

                };

                Component.prototype.move = function(x, y){

                    this.x = x;

                    this.y = y;

                 };

                Component.prototype.checkPane = function(){

                    //if true, then can proceed to press and hover

                    return (this.pane === mousePane || mousePane === undefined);

                };

                Component.prototype.mouse_on_RECT = function(cx, cy, w, h){

                    var mx = cx - w/2; var Mx = cx + w/2; //min and max x

                    var my = cy - h/2; var My = cy + h/2; //min and may y

                    var msx = mouseX - t_x; var msy = mouseY - t_y; //mouse x, y

                    if(msx >= mx && msx < Mx && msy >= my && msy < My){return true;}

                    else{return false;}

                };

                Component.prototype.mouse_on_ELLIPSE = function(x, y, ex, ey, r){

                    if(dist(x, y, ex, ey) <= r){return true;}

                    else{return false;}

                 };

                Component.prototype.analyze = function(){

                    textFont(Text.Font, Text.Size);

                    this.words = [""];

                    this.lines = [[]];

                    this.inputtext = this.inputtext.toString();

                    var current_line = 0;

                    var current_word = 0;

                    var current_w = 0;



                    CREATE_WORDS:

                    for(var i = 0; i < this.inputtext.length; i ++){

                        var c = this.inputtext.substring(i, i + 1);

                        if(c !== " " && c !== "\n"){

                            this.words[current_word] += c;

                            continue;

                        }

                        else{

                            this.words[current_word] += " ";

                            current_word ++;

                            this.words[current_word] = "";

                            continue;

                        }

                    }

                    SORT_LINES:

                    for(var i = 0; i < this.words.length; i ++){

                        if(this.words.length === 1){

                            while(textWidth(this.words[i]) >= this.text_w){

                                this.words.splice(i + 1, 0, this.words[i].substring(this.words[i].length/2, this.words[i].length));

                                this.words[i] = this.words[i].substring(0, this.words[i].length/2);

                            }

                        }

                        var Switch = false;

                        if(textWidth(this.words[i]) + current_w >= this.text_w){

                            current_line ++;

                            Switch = true;

                        }else if(!Switch){

                            this.lines[current_line].push(i);

                            current_w += textWidth(this.words[i]);

                            continue;

                        }

                        if(Switch){

                            while(textWidth(this.words[i]) >= this.text_w){

                    this.words.splice(i + 1, 0, this.words[i].substring(this.words[i].length/2, this.words[i].length));

                            this.words[i] = this.words[i].substring(0, this.words[i].length/2);

                            }

                            this.lines[current_line] = [i];

                            current_w = textWidth(this.words[i]);

                            continue;

                        }



                    }

                    this.diff = Text.Size; 

                    this.text_h = this.diff * (this.lines.length - 1); //height will be equal to distance of line spacing times number of lines - 1

                    this.h = this.text_h + 2 * this.yborder + this.diff;



                 };

                Component.prototype.return_value = function(type){

                    switch(type){

                        case "STRING" || 'string' || "String" || 'str':

                            return this.value.toString();

                        case "INT" || 'Int' || 'Integer' || 'int' ||"INTEGER":

                            return parseInt(this.value, 10);

                        default:

                            return this.value;

                    }

                };









                //pane, type, x, y, w, h, inputtext, fill, outline, Value, Min, Max, Start



                /* SLIDER */

                var Slider = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, fill: config.fill, outline: config.outline});

                    this.type = "SLIDER";

                    this.min = config.Min || 0;

                    this.max = config.Max || 100;

                    this.Start = constrain(config.Start, this.min, this.max) || (this.min + this.max)/2;

                    this.slider_x = map(this.Start, this.min, this.max, -this.w/2, this.w/2);

                    this.Value = config.Value || function(){};

                    this.rw =10; //slider width

                    this.rh = 30; //slider height

                    this.original_fill = this.fill;

                    this.on = false;

                    this.color_shift = 0;

                    this.curved = 20;



                };

                Slider.prototype = Object.create(Component.prototype);

                Slider.prototype.update_value = function(){

                    this.value = round(map(this.slider_x, -this.w/2, this.w/2, this.min, this.max));

                    this.Value();

                };

                Slider.prototype.draw_bar = function(){

                    noFill(); stroke(this.outline); strokeWeight(4);

                    line(-this.w/2, 0, this.w/2, 0);

                };

                Slider.prototype.draw_slide = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(2);

                    rect(this.slider_x, 0, this.rw, this.rh, this.curved);

                    strokeWeight(3);

                    line(this.slider_x, -3, this.slider_x, 3);

                };

                Slider.prototype.draw_text = function(){

                    fill(Text.On); textFont(Text.Font, Text.Size);

                    text(this.inputtext + this.value, 0, -(textAscent() + textDescent() + this.rh)/2);

                };

                Slider.prototype.draw = function() {

                    pushMatrix();

                        translate(this.x, this.y);

                        this.draw_bar();

                        this.draw_slide();

                        this.draw_text();

                    popMatrix();

                };

                Slider.prototype.hover = function(){

                    setCursor(HAND);

                    this.color_shift = -30;

                };

                Slider.prototype.press = function(){

                    this.setPane(this.pane);

                    setCursor(HAND);

                    this.color_shift = -40;

                    this.slider_x = constrain(mouseX - this.x - t_x, -this.w/2, this.w/2);

                    mouse = true;

                };

                Slider.prototype.update = function(){

                    this.color_shift = 0;

                    if(this.mouse_on_RECT(this.slider_x + this.x, this.y, this.rw, this.rh)){

                        this.hover();

                        if(mousePressed && !mouse){this.on = true;}

                    }

                    if(this.on){this.press();}

                    if(!mousePressed){this.on = false; }

                    this.fill = this.setFill(this.original_fill);

                    this.update_value();

                };





                /* TEXTFIELD */

                var TextField = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, fill: config.fill, outline: config.outline});

                    this.type = "TEXTFIELD";

                    this.string = "";

                    this.crypted = config.crypt || false;

                    this.original_fill = this.fill;

                    this.on = false;

                    this.dead = false;

                    this.dropped = false;

                    this.c = 0;

                    this.color_shift = 0;



                };

                TextField.prototype = Object.create(Component.prototype);

                TextField.prototype.update_value = function(){

                    this.value = this.string;

                };

                TextField.prototype.draw_box = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(1);

                    rect(0, 0, this.w, this.h);

                };

                TextField.prototype.draw_title = function(){

                    fill(Text.Off); textFont(Text.Font, Text.Size);

                    text(this.inputtext, 0, 0);

                };

                TextField.prototype.draw_text = function(){

                    fill(Text.On); textFont(Text.Font, Text.Size);

                    if(!this.crypted){text(this.string, 0, 0);}

                    else if(this.crypted){

                        var astericks = "";

                        CRYPT:

                        for(var i in this.string){astericks += "*";}

                        text(astericks, 0, 0);

                    }

                };

                TextField.prototype.draw = function(){

                    pushMatrix();

                        translate(this.x, this.y);

                        this.draw_box();

                        if(this.on === false && this.string === ""){this.draw_title();}

                        this.draw_text();

                    popMatrix();

                };

                TextField.prototype.hover = function(){

                    setCursor(TEXT);

                };

                TextField.prototype.press = function(){

                    this.color_shift = 40;

                    this.setPane(this.pane);

                    mouse = true;

                };

                TextField.prototype.update = function(){

                    this.color_shift = 0;

                    if(this.mouse_on_RECT(this.x, this.y, this.w, this.h)){

                        this.hover();

                        if(mousePressed && !mouse){this.on = true;}

                    }

                    else if(mousePressed){this.on = false; this.dead = true;}

                    if(this.on){this.press();}

                    if(!mousePressed){}

                    this.INT = parseInt(this.string, 10);

                    this.fill = this.setFill(this.original_fill);

                    this.update_value();

                };







                /* BUTTON*/

                var Button = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, fill: config.fill, outline: config.outline});

                    this.type = "BUTTON";

                    this.inactive = config.inactive || false;

                    this.original_fill = this.fill;

                    this.curved = 20;

                    this.mouse = false;

                    this.shadowx = this.w/20;

                    this.shadowy = this.h/10;

                    this.beginning = false;

                    this.perform = config.perform || function(){};

                };

                Button.prototype = Object.create(Component.prototype);

                Button.prototype.update_value = function(){

                    this.value = this.mouse;

                };

                Button.prototype.draw_button = function(){

                    fill(Theme.OFF_TEXT); noStroke();

                    rect(this.x + this.shadowx, this.y + this.shadowy, this.w, this.h, this.curved);

                    fill(this.fill); stroke(this.outline); strokeWeight(1);

                    rect(this.x + this.pressx, this.y + this.pressy, this.w, this.h, this.curved);

                };

                Button.prototype.draw_text = function(){

                    fill(Text.Off); textFont(Text.Font, Text.Size);

                    text(this.inputtext, this.x + this.pressx, this.y + this.pressy);

                };

                Button.prototype.draw = function() {

                    this.draw_button();

                    this.draw_text();

                };

                Button.prototype.hover = function(){

                    this.color_shift = -20;

                    setCursor(HAND);

                };

                Button.prototype.press = function(){

                    this.setPane(this.pane);

                    this.color_shift = -40;

                    this.pressx = this.shadowx/2;

                    this.pressy = this.shadowy/2;

                    if(!this.mouse){

                        this.perform();

                        this.mouse = true;

                        mouse = true;

                    }

                };

                Button.prototype.update = function(){

                    this.color_shift = 0;

                    this.pressx = 0;

                    this.pressy = 0;

                    if(this.mouse_on_RECT(this.x, this.y, this.w, this.h)){

                        this.hover();

                        if(mousePressed && !mouse){this.beginning = true;}

                    }

                    if(this.beginning){this.press();}

                    if(!mousePressed){this.mouse = false; this.beginning = false;}

                    this.fill = this.setFill(this.original_fill);

                    this.update_value();

                };



                /* POPUP */

                //up, X, border

                var Popup = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, outline: config.outline});

                    this.type = "POPUP";

                    this.fill = Theme.POPUP;

                    this.X = true;

                    if(config.X !== undefined){this.X = config.X;}//boolean for if there is an X

                    this.X_fill = Theme.POPUP_X;

                    this.original_X_fill = this.X_fill;

                    this.disPlay = true; //unless specified, it will display

                    if(config.up !== undefined){this.disPlay = config.up;}

                    this.curved = 20;

                    this.xborder = config.xborder || 10;

                    this.yborder = config.yborder || 10;

                    this.text_w = constrain(this.w - this.xborder, textWidth("w"), this.w);

                    this.dragging = false;

                    this.beginning = false;

                    this.Xbeginning = false;

                    this.Xsize = 15;

                };

                Popup.prototype = Object.create(Component.prototype);

                Popup.prototype.update_value = function(){

                    this.value = this.disPlay;

                };

                Popup.prototype.disable_all_other_panes = function(){

                    for(var i = 0; i < panes.length; i ++){

                        if(i !== this.pane){

                            panes[i].disabled = true;

                        }

                        else{panes[this.pane].disabled = false;}

                    }

                };

                Popup.prototype.disable_panes = function(panes_array){

                    for(var i in panes_array){

                        panes[panes_array[i]].disabled = true;

                    }

                };

                Popup.prototype.enable_all_other_panes = function(){

                    for(var i = 0; i < panes.length; i ++){

                        if(i !== this.pane){

                            panes[i].disabled = false;

                        }

                    }

                };

                Popup.prototype.enable_panes = function(panes_array){

                    for(var i in panes_array){

                        panes[panes_array[i]].disabled = false;

                    }

                };

                Popup.prototype.draw_window = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(2);

                    rect(0, 0, this.w, this.h, this.curved);

                };

                Popup.prototype.draw_text = function(){

                    textFont(Text.Font, Text.Size); textLeading(Text.Size); fill(Text.Black);

                    LINES:

                    for(var i = 0; i < this.lines.length; i ++){

                        var s = '';

                        WORDS:

                        for(var j = 0; j < this.lines[i].length; j ++){

                            if(this.words[this.lines[i][j]] === undefined){break WORDS;}

                            s += this.words[this.lines[i][j]];

                        }

                        text(s, 0, -this.text_h/2 + i * this.diff);

                    }

                };

                Popup.prototype.draw_X = function(){

                    fill(this.X_fill); stroke(this.outline); strokeWeight(1);

                    ellipse(this.X_pos[0], this.X_pos[1], this.Xsize, this.Xsize);

                    fill(Text.Black); textSize(this.Xsize*3/4);

                    text("X", this.X_pos[0], this.X_pos[1]);

                };

                Popup.prototype.draw = function(){

                    if(this.disPlay){

                        pushMatrix();

                            translate(this.x, this.y);

                            this.draw_window();

                            this.draw_text();

                            if(this.X){this.draw_X();}

                        popMatrix();

                    }

                };

                Popup.prototype.hover = function(){

                    setCursor(HAND);

                    this.color_shift = 20;

                };

                Popup.prototype.press = function(){

                    this.setPane(this.pane);

                    setCursor(HAND);

                    this.color_shift = 40;

                    this.disPlay = false;

                    this.enable_all_other_panes();

                    mouse = true;

                };

                Popup.prototype.drag = function(){

                    this.setPane(this.pane);

                    this.x += movex;

                    this.y += movey;

                    mouse = true;

                };

                Popup.prototype.update = function(){

                    this.color_shift = 0;

                    this.analyze();

                    this.X_pos = [this.w/2 - textAscent(), -this.h/2 + textAscent()];

                    this.mousex = mouseX - t_x;

                    this.mousey = mouseY - t_y;

                    if(this.X && this.mouse_on_ELLIPSE(this.mousex, this.mousey, this.X_pos[0] + this.x, this.X_pos[1] + this.y, this.Xsize/2) && this.disPlay && !this.dragging){

                        this.hover();

                        if(mousePressed && !mouse){this.Xbeginning = true;}

                    }

                    else if (this.mouse_on_RECT(this.x, this.y, this.w, this.h) && this.disPlay){setCursor(MOVE); if(mousePressed && !mouse){this.dragging = true; this.beginning = true;}}

                    if(this.Xbeginning){this.press();}

                    if(this.dragging && this.beginning){this.drag();}

                    if(!mousePressed){this.dragging = false; this.beginning = false; this.Xbeginning = false;}

                    this.X_fill = this.setFill(this.original_X_fill);

                    this.update_value();

                };



                /* Bubble */

                var Bubble = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, outline: config.outline});

                    this.type = "BUBBLE";

                    this.fill = Theme.WHITE;

                    this.curved = config.curved || 10;

                    this.r = red(this.fill);

                    this.g = green(this.fill);

                    this.b = blue(this.fill);

                    this.a = config.a || 255;

                    this.orientation = config.orientation || "LEFT";

                    this.xborder = config.xborder || 10;

                    this.yborder = config.yborder || 10;

                    textFont(Text.Font, Text.Size);

                    this.text_w = constrain(this.w - this.xborder, textWidth("www"), this.w);

                };

                Bubble.prototype = Object.create(Component.prototype);

                Bubble.prototype.update_value = function(){

                    this.value = this.inputtext;

                };

                Bubble.prototype.draw_window = function(){

                    fill(this.r, this.g, this.b, this.a); noStroke();

                    rect(0, 0, this.w, this.h, this.curved);

                };

                Bubble.prototype.draw_tail = function(){

                    var m = (this.orientation === 'LEFT')? -1 : 1;

                    triangle(m*this.w/2, this.text_h/2, m*(this.w/2 + Text.Size/2), this.h/2, m*(this.w - Text.Size)/2, this.h/2);

                };

                Bubble.prototype.draw_text = function(){

                    textFont(Text.Font, Text.Size); textLeading(Text.Size); fill(red(Text.On), green(Text.On), blue(Text.On), this.a);

                    LINES:

                    for(var i = 0; i < this.lines.length; i ++){

                        var s = '';

                        WORDS:

                        for(var j = 0; j < this.lines[i].length; j ++){

                            if(this.words[this.lines[i][j]] === undefined){break WORDS;}

                            s += this.words[this.lines[i][j]];

                        }

                        text(s, 0, -this.text_h/2 + i * this.diff);

                    }

                };

                Bubble.prototype.draw = function() {

                    pushMatrix();

                        translate(this.x, this.y);

                        this.draw_window();

                        this.draw_tail();

                        this.draw_text();

                    popMatrix();

                };

                Bubble.prototype.update = function(){

                    this.analyze();

                    this.update_value();

                };







                /* Bubble Group */

                var BubbleGroup = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext});

                    this.type = "BUBBLEGROUP";

                    this.orientation = config.orientation || "LEFT";

                    this.xborder = config.xborder || 10;

                    this.yborder = config.yborder || 10;

                    this.bubbles = [];

                    this.dragged_y = 0;

                    this.beginning = false;

                };

                BubbleGroup.prototype = Object.create(Component.prototype);

                BubbleGroup.prototype.update_value = function(){

                    this.value = this.bubbles.length;

                };

                BubbleGroup.prototype.drag = function(y_drag){

                    for(var i in this.bubbles){

                        this.bubbles[i].y += y_drag;

                    }

                    mouse = true;

                };

                BubbleGroup.prototype.update_color = function(low, high){

                    UPDATE_TRANSPARENCY:

                    for(var i = low; i < high; i ++){

                        this.bubbles[i].a = 255*pow(2.71828, -0.002*(this.y - (this.bubbles[i].y + this.bubbles[i].h/2)));

                    }

                };

                BubbleGroup.prototype.add = function(intext){

                    if(intext === undefined){intext = "";}

                    this.bubbles.push(new Bubble({

                        pane: this.pane, x: this.x, y: this.y, w: this.w, inputtext: intext.toString(), orientation: this.orientation, a: 255, xborder: this.xborder, yborder: this.yborder}));

                    this.bubbles[this.bubbles.length - 1].analyze();

                    var h = this.bubbles[this.bubbles.length - 1].h + this.bubbles[this.bubbles.length - 1].yborder;

                    var H = Text.Size;

                    this.bubbles[this.bubbles.length - 1].y -= h/2 - H;

                    SHIFT_BUBBLES:

                    for(var i = 0; i < this.bubbles.length - 1; i ++){

                        this.bubbles[i].y -= h + this.dragged_y;

                    }

                    this.dragged_y = 0;

                    this.update();

                };

                BubbleGroup.prototype.draw = function(){

                    DISPLAY_BUBBLES:

                    for(var I in this.bubbles){

                        this.bubbles[I].update();

                        this.bubbles[I].draw();

                    }

                };

                BubbleGroup.prototype.update = function(){

                    this.update_value();

                    this.update_color(0, this.bubbles.length);

                    if(mouseX - t_x >= this.x - this.w/2 && mouseX - t_x < this.x + this.w/2){

                        setCursor(MOVE);

                        if(mousePressed && !mouse){this.beginning = true;}

                    }

                    if(this.beginning){

                        this.dragged_y += movey;

                        this.drag(movey);

                    }

                    if(!mousePressed){this.beginning = false;}

                };





                /* CHECKBOX */

                var CheckBox = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, outline: config.outline});

                    this.type = "CHECKBOX";

                    this.fill = Theme.GRAY;

                    this.original_fill = this.fill;

                    this.yes = config.initial;

                    this.mouse = false;

                    this.w = config.w || 15;

                };

                CheckBox.prototype = Object.create(Component.prototype);

                CheckBox.prototype.update_value = function(){

                    this.value = this.yes;

                };

                CheckBox.prototype.draw_back = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(1);

                    ellipse(this.x, this.y, this.w, this.w);

                };

                CheckBox.prototype.draw_check = function(){

                    fill(Theme.WHITE); noStroke();

                    ellipse(this.x, this.y, this.w*0.5, this.w*0.5);

                };

                CheckBox.prototype.draw_text = function(){

                    var t_w = textWidth(this.inputtext);

                    fill(Text.On); textFont(Text.Font, Text.Size);

                    text(this.inputtext, this.x - this.w/2 - t_w/2, this.y);

                };

                CheckBox.prototype.draw = function() {

                    this.draw_back();

                    if(this.yes){this.draw_check();}

                    this.draw_text();

                };

                CheckBox.prototype.hover = function(){

                    this.color_shift = 30;

                    setCursor(HAND);

                };

                CheckBox.prototype.press = function(){

                    this.setPane(this.pane);

                    setCursor(HAND);

                    this.color_shift = 40;

                    if(!this.mouse){

                        if(!this.yes){this.yes = true;}

                        else{this.yes = false;}

                        this.switched = true;

                        this.mouse = true;

                        mouse = true;

                    }

                };

                CheckBox.prototype.update = function(){

                    this.color_shift = 0;

                    this.switched = false;

                    if(this.mouse_on_ELLIPSE(mouseX - t_x, mouseY - t_y, this.x, this.y, this.w/2)){

                        this.hover();

                        if(mousePressed && !mouse){this.press();}

                    }

                    if(!mousePressed){this.mouse = false; }

                    this.update_value();

                    this.fill = this.setFill(this.original_fill);

                    return this.switched;

                };



                /* CheckBoxGroup */

                var CheckBoxGroup = function(config){  

                    this.pane = config.pane || 0;

                    this.type = "CHECKBOXGROUP";

                    this.n = current[this.pane];

                    current[this.pane] ++;

                    this.checks = [];

                };

                CheckBoxGroup.prototype = Object.create(Component.prototype);

                CheckBoxGroup.prototype.update_value = function(){//returns an array of false false true for example if you have three check boxes

                    this.value = [];

                    APPEND_RETURN:

                    for(var i in this.checks){

                        this.value.push(this.checks[i].yes);

                    }

                };

                CheckBoxGroup.prototype.allfalse = function(){

                    ALL_OFF:

                    for(var i in this.checks){

                        this.checks[i].yes = false;

                    }

                };

                CheckBoxGroup.prototype.add = function(object){

                    if(object.yes){this.allfalse();}

                    this.checks.push(object);

                    var once = false;

                    ONE_MUST_BE_TRUE:

                    for(var i in this.checks){

                        if(this.checks[i].yes){once = true; break;}

                    }

                    if(!once){this.checks[0].yes = true;}

                };

                CheckBoxGroup.prototype.draw = function() {

                    DRAW_CHECKS:

                    for(var i in this.checks){

                        this.checks[i].draw();

                    }

                };

                CheckBoxGroup.prototype.update = function(){

                    UPDATE:

                    for(var i in this.checks){

                        if(this.checks[i].update()){

                            this.allfalse();

                            this.checks[i].yes = true;

                            break;

                        }

                    }

                    this.update_value();

                };



                /* DROPDOWN */

                var DropDown = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, fill: config.fill, outline: config.outline});

                    this.type = "DROPDOWN";

                    this.open = false;

                    this.active_index = 0;

                    this.hover_index = 0;

                    this.button_fill = Theme.GRAY;

                    this.original_button_fill = this.button_fill;

                    textFont(Text.Font, Text.Size);

                    this.h = 1.5*(textAscent() + textDescent());

                    this.offset = -this.h/2;

                    this.rw = this.w - this.h;

                    this.mouse = false;

                    this.beginning = false;

                    this.options = [];

                    this.initial = config.initial || [];

                    INITIALIZE:

                    for(var i in this.initial){

                        this.options.push(this.initial[i]);

                    }

                };

                DropDown.prototype = Object.create(Component.prototype);

                DropDown.prototype.update_value = function(){

                    this.value = this.options[this.active_index];

                };

                DropDown.prototype.addOptions = function(array){

                    ADD_OPTIONS:

                    for(var i in array){

                        this.options.push(array[i]);

                    }

                };

                DropDown.prototype.removeOptions = function(array){

                    REMOVE_OPTIONS:

                    for(var i in array){

                        var index = this.options.indexOf(array[i]);

                        if(index >= 0){this.options.splice(index, 1);}

                    }

                };

                DropDown.prototype.resetOptions = function(array){

                    this.options = [];

                    RESET_OPTIONS:

                    for(var i in array){

                        this.options.push(array[i]);

                    }

                };

                DropDown.prototype.changeType = function(){

                    if(this.type === true){this.type = false;}

                    else{this.type = true;}

                };

                DropDown.prototype.draw_rect = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(1);

                    rect(this.x + this.offset, this.y, this.rw, this.h);

                };

                DropDown.prototype.draw_button = function(){

                    fill(this.button_fill); stroke(this.outline); strokeWeight(1);

                    rect(this.x + (this.w - this.h)/2, this.y, this.h, this.h);

                    fill(48, 48, 48);

                    n_gon(3, this.x + (this.w - this.h)/2, this.y, this.h/2, Theme.POPUP_X, color(181, 177, 177));

                };



                DropDown.prototype.draw_active = function(){

                    fill(Text.Black); textFont(Text.Font, Text.Size);

                    text(this.options[this.active_index], this.x + this.offset, this.y);

                };

                DropDown.prototype.draw_list = function(){

                    fill(Theme.WHITE); strokeWeight(2); noStroke();

                    rect(this.x + this.offset, this.y + ((this.options.length + 1)*this.h/2), this.rw, (this.options.length*this.h));

                    DROP:

                    for(var i = 0; i < this.options.length; i ++){

                        fill(Theme.WHITE); strokeWeight(2); noStroke();

                        if(this.hover_index === i){stroke(Theme.GRAY); fill(Theme.HYPERTEXT_NEW);}

                        if(this.active_index === i){fill(Theme.OUTLINE);}

                        rect(this.x + this.offset, this.y + (i + 1)*this.h, this.rw, this.h);

                        fill(Text.Black); textFont(Text.Font, Text.Size);

                        text(this.options[i], this.x + this.offset, this.y + (i + 1)*this.h);



                    }

                };

                DropDown.prototype.draw = function() {

                    this.draw_rect();

                    this.draw_button();

                    this.draw_active();

                    if(this.open) {this.draw_list();}

                };

                DropDown.prototype.hover = function(){

                    setCursor(HAND);

                    this.color_shift = 20;

                };

                DropDown.prototype.press = function(index){

                    setCursor(HAND);

                    this.color_shift = 40;

                    if(!this.mouse){

                        if(this.open){this.open = false;}

                        else{this.open = true;}

                        if(index !== undefined){this.active_index = index;}

                        this.mouse = true;

                        mouse = true;

                    }

                };

                DropDown.prototype.update = function(){

                    this.color_shift = 0;

                    var on = false;

                    if(this.mouse_on_RECT(this.x + (this.w - this.h)/2, this.y, this.h, this.h)){

                        this.hover();

                        if(mousePressed){on = true; if(!mouse){this.beginning = true;}}

                    }

                    if(this.open){

                        DROP_HOVER:

                        for(var i = 0; i < this.options.length; i ++){

                            if(this.mouse_on_RECT(this.x + this.offset, this.y + (i+1)*this.h, this.rw, this.h)){

                                this.hover_index = i;

                                setCursor(HAND);

                                if(mousePressed){on = true; this.press(i);}

                            }

                        }

                    }

                    if(this.beginning){this.press();}

                    if(mousePressed && !on){this.open = false;}

                    if(!mousePressed){this.mouse = false; this.beginning = false;}

                    this.update_value();

                    this.button_fill = this.setFill(this.original_button_fill);

                };



                /* ICON */

                var Icon = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, h: config.h, inputtext: config.inputtext, fill: config.fill, outline: config.outline});

                    this.type = "ICON";

                    this.getimg = config.getimg;

                    this.getimg();

                    this.curved = config.curved || 15;

                };

                Icon.prototype = Object.create(Component.prototype);

                Icon.prototype.update_value = function(){

                    this.value = this.img;

                };

                Icon.prototype.draw_window = function(){

                    fill(this.fill); stroke(this.outline); strokeWeight(4);

                    rect(this.x, this.y, this.w, this.h, this.curved);

                };

                Icon.prototype.draw_image = function(){

                    imageMode(CENTER);

                    //image(this.img, this.x, this.y, this.w, this.h);

                };

                Icon.prototype.draw_text = function(){

                    fill(Text.On); textFont(Text.Font, Text.Size);

                    text(this.inputtext, this.x, this.y - (this.h + textDescent() + textAscent())/2);

                };

                Icon.prototype.draw = function() {

                    this.draw_window();

                    this.draw_image();

                    this.draw_text();

                };

                Icon.prototype.update = function(){

                    this.update_value();

                };



                /* HYPERTEXT */

                var HyperText = function(config){

                    Component.call(this, {pane: config.pane, x: config.x, y: config.y, w: config.w, inputtext: config.inputtext});

                    this.fill = Theme.HYPERTEXT_NEW;

                    this.original_fill = this.fill;

                    this.color_shift = 0;

                    this.link = config.link || "";

                    textFont(Text.Font, Text.Size);

                    this.w = 0;

                    this.h = textAscent() + textDescent();

                    this.beginning = false;

                    this.mouse = false;

                };

                HyperText.prototype = Object.create(Component.prototype);

                HyperText.prototype.update_value = function(){

                    this.value = this.link;

                };

                HyperText.prototype.break_down = function(){

                    this.Lines = [""];

                    this.current_Line = 0;

                    for(var i = 0; i < this.inputtext.length; i ++){

                        var c = this.inputtext.substring(i, i + 1);

                        if(c === '\n'){

                            this.current_Line ++;

                            this.Lines[this.current_Line] = "";

                        } else {

                            this.Lines[this.current_Line] += c;

                        }

                    }

                };

                HyperText.prototype.draw = function() {

                    for(var i = 0; i < this.Lines.length; i ++){

                        underline(this.Lines[i], this.x, this.y - ((this.Lines.length - 1) * (this.h/2)) + (i * this.h), Text.Font, Text.Size, this.fill);

                    }

                };

                HyperText.prototype.open_link = function(){

                    println(this.value);

                };

                HyperText.prototype.hover = function(){

                    setCursor(HAND);

                    if(this.original_fill === Theme.HYPERTEXT_NEW){this.color_shift = 100;}else{this.color_shift = 30;}



                };

                HyperText.prototype.press = function(){

                    setCursor(HAND);

                    this.original_fill = Theme.HYPERTEXT_CLICKED;

                    if(this.original_fill === Theme.HYPERTEXT_NEW){this.color_shift = 110;}else{this.color_shift = 50;}

                    if(!this.mouse){

                        this.open_link();

                        this.mouse = true;

                        mouse = true;

                    }

                };

                HyperText.prototype.update = function(){

                    this.break_down();

                    this.color_shift = 0;

                    textFont(Text.Font, Text.Size);

                    for(var i = 0; i < this.Lines.length; i ++){

                        if(this.mouse_on_RECT(this.x, this.y - ((this.Lines.length - 1) * (this.h/2)) + (i * this.h), textWidth(this.Lines[i]), this.h)){

                            this.hover();

                            if(mousePressed && !mouse){this.beginning = true;}

                        }

                    }

                    if(this.beginning){this.press();}

                    if(!mousePressed){this.beginning = false; this.mouse = false;}

                    this.fill = this.setFill(this.original_fill);

                    this.update_value();

                };





























                /*              KEY

                Component.call: pane: (int), x: (int), y: (int), w: (int), h: (int), inputtext: (int) or (string)



                    - Slider: Component.call, Min: (int), Max: (int), Start: (int), Value: (function)

                    - TextField: Component.call, crypt: (boolean)

                    - Button: Component.call, inactive: (boolean), perform: (function)

                    - Popup: Component.call, up: (boolean), X: (boolean), xborder: (int), yborder: (int), allow_drag: (boolean)

                    - Bubble: Component.call, orientation: "LEFT" or "RIGHT", xborder: (int), yborder: (int), a: (int)

                    - BubbleGroup: Component.call, orientation: "LEFT" or "RIGHT", xborder: (int), yborder: (int)

                        .add(string)

                    - CheckBox: Component.call, initial: (boolean)

                    - CheckBoxGroup: pane: (int)

                        .add(new CheckBox({config}));

                    - Icon: Component.call, getimg: (function(){getImage("cute/Blank");})

                    - DropDown: Component.call, initial: (array)

                    - HyperText: Component.call, link: (string), 



                */



                /**  STEP 1: TUTORIAL STARTS HERE */



                //create new component by using the add_component(object) method on a Pane object found in the panes array. 



                create_n_panes('MENU', 2); //creates 2 new panes with the gameStates === 'MENU' and indexes = 0 and 1 in panes[]





                //types: Slider, TextField, Button, Popup, Bubble, BubbleGroup, CheckBox, CheckBoxGroup, Icon, DropDown





                //Slider: Component.call, Min, Max, Start, Value

                panes[0].add_component(new Slider({

                    pane: 0, x: -130, y:-65, w: 133, h: 0, inputtext: "Slider: ", Min: 0, Max: 100, Start: 50, Value: function(){mass = this.value;}}));



                //TextField: Component.call, crypt

                panes[0].add_component(new TextField({

                    pane: 0, x: -138, y:-20, w: 120, h: 50, inputtext: "Text Field", crypt: false})); 



                //Button: Component.call, inactive, perform

                panes[0].add_component(new Button({

                    pane: 0, x: -138, y: 50, w: 120, h: 50, inputtext: "Hello Button", inactive: false, perform: function(){println("Hello");}}));



                //Popup: Component.call, up, X, xborder, yborder, allow_drag

                panes[1].add_component(new Popup({

                    pane: 1, x: 0, y: 0, w: 300, inputtext: "You chose a Popup Menu. The Only way to get out is to press that Red X at the top-right corner. Did you notice that all of the components have been locked? Freaky!", up: false, X: true, xborder: 40, yborder: 40, allow_drag : true}));



                //BubbleGroup: Component.call, orientation, xborder, yborder

                panes[0].add_component(new BubbleGroup({

                    pane: 0, x: 113, y: 150, w: 150, orientation: "RIGHT", xborder: 10, yborder: 10}));

                    //new bubble in the bubblegroup

                    panes[0].components[3].add("Click Button Below for Tutorial");

                    //button makes the BubbleGroup's tutorial continue

                    panes[0].add_component(new Button({

                        pane: 0, x: 120, y: 180, w: 120, h: 20, inputtext: "Next Bubble", perform: next_message}));



                //Bubble: Component.call, orientation, a, border

                panes[0].add_component(new Bubble({

                    pane: 0, x: -20, y: 72, w: 96, inputtext: "New Speech Bubble.", orientation: "LEFT", a: 255, xborder: 10, yborder: 10})); 



                //CheckBox: Component.call, initial

                panes[0].add_component(new CheckBox({

                    pane: 0, x: 20, y: 0, inputtext: "CheckBox: ", initial: false}));



                //CheckBoxGroup: pane, type

                panes[0].add_component(new CheckBoxGroup({

                    pane: 0}));

                    //new checkboxes within this grouping

                    panes[0].components[7].add(new CheckBox({

                        pane: 0, x: 20, y: -80, inputtext: "Check ", initial: false}));

                    panes[0].components[7].add(new CheckBox({

                        pane: 0, x: 20, y: -60, inputtext: "Box ", initial: true}));

                    panes[0].components[7].add(new CheckBox({

                        pane: 0, x: 20, y: -40, inputtext: "Group ", initial: false}));



                //Icon: Component.call, getimg

                panes[0].add_component(new Icon({

                    pane: 0, x: -150, y: 150, w: 60, h: 60, inputtext: "Winston", getimg: function(){return;}}));



                //HyperText: Component.call, link

                panes[0].add_component(new HyperText({

                    pane: 0, x: -88, y: -116, inputtext: "Hypertext: Click Here\nfor More Awesome Programs", link: "https://www.khanacademy.org/computing/cs/browse-programs\nhttps://www.khanacademy.org/profile/rayjfriend/programs"}));



                //DropDown: Component.call, initial

                var new_names = ["Winston", "Pamela", "Khan", "Brit", "Hopper"];

                panes[0].add_component(new DropDown({

                    pane: 0, x: -100, y: -180, w: 150, initial: new_names}));



                //Another button for the popup

                panes[0].add_component(new Button({

                    pane: 0, x: -45, y: 160, w: 120, h: 40, inputtext: "Display Popup", perform: function(){panes[1].components[0].disPlay = true; panes[1].components[0].x = 0; panes[1].components[0].y = 0; panes[1].components[0].disable_all_other_panes(); panes[1].components[0].update();}}));







                //next gameState and pane

                create_n_panes("MENU2", 1); //one pane in MENU2

                panes[2].add_component(new Bubble({

                    pane: 2, x: 0, y: 0, w: 150, inputtext: "See! That's the power of having gameState and panes! Good find!"}));













                /** DRAWS ALL THE PANES AND COMPONENTS**/

                var draw_components = function(){

                    textFont(Text.Font, Text.Size);

                    mousePane = undefined;

                    pushMatrix();

                        translate(t_x, t_y);

                        UPDATE_COMPONENTS:

                        for(var i = panes.length - 1; i >= 0; i --){ //the higher the pane number, the closer to the top it is

                            if(panes[i].gameState === gameState && !panes[i].disabled){

                                panes[i].update();

                            }

                        }

                        DRAW_COMPONENTS:

                        for(var i in panes){ //the higher the pane number, the closer to the top it is

                            if(panes[i].gameState === gameState){

                                panes[i].draw();

                            }

                        }

                        popMatrix();

                 };

















                var keyPressed = function(){

                    FIND_ON:

                    for(var i = 0; i < panes.length; i ++){

                        if(panes[i].components.length === 0){continue;}

                        var n; textFont(Text.Font, Text.Size);

                        for(var j = 0; j < panes[i].components.length; j ++){

                            if(panes[i].components[j].on && panes[i].components[j].type === 'TEXTFIELD'){n = j; break;}

                        }

                        if(n !== undefined){

                            if(panes[i].components[n].dead){

                                panes[i].components[n].string = '';

                                panes[i].components[n].dead = false;

                            }

                            if((keyCode === 8 || keyCode === 46) && panes[i].components[n].c >= 0){ //backspace

                                panes[i].components[n].string = panes[i].components[n].string.substring(0, panes[i].components[n].string.length - 1);

                                panes[i].components[n].c --;

                            }

                            if(((keyCode <= 90 && keyCode >= 46) || keyCode === (32) || (keyCode >= 186 && keyCode <= 192) || (keyCode >= 106 && keyCode <= 109) || keyCode >= 219)){

                                var asterick = textWidth("*");

                                if(!panes[i].components[n].crypted && textWidth(panes[i].components[n].string) <= panes[i].components[n].w/1.1 || (panes[i].components[n].crypted && asterick * panes[i].components[n].string.length <= panes[i].components[n].w/1.1)){



                                    panes[i].components[n].string += key.toString();

                                    panes[i].components[n].c ++;

                                }

                            }

                        }

                    }

                };



                var bg_menu = function(){

                    var b = Theme.BACKGROUND; var mp = mass/100;

                    background(red(b)*mp, green(b)*mp, blue(b)*mp);

                };



                var check_gameState = function(){

                    switch(gameState){

                        case "MENU":

                            bg_menu();

                            underline("JS Components", 106, 53, Text.Font, 1.5*Text.Size, color(255, 255, 255)); //title

                            break;

                        case "MENU2":

                            background(0, 255, 242);

                            break;

                        default:

                            background(0, 0, 0);

                            fill(Text.White);

                            textSize(Text.Size);

                            text("No panes exist here", 200, 200);

                    }

                };

                void draw() {

                    mouse_movement(); //tracks mouse speed

                    setCursor(ARROW); //resets cursor

                    check_gameState(); //draws background and performs gameState logic

                    draw_components(); //draws all panes and their components

                    if(pcursorState !== cursorState){ //updates cursor logic

                        updateCursor();

                        pcursorState = cursorState;

                    }

                    if(mousePressed){mouse = true;} //helps prevent problems with turning a component on without having clicked on it

                    else{mouse = false;} 

                };

		</script>

        <canvas id="sketch_components"></canvas>

        <p>Creating Processing.js components for use in other programs that require user interaction. You can try interacting with the components here.</p>
	</body>
</html>


Each particular component is stored in a `Pane` object: 

```javascript
// Pane constructor
var Pane = function(config){
    // in which state of our program will this pane be displayed?
    this.gameState = config.gameState || gameState;
    // like an HTML z-index
    this.n = config.n || 0;
    // are the components in this pane immune to user interactions?
    this.disabled = config.disabled || false;
    this.components = [];
};

// These prototype methods also are defined
Pane.prototype.add_component, 
Pane.prototype.draw, 
Pane.prototype.update;
```

And each component class inherits from the parent class `Component`:

```javascript
// Component constructor
var Component = function(config){
    // to which pane does this component belong
    this.pane = config.pane || 0;
    // type of component
    this.type = config.type || "";
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.w = config.w || 50;
    this.h = config.h || 50;
    this.fill = config.fill || Theme.FILL;
    this.outline = config.outline || Theme.OUTLINE;
    this.inputtext = (config.inputtext || "").toString();
    this.n = panes[this.pane];
};

// These prototype methods are also defined
Component.prototype.setText,
Component.prototype.setFill,
Component.prototype.setPane,
Component.prototype.move,
Component.prototype.checkPane,
Component.prototype.mouse_on_RECT,
Component.prototype.mouse_on_ELLIPSE,
Component.prototype.analyze, 
Component.prototype.return_value;
```

Perhaps a good example of the logic that occurs at the component-level is best exemplified in the `DropDown.prototype.update` method:

```javascript
// Update a DropDown instance
DropDown.prototype.update = function(){
    this.color_shift = 0;
    var on = false;
    // if mouse hovering over button
    if(this.mouse_on_RECT(this.x + (this.w - this.h)/2, this.y, this.h, this.h)){
        // enter hover mode
        this.hover();
        // if mouse depressed
        if(mouseIsPressed){
            on = true; 
            // if mouse newly pressed
            if(!mouse){ this.beginning = true; }}
    }
    // if displaying dropdown options
    if(this.open){
        // loop over displayed options
        DROP_HOVER:
        for(var i = 0; i < this.options.length; i ++){
            // if mouse hovering over an option
            if(this.mouse_on_RECT(this.x + this.offset, this.y + (i+1)*this.h, this.rw, this.h)){
                this.hover_index = i;
                setCursor(HAND);
                if(mouseIsPressed){ on = true; this.press(i); }
            }
        }
    }
    // react to click on dropdown button
    if(this.beginning){ this.press(); }
    if(mouseIsPressed && !on){ this.open = false; }
    // reset if no mouse pressing
    if(!mouseIsPressed){ 
        this.mouse = false; 
        this.beginning = false;
	}
    // update display value
    this.update_value();
    // reset button fill color
    this.button_fill = this.setFill(this.original_button_fill);
};
``` 


Each of the methods called throughout the routine runs some other logic or display instructions. Each component can be pretty complex to map out but works by a similar logic. 

The `draw` loop in this program handles the order of operations:

```javascript
var draw = function() {
    // track mouse position/speed
    mouse_movement(); 
    // reset the cursor to arrow pointer
    setCursor(ARROW); 
    // draws background and checks state of program
    check_gameState(); 
    // draws all panes and hence their components
    draw_components(); 
    // update to cursor
    if(pcursorState !== cursorState){
        updateCursor();
        pcursorState = cursorState;
    }
    // prevents turning on a component before having clicked
    if(mouseIsPressed){ mouse = true; }
    else{ mouse = false; } 
};
```


The core code in this program can be used in many situations, and certainly can help a new programmer to have a logical UI ready for their specific purpose. I made use of these components many times in subsequent programs myself. 

## Language and Intelligence: 
The purpose of my program [Language and Intelligence](https://www.khanacademy.org/computer-programming/language-and-intelligence/5590254555234304) was to demonstrate the entropy of languages. I was initially inspired by Brit Cruise's [A Mathematical Theory of Communication](https://www.youtube.com/watch?v=WyAtOqfCiBw), where he explains how Shannon entropy could be used to analyze the randomness of human language. I built a program which could perform high-order approximations to any language using some amount of example text from that language. 

For example, in the following (nonsensical) text in English: 

> Meant balls it if up doubt small purse. Required his you put the outlived answered position. An pleasure exertion if believed provided to. All led out world these music while asked. Paid mind even sons does he door no. Attended overcame repeated it is perceive marianne in. In am think on style child of. Servants moreover in sensible he it ye possible. Tolerably earnestly middleton extremely distrusts she boy now not.

we may count all instances of each letter, all instances of pairs of letters, triples, etc. You may notice that there are three instances of the pair `is`, two instances of `the`, and zero instances of `zsj`. What is the use in doing this counting? 

![Visual representation of Language and Intelligence use case: the relative probability distribution of each letter following the string "mo" in English according to an order 5 approximation of some sample English text.](/my_assets/images/language_and_intelligence.png)

Above is a screenshot of a typical use case of my program: it expresses that, out of the whole sample text that it received, the probabilities of finding each one-letter continuation of the string `mo`. You'll notice that, reasonably, `mor`, `moo`, and `mon` are the most likely continuations, while `moj`, `mox`, `moq` did not even register. Besides being a fun way to explore the normal patterns of the English language, there is a deeper amount of information we may glean from the observed frequencies. 

Shannon Entropy is an information-theoretic quantity used to quantify the degree of randomness or disorder across a probability distribution. If we consider the probability distribution of all $n$-tuples of English letters appearing in their natural frequency in written English, we may approximate the Shannon Entropy of the whole language. Simply fix an $n \geq 1$, compute the probabilities of each $n$-tuple of letters using some sample text, and plug in the probabilities into Shannon's equation:

$$
H(\text{English}) \approx - \sum_{w \text{---}n\text{-tuple}} \left(\operatorname{Prob}(w) \cdot \log_2 (\operatorname{Prob}(w))\right).
$$

This program is able to do this for any $n$, as well as a bit more: it can perform the analysis, display an interactive conditional probability chart for any starting sequence on what's the most likely way to continue the sequence by one character, generate random messages of text following the same probability distribution but possibly including fake yet realistic words of that language, as well as attempt to autocomplete someone typing in that language without cross-checking with a dictionary. 

For instance, when performing an $n = 5$-tuple approximation to English, my program generates the random message: 
> laundrywomen he xpresystem piqued ed here quired sion on oved sides jecting estrated gality ollectionishment iuolo ition icize decker ention ntly suppose erative ament ystifyingly shrieval uni oxide ltirewise termined ho xpedient a pleasure bers exercise hoal yrius us nfatigued haps rse beri fied on dent am ing aid azine glass she tron roperture ed orff ooms crated oopint ticreat ary enthronism id omise icatus rargyrius competing ne cher she egic istical onesian ettsville those cotypic usly attendent ark

Some of these outputs are real English, others convincingly English-like, and others nonsensical. This shows the power of harnessing patterns even without having access any rules about the language. I must say that this program was made well before large language models, and well before I was conscious of any AI models, so this was my baby step into thinking about generative models. 

I'm very proud of this program, and especially glad that Processing.js could make it so widely available on Khan Academy's Computer Science community. 

## Miscellaneous Animations
Here I've collected some extra animations that I wanted to at least show without going into much detail abou thow I did them. I'll let you think about it. You can always click on the links to the see the code and decipher my process, or try for yourself. 

### Aurora Borealis
I submitted this [Aurora](https://www.khanacademy.org/computer-programming/aurora/4515056076455936) program as part of a presentation in my AP Environmental Science class in high school. 

![Visual representation of my Aurora Borealis program](/my_assets/gifs/aurora.gif)

### Abelian Sandpile

An [Abelian Sandpile](https://sifter.ghost.io/ghost/Abelian%20Sandpilehttps://www.khanacademy.org/computer-programming/abelian-sandpile/5443228918677504) is a grid of values that resembles a sand pile in its dynamics: cells can only hold so much sand, passing on excess to their neighbors. The exact dynamics can be found [here](https://en.wikipedia.org/wiki/Abelian_sandpile_model). 

![Visual representation of the Abelian sandpile program](/my_assets/gifs/abelian2.gif)

### Recursive Art
I made [Recursive Art Project](https://www.khanacademy.org/computer-programming/recursive-art-project/6622841007767552) this to demonstrate some art with recursion. There are more animations in the original program. 

![Visual representation of my Recursive Art Project. The triangles represent a construction of the Sierpinski triangle, and the other graphic is something I thought of myself.](/my_assets/gifs/recursive-3--1-.gif)

### Fourier Circle Approximations
[Fourier Circles](https://www.khanacademy.org/computer-programming/complex-fourier-circles/5042446860648448) can be used to approximate any curve in the plane. I tried my hand at coding the required algorithm to make it approximate a few shapes like a Heart!

![Visual representation of my Fourier Circles program tracing out the outline of a heart](/my_assets/gifs/fourier.gif)

## Algorithms

### Regression with Genetic Algorithms
I was able to approach a standard math problem of polynomial regression via [Genetic Algorithms](https://www.khanacademy.org/computer-programming/linear-regression-by-population-genetics/4892400913). The program cycles through multiple generations of polynomials which attempt to approximate a standard polynomial whose outputs we can access but whose exact generating formula we cannot. New generations represent lightly-mutated offspring of the fittest individuals from the previous generation. Fitness is measured by minimizing the measure of difference between the individual and the reference polynomial. 

![Visual representation of the process of evaluating a generation in the Regression with Genetic Algorithms program.](/my_assets/gifs/linear-regression-genetic-algori.gif)

The key method to this is how the `Organism` class reproduces from two previous instances of the `Organism` class. There will be use of some hyper-parameters. 

```javascript
// Reproduce two given Organisms into new Organism
Organism.reproduce = function(A, B) {
    // list of coefficients for x^i
    var a = {}; 
    // maxPower computed by by A and B
    var maxPower = Math.max(A.maxPower, B.maxPower);
    // who passes on their coefficient genes
    var winner = (random() < 0.5) ? A : B;
    // build new coefficient genes for child
    for(var i = 0; i < maxPower; i ++) {
        a[i] = (Math.random() <= PROBABILITY_OF_MUTATION_COEFFICIENT) ?
				winner.a[i] : 
				map(Math.random(), 0, 1, COEFFICIENT_RANGE[0], COEFFICIENT_RANGE[1]);
    }
    // keep adding coefficients for higher powers with low probability
    while(Math.random() <= PROBABILITY_OF_MUTATION_NEXTPOWER) {
        a[maxPower++] = map(Math.random(), 0, 1, COEFFICIENT_RANGE[0], COEFFICIENT_RANGE[1]);
    }
    // produce child Organism
    return new Organism({
        generation: winner.generation + 1,
        color: color(hue(winner.color + 0.10 * (Math.random() * 2 - 1) * (255)), saturation(winner.color), brightness(winner.color)),
        a: a,
        maxPower: maxPower,
        parent: [A, B]
    });
};
```


This actually works pretty well, and there are plenty more opportunities to explore genetic algorithms more useful than this. 

### Extending the Numeric System

I had the idea to push the numeric system of the language past its limits. This program: [Extending the Positive Integers](https://www.khanacademy.org/computer-programming/extending-the-positive-integers/4966391630921728), aimed to provide the ability to perform mathematical operations on numbers much bigger than the typical constraints of Processing.js. 

In Processing, `int` represents the datatype for integers. Integers can be as large as $2^{31} - 1 = 2,147,483,647$ and as low as $-2^{31} = -2,147,483,648$. They are stored as 32 bits of information. With the GIF as my witness, my program is able to compute with numbers larger than $2^{80} = 1,208,925,819,614,629,174,706,176$, over 100 trillion times larger. What explains this difference in capabilities?

![Visual representation of my Extending the Positive Integers program: evaluating various computations with large ingredient numbers](/my_assets/gifs/long_numbers.gif)

Rather than being stored as the primitive data types `int`, these numbers are stored as `string` data containing binary representations in order to perform many basic calculations. I wrote original algorithms for how to perform computations on binary representations stored as `strings` and then convert back into decimal. We store the data in an `INT` object as follows:

```javascript
// INT object constructor
var INT = function(integer, base, conversion) {
    if(base === 2) {
        // remove leading zeros
        this.B2 = INT.simplifyString(str(integer));
        // bother performing conversion to base 10?
        if(conversion || conversion === undefined) { 
            this.to10(); 
        } else { this.B10 = "0"; } 
    } else { 
        this.B10 = INT.simplifyString(str(integer)); 
        if(conversion || conversion === undefined) { 
            this.to2(); 
        } else { this.B2 = "0"; }
    }
};
```

The program assumes non-negative integers. Addition works according to the two methods:

```javascript
// add any number of INT instances
INT.ADD = function() {
    if(arguments.length === 0) { return undefined; }
    var SUM = arguments[0].copy();
    // sum the binary forms
    for(var i = 1; i < arguments.length; i ++) {
        SUM.set(INT.addBinaryString(SUM.B2, arguments[i].B2), 2, false);
    }   
    // compute its decimal form
    SUM.update(10);
    return SUM;
};
// add some number of INTs' binary forms
INT.addBinaryString = function() {
    // unpack argument[0] if array
    var args = (Array.isArray(arguments[0])) ? arguments[0] : arguments;
    switch(args.length) {
        case 0: return 0;
        case 1: return args[0].copy();
        case 2: 
            var SUM = "", sum, next = 0, 
				length = Math.max(INT.simplifyString(args[0]).length, INT.simplifyString(args[1]).length);
            // for all bits in summands
            for( var i = 0; i <= length; i ++ ) {
                // sum bits, possibly carry 1 from previous bits
                sum = parseInt(next, 2) +
                      INT.getDigit(INT.simplifyString(args[0]), i, 2) + 
                      INT.getDigit(INT.simplifyString(args[1]), i, 2) ;
                next = 0;
                if(sum > 1) { sum %= 2; next ++; }
                SUM = str(sum) + SUM;
            }
            return INT.simplifyString(SUM); 
        // when more than two summands
        default:
            var SUM = INT.simplifyString(args[0]);
            for( var i = 1; i < args.length; i ++ ) {
                SUM = INT.addBinaryString(SUM, INT.simplifyString(args[i]));
            }
            return INT.simplifyString(SUM);
    }
};
```


There are many other methods worked out in this program, like for subtraction, multiplication, division, exponentiation, tetration, modular arithmetic, comparison, etc. The hardest was to interpret a written mathematical expression from the user into an executable sequence of instructions. All of that is summarized in `INT.interpret`:

```javascript
// evaluate expression E as mathematical set of instructions
INT.interpret = function(E) {
    // preparation for interpretation for whitespace
    E = E.replace(/ /g,''); E = E.replace(/\n/g, '');
    if(E.length === 0) { return ""; }
    // ignore leading operations
    if("^*/+-%(".contains(E.charAt(E.length - 1))) {
        return INT.interpret(E.substring(0, E.length - 1));
    }
    // ignore any expression outside our alphabet
    for(var i = 0; i < E.length; i ++) {
        if(!"^+-*/0123456789()% \n".contains(E.charAt(i))) {
            return "";
        }
    }
    // recursion on parenthesis
    var invar, i0, i;
    while(E.indexOf("(") > -1) {
        invar = 1; i0 = E.indexOf("("); i = i0 + 1;
        while(invar !== 0 && i++ < E.length) {
            switch(E.charAt(i)) {
                case "(": invar ++; break;
                case ")": invar --; break; default: 
            }
        }  
        if(invar !== 0) { return ""; }
        E = E.substring(0, i0) + this.interpret(E.substring(i0 + 1, i)) + E.substring(i + 1);
    }
    // generate INTs found in expression
    var numbers = [];
    var answer = "", startNum, endNum;
    ESTABLISH_INTS:
    for(var i = 0; i < E.length; i ++) {
        // continue building the number
        if("0123456789".contains(E.charAt(i))) {
            if(startNum === undefined) { 
                startNum = i; endNum = i; 
            } else { endNum ++; }
            if(i === E.length - 1) { 
                numbers.push(new INT("" + E.substring(startNum), base)); 
                E = E.substring(0, startNum); 
            }
        } else {
            numbers.push(new INT(E.substring(startNum, endNum + 1), base));
            E = E.substring(0, startNum) + E.substring(endNum + 1); i -= 1 + endNum - startNum;
            startNum = undefined;
        }
    }
    
    // prioritize exponentiation first
    EX:
    for(var i = 0; i < E.length; i ++) {
        switch(E.charAt(i)) {
            case '^': 
                numbers[i] = INT.POW(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
                break;
        }
    }
    
    // multiplication, division, and modular division all at same priority level
    MMD: 
    for(var i = 0; i < E.length; i ++) {
        SWITCH:
        switch(E.charAt(i)) {
            case '*': 
                numbers[i] = INT.MULT(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
                break SWITCH;
            case '/':
                numbers[i] = INT.DIV(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
                break SWITCH;
            case '%':
                numbers[i] = INT.MOD(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
                break SWITCH;
        }
    }
    
    // addition and subtraction share the lowest priority
    AS:
    for(var i = 0; i < E.length; i ++) {
        switch(E.charAt(i)) {
            case '+': 
                numbers[i] = INT.ADD(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
                break;
            case '-':
                numbers[i] = INT.SUB(numbers[i], numbers[i + 1]);
                numbers.splice(i + 1, 1);
                E = E.substring(0, i) + E.substring(i + 1);
                i --;
        }
    }
    return (base === 2)? numbers[0].B2 : numbers[0].B10;
};
```


The idea behind this program was simple, it was just a complicated set of methods to implement to perform all of the conversions and operations that I needed from a useful calculator. 

## Appendix
There were many helper functions I made use of throughout my programs. Some of them had to do with the `PVector` class, which can store vectors in the form of objects with `.x`, `.y`, and `.z` properties storing information in the $x$, $y$, and $z$ coordinates, respectively: 

```javascript
// cap the magnitude of this PVector to `cap`
PVector.prototype.capMag = function(cap) {
    this.mult(Math.min(cap, this.mag()) / this.mag());
};
// @static; perform the dot product between two 3D PVectors
PVector.dot = function(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
};
// @static; perform the cross product between two 3D PVectors
PVector.cross = function(u, v) {
    return new PVector(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
};
// @static; transform a PVector by a scale and translation
PVector.transform = function(vector, scalar, translator) {
    return PVector.add(translator, PVector.mult(vector, scalar));
};
// @static; fill in a 3D PVector with the outputs of some function `f`
PVector.construct = function(f) {
    return new PVector( f(), f(), f() );
};
// @static; Interpolate between two PVectors assuming t between 0 and 1
PVector.map = function(t, A, B) {
    return new PVector( map(t, 0, 1, A.x, B.x), map(t, 0, 1, A.y, B.y), map(t, 0, 1, A.z, B.z) );
};
// @static; Project PVector v onto plane given by normal PVector n
PVector.proj = function(v, n) { 
    return PVector.sub( v, PVector.mult(n, PVector.dot(v, n)) );
};
```


Others had to do with the generic `Object` class from which all objects implicitly inherit:

```javascript
// set a default value for a property if not already set
Object.prototype.q = function(property, defaultVal) {
    return (this[property] === undefined) ? defaultVal : this[property];
};
// recursively copy an object
Object.prototype.copy = function() {
    var obj = {};
    // if array
    if(Array.isArray(this)) { 
        obj.length = this.length; 
    }
    // for all keys
    for(var k in this) {
        obj[k] = 
            // recursive call or pass by value
			(typeof(this[k]) === 'object') ?
			this[k].copy() : this[k];
    }
    return obj;
};
```


Others had to do with the `Array` class, in which every instance has a `length` property:

```javascript
// @static; remove the element at given index
Array.remove = function(array, index) {
    array.splice(index, 1);
    return array;
};
// find first instance of e in array
Array.prototype.find = function(e) {
    for(var i = 0; i < this.length; i ++) {
        if(this[i] === e) { return i; }
    }   return -1;
};
// @static; remove the first instance of element e from array
Array.removeElement = function(array, e) {
    return Array.remove(array, array.find(e));
};
// return string assuming is 2D array
Array.prototype.toString2 = function() {
    var string = "[";
    for(var i = 0; i < this.length; i ++) {
        string += "[";
        for(var j = 0; j < this[i].length; j ++) {
            string += this[i][j] + ",";
        }
        string = string.substring(0, string.length - 1) + "],";
    }
    return string.substring(0, string.length - 1) + "]";
};
// find [i][j] index pair for element e in 2D array
Array.prototype.find2D = function(e) {
    for(var i = 0; i < this.length; i ++) {
        for(var j = 0; j < this.length; j ++) {
            if(this[i][j] === e) { return [i, j]; }
        }
    }
    return [-1, -1];
};
// @static; given equality method `equals` between Objects e, find object e
Array.prototype.findObj = function(e) {
    for(var i = 0; i < this.length; i ++) {
        if(equals(this[i], e)) { return i; }
    }   return -1;
};
// @static; remove duplicates from 1D array of Objects assuming given equality method `equals` between such Objects
Array.removeDuplicates = function(array) {
    var tempArray = [], temp;
    OUTER:
    for(var i = 0; i < array.length; i ++) {
        temp = array[i];
        for(var j = 0; j < tempArray.length; j ++) {
            if(equals(tempArray[j], temp)) {
                continue OUTER;  
            }
        }
        tempArray.push(temp);
    }
    return tempArray;
};
// copy 1D array assuming not storing arrays/objects to be passed by value
Array.prototype.shallowCopy = function() {
    var temp = [];
    for(var i = 0; i < this.length; i ++) {
        temp[i] = this[i];
    }
    return temp;
};
```

## Conclusion
I hope you can glean from this large summary of my work using Processing.js on Khan Academy that Projecessing.js is a fantastic option for beginner/intermediate programmers to learn visual and CS skills that appear in more advanced programming languages and programming tasks. 

Please let me know if you have any questions! You can always find my programs [here](https://www.khanacademy.org/profile/kaid_952911577858513019620187/projects) complete with the source codes and outputs. 