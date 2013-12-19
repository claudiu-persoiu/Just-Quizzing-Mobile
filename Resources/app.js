/**
 * Copyright (c) 2013 Claudiu Persoiu (http://www.claudiupersoiu.ro/)
 *
 * This file is part of "Just quizzing - Mobile application".
 *
 * Official project page: http://blog.claudiupersoiu.ro/just-quizzing/
 *
 * You can download the latest version from https://github.com/claudiu-persoiu/Just-Quizzing
 *
 * "Just quizzing" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Just quizzing is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

Ti.include('helper.js');

var win = Ti.UI.createWindow({
	backgroundColor: "#ffffff",
	title: "Just Quizzing",
	navBarHidden: false,
	width: Ti.Platform.displayCaps.platformWidth,
	top: 0,
	exitOnClose : true
});

var menuViewWidth = 200;

var menuView = Ti.UI.createTableView({
	data: [
		{title: L('start'), action: 'start', font: {fontSize: '24sp'}, color: 'black', separatorColor: 'black', height: '56dp'},
		{title: L('import_new'), action: 'import', font: {fontSize: '24sp'}, color: 'black', borderColor: 'black', height: '56dp'},
		{title: L('update'), action: 'update', font: {fontSize: '24sp'}, color: 'black', borderColor: 'black', height: '56dp'},
		{title: L('manage_quizzes'), action: 'manage', font: {fontSize: '24sp'}, color: 'black', borderColor: 'black', height: '56dp'},
		{title: L('about'), action: 'about', font: {fontSize: '24sp'}, color: 'black', borderColor: 'black', height: '56dp'},
	],
	backgroundColor: "white",
	width: menuViewWidth + 'dp',
	barSize: 2,
	separatorColor: "#efefef",
	borderColor: "#efefef",
	borderWidth: 1,
	left: 0
});

var db = Ti.Database.open('quizzingStorage');

menuView.addEventListener('click', function (e) {
	
	// reset interval if present
	if(timerHandler) {
		clearInterval(timerHandler);	
	}
	
	var currentQuiz = quizObject.getCurrent();
	
	switch(e.rowData.action) {
		case 'start':
			if(!currentQuiz) {
				form.add();
				break;
			}
			quizObject.reset();
			startQuiz();
			break;
		case 'import':
			form.add();
			break;
		case 'update':
			if(!currentQuiz) {
				form.add();
				break;
			}
			updateQuiz();
			break;
		case 'manage':
			if(!currentQuiz) {
				form.add();
				break;
			}
			var manage = require('/ui/manage');
			manage.show();
			break;
		case 'about':
			var about = require('/ui/about');
			about.show();
			break;
	}
	
	if (Ti.Platform.osname === "android") {
		view.left = 0;
	} else if(Ti.Platform.osname === "iphone") {
		mainView.animate(animateRight);
	}
	
	toggle = false;
});

var toggle = false;

var view;

var overlay;

// for Android we should add an action bar
var actionBar;

var toggleMenu = function () {
      	
	var animOpen = Ti.UI.createAnimation({
        left: dpToPx(menuViewWidth),
        duration: 300
    });
    
    var animClose = Ti.UI.createAnimation({
        left: 0,
        duration: 300
    });
	
	if(!toggle) {
		if(Ti.Platform.osname === 'iphone') {
			mainView.animate(animateLeft);
		} else {
			mainView.animate(animOpen);		
		}
		
		toggle = true;
	} else {
		if(Ti.Platform.osname === 'iphone') {
			mainView.animate(animateRight);
		} else {
			mainView.animate(animClose);		
		}
		toggle = false;
	}

};

win.add(menuView);

var mainView = Ti.UI.createView({
	width: Ti.Platform.displayCaps.platformWidth,
	backgroundColor: "white",
	transform: Ti.UI.create2DMatrix()
});

win.addEventListener("open", function() {
    if (Ti.Platform.osname === "android") {
        if (! win.activity) {
            Ti.API.error("Can't access action bar on a lightweight window.");
        } else {
            actionBar = win.activity.actionBar;
            
            if (actionBar) {
            	
                actionBar.title = "Just Quizzing";
                actionBar.displayHomeAsUp = false;
                actionBar.onHomeIconItemSelected = toggleMenu;
				
            }
            
        }
        
		win.activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
						
			var menuItem = menu.add({
				title: "toggle menu"
			});
			
			menuItem.addEventListener('click', function () {
				toggleMenu();	
			});
		};
    }
    
	win.add(mainView);
    
	startApp();
    
});

// initial coordinate where the user clicked
var initCoordonate = 0;

win.addEventListener('touchstart', function (e) {
	try {
		initCoordonate = parseInt(e.x, 10);
	
		menuView.left = 0;	
	} catch (e) {}
	
});

win.addEventListener('touchend', function (e) {
	try {
		var coordonate = parseInt(e.x, 10);

		if((dpToPx(menuViewWidth) / 3) > (coordonate - initCoordonate)) {
			toggle = true;
		} else {
			toggle = false;
		}
			
		toggleMenu();
		
	} catch (e) {
		if(toggle) {
			toggleMenu();		
		}
	}
	
});


var timerPlaceholder;

var question = require('/ui/question');

// quiz manipulation object
var quiz = require('/quiz');
var quizObject = quiz.create();

var loader = require('/ui/loader');

var updateQuiz = function() {
	
	loader.show();
	
	if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		loader.hide();
		alert('You are off-line :(');
		return false;
	}
	
	var curentQuiz = quizObject.getCurrent();
	
	var errorDialog = Titanium.UI.createAlertDialog({ 
    	title: L('error_update'),
    	message: L('error_url'), 
    	buttonNames: [L('cancel'), L('edit'), L('retry')], 
    	cancel: 0
    });
    
    errorDialog.addEventListener('click', function (e) {
    	if (e.index === e.source.cancel){
	    	return;
	   	}
	   	
	   	switch(e.index) {
	   		case 2:
	   			updateQuiz();
	   			break;
	   		case 1:
	   			form.update({
					id: curentQuiz.id,
					url: curentQuiz.url,
					user: curentQuiz.user,
					pass: curentQuiz.pass
				});
	   			break;
	   	}
    });
	
	var client = Ti.Network.createHTTPClient({
	    // function called when the response data is available
	    onload : function(e) {
	    	
	    	var response = JSON.parse(this.responseText);
	    	
	        if(response && response.error) {
	        	
	        	errorDialog.title = response.error;
	        	
	        	errorDialog.show();
	        	
	        } else if(!response) {
	        	
	        	errorDialog.title = L('error_server');
	        	
	        	errorDialog.show();
	        	
	        } else {
	        	try {
	        		
	        		db.execute('DELETE FROM questions WHERE quiz = ?', curentQuiz.id);
	        		
	        		for(var key in response) {
	        			db.execute('INSERT INTO questions (question, quiz) VALUES (?, ?)', JSON.stringify(response[key]), curentQuiz.id);
	        		}
	        		
	        		quizObject.reset();
	        		
	        		quizObject.getCurrent();
	        		
	        		startQuiz();
	        		
	        	} catch(e) {
	        		console.log(e);
	        	}
	        }
	        
	        loader.hide();
	    },
	    // function called when an error occurs, including a timeout
	    onerror : function(e) {
	        
	        errorDialog.show();
	        
	        loader.hide();
	    },
	    timeout : 20000  // in milliseconds
	});
	
	// Prepare the connection.
	client.open("POST", curentQuiz.url + '/api.php');
	// Send the request.
	client.send({
		user: curentQuiz.user,
		pass: curentQuiz.pass
	});
};


var form = require('/ui/form');

// timer handler for interval
var timerHandler;

// seconds passed since start
var timerSeconds;


var startApp = function () {
	
	if(!quizObject.getCurrent()) {
		form.add();
	} else {
		startQuiz();
		return;
	}
	
};

var startQuiz = function () {
	
	if(view) {
		mainView.remove(view);	
	}
	
	view = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		backgroundColor: "white"
	});
	
	mainView.add(view);
	
	if(!quizObject.questionsLength()) {
		
		var label = Ti.UI.createLabel({
			text: L('empty_quiz'),
			color: 'black',
			textAlign: 'center'
		});
		
		view.add(label);
		
		return;
	}
	
	// shuffle, shuffle and shuffle the questions some more
	quizObject.shuffleQuestions();
	quizObject.shuffleQuestions();
	quizObject.shuffleQuestions();
	
	// init timer seconds
	timerSeconds = 0;
	
	// reset interval if present
	try {
		clearInterval(timerHandler);	
	} catch (e) {}
	
	question.show(quizObject.popQuestion());
	
	timerHandler = setInterval(function () {
		timerSeconds++;
		if(timerPlaceholder) {
			timerPlaceholder.text = '   ' + formatTime() + '   ';	
		}
        
	}, 1000);
	
};

// for iPhone add a navbar
if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	
	var menuButton = Ti.UI.createButton({
		title: L('menu')
	});
	
	var animateLeft = Ti.UI.createAnimation({
        left: menuViewWidth,
        curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
        duration: 300
	});
	
	var animateRight = Ti.UI.createAnimation({
        left: 0,
        curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
        duration: 300
	});
	
	menuButton.addEventListener("click", function () {
		if(!toggle) {
			mainView.animate(animateLeft);
			
			toggle = true;	
		} else {
			mainView.animate(animateRight);
			
			toggle = false;
		}
		
	});
	
	win.leftNavButton = menuButton;
	win.width = Ti.Platform.displayCaps.platformWidth;
	
	var nav = Titanium.UI.iOS.createNavigationWindow({
	   window: win,
	   width: Ti.Platform.displayCaps.platformWidth,
	});
	
	nav.open();
	
} else {
	win.open();
}
