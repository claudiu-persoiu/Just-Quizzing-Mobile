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

var show = function (params) {
	
	if(view) {
		mainView.remove(view);
	}
	
	view = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		backgroundColor: "white",
	});
	
	mainView.add(view);
	
	var label = headerLabelHelper(params.title);
	
	view.add(label);
	
	var urlInput = Ti.UI.createTextField({
		hintText: L('quiz_url'),
		top: '80dp',
		color: '#000000',
		width: (Ti.Platform.displayCaps.platformWidth - 20),
		borderColor: '#cccccc',
		borderWidth: 1
	});
	
	urlInput.addEventListener('focus', function (e) {
		this.borderColor = '#cccccc';
		this.borderWidth = 1;
	});
	
	if(params.url) {
		urlInput.value = params.url;
	}
	
	view.add(urlInput);
	
	var userInput = Ti.UI.createTextField({
		hintText: L('username'),
		top: '136dp',
		color: '#000000',
		width: (Ti.Platform.displayCaps.platformWidth - 20),
		borderColor: '#cccccc',
		borderWidth: 1
	});
	
	if(params.user) {
		userInput.value = params.user;
	}
	
	view.add(userInput);
	
	var passInput = Ti.UI.createTextField({
		hintText: L('password'),
		top: '192dp',
		color: '#000000',
		width: (Ti.Platform.displayCaps.platformWidth - 20),
		passwordMask:true,
		borderColor: '#cccccc',
		borderWidth: 1
	});
	
	if(params.pass) {
		passInput.value = params.pass;
	}
	
	view.add(passInput);
	
	var button = Ti.UI.createButton({
		title: params.button,
		top: '280dp',
		color: 'white',
		backgroundColor: '#000000',
		width: (Ti.Platform.displayCaps.platformWidth - 20)
	});
	
	button.addEventListener('click', function (e) {
		params.callback(urlInput, userInput, passInput, params.id);
	});
	
	view.add(button);
	
};

var add = function () {
	show({
		title: L('import_quiz'),
		button: L('import_action'),
		callback: function (urlInput, userInput, passInput) {
		
			if(Ti.Platform.osname === "android") {
				Ti.UI.Android.hideSoftKeyboard();	
			}
			
			if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
				loader.hide();
				alert(L('error_offline'));
				return false;
			}
			
			if(!urlInput.getValue()) {
				urlInput.borderColor = '#FF3333';
				urlInput.borderWidth = 2;
				return false;
			}
			
			loader.show();
			
			var url = urlInput.getValue() + '/api.php';
			
			var client = Ti.Network.createHTTPClient({
			    // function called when the response data is available
			    onload : function(e) {
			    	
			    	var response = JSON.parse(this.responseText);
			    	
			        console.log(response);
			        if(response && response.error) {
			        	alert(response.error);
			        } else if(!response) {
			        	alert(L('error_no_response'));
			        } else {
			        	try {
			        		
			        		db.execute('UPDATE quizzies SET selected = 0');
			        		
			        		db.execute('INSERT INTO quizzies (url, user, pass, selected) VALUES (?, ?, ?, ?)', urlInput.getValue(), userInput.getValue(), passInput.getValue(), '1');
			        		
			        		var quizId = db.lastInsertRowId;
			        		
			        		db.execute('CREATE TABLE IF NOT EXISTS questions (\
			        			id INTEGER PRIMARY KEY,\
			        			question TEXT,\
			        			quiz INTEGER)');
			        			
			        		for(var key in response) {
			        			db.execute('INSERT INTO questions (question, quiz) VALUES (?, ?)', JSON.stringify(response[key]), quizId);
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
			    	alert(L('error_url'));
			        loader.hide();
			    },
			    timeout : 20000  // in milliseconds
			});
			
			// Prepare the connection.
			client.open("POST", url);
			// Send the request.
			client.send({
				user: userInput.getValue(),
				pass: passInput.getValue()
			});
			
		}
	});
};

var update = function (params) {
	show({
		title: L('edit_quiz'),
		id: params.id,
		url: params.url,
		user: params.user,
		pass: params.pass,
		button: L('update_action'),
		callback: function (urlInput, userInput, passInput, id) {
			if(Ti.Platform.osname === "android") {
				Ti.UI.Android.hideSoftKeyboard();	
			}
			
			if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
				loader.hide();
				alert(L('error_offline'));
				return false;
			}
			
			if(!urlInput.getValue()) {
				urlInput.borderColor = '#FF3333';
				urlInput.borderWidth = 2;
				return false;
			}
			
			loader.show();
			
			var url = urlInput.getValue() + '/api.php';
			
			var client = Ti.Network.createHTTPClient({
			    // function called when the response data is available
			    onload : function(e) {
			    	
			    	var response = JSON.parse(this.responseText);
			    	
			        console.log(response);
			        if(response && response.error) {
			        	alert(response.error);
			        } else if(!response) {
			        	alert(L('error_no_response'));
			        } else {
			        	try {
			        		
			        		db.execute('UPDATE quizzies SET selected = 0');
			        		
			        		db.execute('UPDATE quizzies SET url = ?, user = ?, pass = ?, selected = 1 WHERE id = ?', urlInput.getValue(), userInput.getValue(), passInput.getValue(), params.id);
			        		
			        		db.execute('DELETE FROM questions WHERE quiz = ?', params.id);
			        		
			        		for(var key in response) {
			        			db.execute('INSERT INTO questions (question, quiz) VALUES (?, ?)', JSON.stringify(response[key]), params.id);
			        		}
			        		
			        		quizObject.reset();
			        		
			        		quizObject.getCurrent();
			        		
			        		startQuiz();
			        		
			        	} catch(e) {
			        		alert(e);
			        		console.log(e);
			        	}
			        }
			        
			        loader.hide();
			    },
			    // function called when an error occurs, including a timeout
			    onerror : function(e) {
			    	alert(L('error_url'));
			        loader.hide();
			    },
			    timeout : 20000  // in milliseconds
			});
			
			// Prepare the connection.
			client.open("POST", url);
			// Send the request.
			client.send({
				user: userInput.getValue(),
				pass: passInput.getValue()
			});
			
		}
	});
};

exports.add = add;

exports.update = update;
// exports.show = show;