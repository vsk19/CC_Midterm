// Data retrieved from the CDC: https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36

let cdc_array;
let easing = 0.05;

let displaying_info = false;

// this will scale down the circles 
// num_deaths * scale_factor = size
let scale_factor = 0.1;

// stores all StateCircle objects
let circle_array = [];
let current_date_ind = 4;
let first_run = true;

// red, yellow, turquoise, green
let color_array = [[238, 66, 102], [255, 210, 63], [59, 206, 172], [14, 173, 105]]
let bg_color = color_array[0];

// each state is assigned a number (used for array indexing)
let state_dict = {
	"AL" : 0,
	"AK" : 1,
	"AZ" : 2,
	"AR" : 3,
	"CA" : 4,
	"CO" : 5,
	"CT" : 6,
	"DE" : 7,
	"FL" : 8,
	"GA" : 9,
	"HI" : 10,
	"ID" : 11,
	"IL" : 12,
	"IN" : 13,
	"IA" : 14,
	"KS" : 15,
	"KY" : 16,
	"LA" : 17,
	"ME" : 18,
	"MD" : 19,
	"MA" : 20,
	"MI" : 21,
	"MN" : 22,
	"MS" : 23,
	"MO" : 24,
	"MT" : 25,
	"NE" : 26,
	"NV" : 27,
	"NH" : 28,
	"NJ" : 29,
	"NM" : 30,
	"NY" : 31,
	"NC" : 32,
	"ND" : 33,
	"OH" : 34,
	"OK" : 35,
	"OR" : 36,
	"PA" : 37,
	"RI" : 38,
	"SC" : 39,
	"SD" : 40,
	"TN" : 41,
	"TX" : 42,
	"UT" : 43,
	"VT" : 44,
	"VA" : 45,
	"WA" : 46,
	"WV" : 47,
	"WI" : 48,
	"WY" : 49,
	"GU" : 50,	// Guam
	"VI" : 51	// Virgin Islands
};

// Each month+year date is assigned an array index
let date_dict = {
	"2020-01" : 0,
	"2020-02" : 1,
	"2020-03" : 2,
	"2020-04" : 3,
	"2020-05" : 4,
	"2020-06" : 5,
	"2020-07" : 6,
	"2020-08" : 7,
	"2020-09" : 8,
	"2020-10" : 9,
	"2020-11" : 10,
	"2020-12" : 11,
	"2021-01" : 12,
	"2021-02" : 13,
	"2021-03" : 14,
	"2021-04" : 15,
	"2021-05" : 16,
	"2021-06" : 17,
	"2021-07" : 18,
	"2021-08" : 19,
	"2021-09" : 20,
	"2021-10" : 21,
	"2021-11" : 22,
	"2021-12" : 23,
};

// Circle that represents the # of deaths for a state 
class StateCircle {

	constructor (state_ind, pos_x, pos_y) {
		this.state_ind = state_ind
		this.name = state_dict[state_ind];
		this.num_deaths = cdc_array[current_date_ind][state_ind] * scale_factor;
		this.pos_x = pos_x;
		this.pos_y = pos_y;

		// where the circle should be moving to
		// intially same as beginning position
		this.move_x = pos_x;
		this.move_y = pos_y;

		this.changeHue();
	}

	// display circle at location
	show () {
		fill(this.hue);
		ellipse(this.pos_x, this.pos_y, this.num_deaths);
	}

	// selects random color from predefined array of color options
	changeHue () {
		let color_ind = int(random(0, 3));
		this.hue = color(color_array[color_ind][0], color_array[color_ind][1], color_array[color_ind][2], 150)
	}

	// change size of the circle based on number of deaths
	changeSize () { 
		console.log(current_date_ind);
		console.log(this.state_ind);
		this.num_deaths = cdc_array[current_date_ind][this.state_ind] * scale_factor;
	}

	// assign new location for the circle to travel towards
	changeLocation (new_x, new_y) {
		this.move_x = new_x;
		this.move_y = new_y;
	}
	
	// uses p5.js example easing function: https://p5js.org/examples/input-easing.html
	move () {
		
		if (this.move_x != this.pos_x) {
			let target_x = this.move_x;
			let dx = target_x - this.pos_x;
			this.pos_x += dx * easing;
		}
		
		if (this.move_y != this.pos_y) {
			let target_y = this.move_y;
			let dy = target_y - this.pos_y;
			this.pos_y += dy * easing;
		}
	}

}

// Pop up window that displays CDC data used for visualization
class InfoBox {

	constructor() {
		this.pos_x = width/2 - 200;
		this.pos_y = height/2 - 250;

		// look up date from index number
		this.reverse_date_dict = {
			0: "Jan 2020",
			1: "Feb 2020",
			2: "Mar 2020",
			3: "Apr 2020",
			4: "May 2020",
			5: "Jun 2020",
			6: "Jul 2020",
			7: "Aug 2020",
			8: "Sep 2020",
			9: "Oct 2020",
			10: "Nov 2020",
			11: "Dec 2020",
			12: "Jan 2021",
			13: "Feb 2021",
			14: "Mar 2021",
			15: "Apr 2021",
			16: "May 2021",
			17: "Jun 2021",
			18: "Jul 2021",
			19: "Aug 2021",
			20: "Sep 2021",
			21: "Oct 2021",
			22: "Nov 2021",
			23: "Dec 2021",
		};

		// look up state from index
		this.reverse_state_dict = {
			0: "AL",
			1: "AK",
			2: "AZ",
			3: "AR",
			4: "CA",
			5: "CO",
			6: "CT",
			7: "DE",
			8: "FL",
			9: "GA",
			10: "HI",
			11: "ID",
			12: "IL",
			13: "IN",
			14: "IA",
			15: "KS",
			16: "KY",
			17: "LA",
			18: "ME",
			19: "MD",
			20: "MA",
			21: "MI",
			22: "MN",
			23: "MS",
			24: "MO",
			25: "MT",
			26: "NE",
			27: "NV",
			28: "NH",
			29: "NJ",
			30: "NM",
			31: "NY",
			32: "NC",
			33: "ND",
			34: "OH",
			35: "OK",
			36: "OR",
			37: "PA",
			38: "RI",
			39: "SC",
			40: "SD",
			41: "TN",
			42: "TX",
			43: "UT",
			44: "VT",
			45: "VA",
			46: "WA",
			47: "WV",
			48: "WI",
			49: "WY",
			50: "GU",	// Guam
			51: "VI"	// Virgin Islands
		};
	}

	display () {
		fill(255, 255, 255, 180);
		rect(this.pos_x, this.pos_y, 400, 470, 20);
		rect(this.pos_x, this.pos_y + 490, 400, 140, 20);

		console.log(date_dict[current_date_ind])
		
		let title = "Total number of COVID-19 deaths \nin each state by " + String(this.reverse_date_dict[current_date_ind]);
		fill(0, 0, 0);
		text(title, this.pos_x + 20, this.pos_y + 30);
		textSize(16);

		let disclaimer = "Source: https://data.cdc.gov/Case-Surveillance/\nUnited-States-COVID-19-Cases-and-Deaths-by-\nState-o/9mfq-cb36\nNote: some data may be incomplete. \n'NY' refers to deaths outside NYC."
		text(disclaimer, this.pos_x + 20, this.pos_y + 520);

		let directions = "Click 'info' again to exit";
		text(directions, this.pos_x + 210, this.pos_y + 450);

		let text_pos_x = this.pos_x + 50;
		let text_pos_y = this.pos_y + 90;
		let data_array = cdc_array[current_date_ind];
		for (let state_ind = 0; state_ind < 52; state_ind++) {
			
			num_deaths = data_array[state_ind];
			text(this.reverse_state_dict[state_ind] + ": " + String(num_deaths), text_pos_x, text_pos_y)
			
			if ((state_ind !=0) && (state_ind % 17 == 0)) {
				text_pos_y = this.pos_y + 90;
				text_pos_x += 120;
			} else {
				text_pos_y += 20;
			}
			
		}

	}

}

// grab COVID deaths over time by state from the CDC
let cdc_data = fetch('https://data.cdc.gov/resource/9mfq-cb36.json')	// fetching json data
	.then(response => response.json())	// wait till resolved then json-ify the response
	.then(result => result)
	.then(data => {
		cdc_array = getCDCdata(data);
		return data;
	})
	.catch((err) => {console.log(err)});

function getCDCdata(data) {
	
	let data_array = new Array(24);

	// make empty 2D array
	for (let date = 0; date < 24; date++) {
		data_array[date] = []
		for (let state = 0; state < 52; state++) {
			data_array[date][state] = 0;
		}
	}

	// Structure of 2D array:
	//				AL			AK			AZ		...
	//	Jan-2020	0			10			200
	//	Feb-2020	0			20			500	
	//  March-2020	100			500			300
	//	.
	//	. 
	//  .	

	// fill in 2D array with real data
	for (let i = 0; i < data.length; i++) {
		
		let date_index = date_dict[data[i].submission_date.substring(0, 7)];
		let state_index = state_dict[data[i].state];
		
		// only replace # of deaths for this month 
		// if this date's # of deaths is more than the # of dates already in the array
		// goal: get the largest # of total deaths in each month per state
		num_deaths = data[i].tot_death
		if (num_deaths > data_array[date_index][state_index]) {
			data_array[date_index][state_index] = num_deaths
		}
	}
	// console.log(data_array)

	return data_array;
}

function setup() {
	createCanvas(1000, 800);
	noStroke();

	// user can press to change date of COVID data
	shuffle_button = createButton('shuffle');
	shuffle_button.position(0.9*width, 0.95*height);
	shuffle_button.mousePressed(buttonPressed)

	// user can press to see summary screen of data
	info_button = createButton('info');
	info_button.position(0.95*width, 0.95*height);
	info_button.mousePressed(displayInfo);

	info_box = new InfoBox();

}

function draw() {
	background(1);

	// check that data was successfully obtained 
	// from CDC before continuing
	if (cdc_array != undefined) {
		
		if (first_run) {
			generateCircles();
			first_run = false;
		}
		
		for (const state_circle of circle_array) {
			state_circle.move();
			state_circle.show();
		}

	}

	// displays underlying data if user has pressed the "info" button
	if (displaying_info) {
		info_box.display();
	}
	
}

// received one row of the CDC data and generates 
// StateCircle objects at a random position
function generateCircles () {

	// get one row of the CDC data and plot circles for each state based on # of COVID deaths
	for (let state_ind = 0; state_ind < 52; state_ind++) {

		xpos = random(0, width);
		ypos = random(0, height);

		circle_array.push(new StateCircle(state_ind, xpos, ypos));
	}

}

// change each state circle: 
// - assign new size (based on # of deaths at a random time point)
// - new random color 
// - move to random location
// change background color
function buttonPressed() {

	// pick random time point
	current_date_ind = int(random(0, 23));

	for (const state_circle of circle_array) {
		state_circle.changeHue();
		state_circle.changeLocation(random(0, width), random(0, height));
		state_circle.changeSize();
	}

	// changes the background color
	let color_ind = int(random(0, 3));
	bg_color = color(color_array[color_ind][0], color_array[color_ind][1], color_array[color_ind][2], 100)
	
}

// toggles the information display on and off upon button press
function displayInfo() {

	displaying_info = !displaying_info;
	

}