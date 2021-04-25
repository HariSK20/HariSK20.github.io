var origin;
var canvas;

var angle;
let count = 500;
let rings = 10;
var entry = 700;
let black_hole_mass = 3000;
let schwarzschild_r = 1.5;
//angleMode(DEGREES);
function set_origin() {
//    origin = createVector(2*windowWidth/3, 2*windowHeight/3);
    origin = createVector(windowWidth/2, windowHeight/2);
	angle = windowWidth/windowHeight;
	// console.log(windowHeight);
	// console.log(windowWidth);
}

class ball
{
	constructor(x, y, m, r)
	{
		this.original_pos = createVector(x, y);
		this.position = createVector(x, y);
		this.mass = m;
		this.radius = r;
		this.velocity = createVector(0, 0);
	}
	update()
	{
		this.position.add(this.velocity);
	}
	show()
	{
		this.update();
		fill(155, 255, 255);
//		ellipse(origin.x, origin.y, 10);
//		console.log("printsed");
		//noStroke();
		//stroke(200);
		fill(256*(this.velocity.mag()/20), 10, 128*(20/this.velocity.mag()));
//		console.log("pp = ", this.position);
//		let shear_factor = 1 / tan(angle);
//  		applyMatrix(1, 0, 0, 1, 1*(mouseX - origin.x)/origin.x, -0.5*(origin.y - mouseY)/origin.y);
		if(mouseX > 0 && mouseX <= windowWidth && mouseY > 0 && mouseY < windowHeight)
	  		applyMatrix(1, 0, 0, 1, 1*(mouseX - origin.x)/origin.x + 0.05*rotationX, -0.5*(origin.y - mouseY)/origin.y + 0.05*rotationY );
		else
			resetMatrix();
		if(dist(this.position.x, this.position.y, 0, 0)>schwarzschild_r*this.radius)
			ellipse(origin.x + this.position.x, origin.y - this.position.y, this.radius*2);
//		ellipse(origin.x + this.position.x, origin.y - this.position.y, this.radius*2*(this.position.mag()/this.original_pos.mag()));
	}
}

class mover extends ball
{
	constructor(x, y, m, r)
	{
		super(x, y, m, r);
	}
	initial_velocity(x, y)
	{
		this.init_vel = createVector(x, y);
		this.velocity = createVector(x, y);
	}
	attract(m)
	{
		var r = dist(this.position.x, this.position.y, m.position.x, m.position.y);
		if(r <= 7*this.radius && m instanceof attractor)
		{
			this.position = this.original_pos;
			this.velocity = this.init_vel;
		}
		else
		{	
			let magnitude = gravity*(this.mass * m.mass)/(r ** 2);
			let direction = createVector(m.position.x - this.position.x, m.position.y - this.position.y);
			direction.normalize();
			let force = direction.mult(magnitude);
	//		console.log(r);
			force.limit(-100, 100)
			this.velocity.limit(-20, 20)
	//		console.log(magnitude);
			this.velocity.add(force);
		}
	}

	// update()
	// {
	// }
}

class attractor extends ball
{
	constructor(x, y, m, r)
	{
		super(x, y, m, r);
	}
}

var mic;
//let origin;
var b;
var a;
let gravity = 10;
//let start_radius = 40;

function get_random(min, max)
{
	return(Math.floor(Math.random() * (max - min)) + min);
}

function windowResized() {
  //console.log('resized');
  	resizeCanvas(windowWidth, windowHeight);
	set_origin();
}
var ct = 0;
function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	set_origin();
	let q = min(windowHeight, windowWidth);
	entry = 2*q/3;
	rings = ceil(q/(4*30));
	count = windowHeight>windowWidth? 10*rings : 20*rings;
	console.log(count, rings);
//	console.log(angle);
//	console.log(origin);
  	canvas.position(0, 0);
  	canvas.style('z-index', '-1');
    b = new Array();
	for(var i=0; i<rings; i++)
	{
		for(var theta=0; theta<TWO_PI; theta = theta+TWO_PI/(count/rings))
		{
//		var theta = TWO_PI;
			let rad = get_random(10, 30);
			let x = Math.floor((i+2)*entry*cos(theta)/rings);
			let y = Math.floor((i+2)*entry*sin(theta)/rings);
//			console.log(x, y);
			let vel = createVector(x, y).normalize().rotate(HALF_PI).mult(Math.floor(Math.sqrt((gravity * black_hole_mass)/((i+2)*entry/rings)))*0.91);
			let test_vector = vel.cross(createVector(x, y))
			if(test_vector.z <= 0)
				vel = vel.rotate(PI);
			b[ct] = new mover(x, y, 1, rad);
			b[ct].initial_velocity(vel.x, vel.y);
//			console.log(ct);
			ct++;
//			console.log("theta = ", theta);
		}
		if(ct >= count)
			break;
	}
	a = new attractor(0, 0, black_hole_mass, 10);

	  // mic = new p5.AudioIn();
  	// mic.start();
  	background(0);
}
function draw() 
{
    background(0);
    a.show();
    for(var i=0; i<ct; i++)
    {
        b[i].attract(a);
        b[i].show();
    }
}
    