var game = {
	score: 0,
	totalScore: 0,
	totalClicks: 0,
	clickValue: 1,
	version: 0.000,
	
	addToScore: function(amount) {
		this.score += amount;
		this.totalScore += amount;
		display.updateScore();
	},
	
	getScorePerSecond: function() {
		var scorePerSecond = 0;
		for (i = 0; i < building.name.length; i++) {
			scorePerSecond += building.income[i] * building.count[i];
		}
		return scorePerSecond;
	}
};

var building = {
	name: [
		"Researcher",
		"Security Guard",
		"Epsilon-11 Soldier"
	],
	image: [
		"clipboard.jpg",
		"pistol.jpg",
		"epsilon-11.jpg"
	],
	count: [0, 0, 0],
	income: [
		1,
		5,
		10
	],
	cost: [
		15,
		100,
		500
	],
	
	purchase: function(index) {
		if (game.score >= this.cost[index]) {
			game.score -= this.cost[index];
			this.count[index]++;
			this.cost[index] = Math.ceil(this.cost[index] * 1.10);
			display.updateScore(); 
			display.updateShop();
		}
	}
};

var display = {
	updateScore: function() {
		document.getElementById("score").innerHTML = game.score;
		document.getElementById("scorepersecond").innerHTML = game.getScorePerSecond();
		document.title = game.score + " money - SCP Clicker";
	},
	
	updateShop: function() {
		document.getElementById("shopContainer").innerHTML = "";
		for (i = 0; i < building.name.length; i++) {
			document.getElementById("shopContainer").innerHTML += '<table class="shopButton" onclick="building.purchase('+i+')"><tr><td id="image"><img src="images/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> money</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>';
		}
	}
};

function saveGame() {
	var gameSave = {
		score: game.score,
		totalScore: game.totalScore,
		totalClicks: game.totalClicks,
		clickValue: game.clickValue,
		version: game.version,
		buildingCount: building.count,
		buildingIncome: building.income,
		buildingCost: building.cost
	};
	localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame () {
	var savedGame = JSON.parse(localStorage.getItem("gameSave"));
	if (localStorage.getItem("gameSave") !== null) {
		if (typeof savedGame.score !== "undefined") game.score = savedGame.score;
		if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
		if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
		if (typeof savedGame.buildingCount !== "undefined") {
			for (i = 0; i < savedGame.buildingCount.length; i++) {
				building.count[i] = savedGame.buildingCount[i];
			}
		}
		
		if (typeof savedGame.buildingCount !== "undefined") {
			for (i = 0; i < savedGame.buildingCount.length; i++) {
				building.count[i] = savedGame.buildingCount[i];
			}
		}
		
		if (typeof savedGame.buildingIncome !== "undefined") {
			for (i = 0; i < savedGame.buildingIncome.length; i++) {
				building.income[i] = savedGame.buildingIncome[i];
			}
		}
		
		if (typeof savedGame.buildingCost !== "undefined") {
			for (i = 0; i < savedGame.buildingCost.length; i++) {
				building.cost[i] = savedGame.buildingCost[i];
			}
		}
	}
}

function resetGame() {
	if (confirm("Are you sure you want to reset your game")) {
		var gameSave = {};
		localStorage.setItem("gameSave", JSON.stringify(gameSave));
		location.reload();
	}
}

window.onload = function() {
	loadGame();
	display.updateScore();
	display.updateShop();
};

setInterval(function() {
	game.score += game.getScorePerSecond();
	game.totalScore += game.getScorePerSecond();
	display.updateScore();
}, 1000); // 1000 ms = 1 second

setInterval(function() {
	saveGame();
}, 30000); // 30000 ms = 30 seconds

document.addEventListener("keydown", function(event) {
	if (event.ctrlKey && event.which == 0.3) { // ctrl + a
		event.preventDefault();
		saveGame();
	}
}, false);