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

var show = function () {
	
	if(view) {
		mainView.remove(view);
	}
	
	view = Ti.UI.createScrollView({
		width: Ti.Platform.displayCaps.platformWidth,
		backgroundColor: "white",
	});
	
	mainView.add(view);
	
	// add a no scroll view
	var viewNoScroll = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		top: 0,
		backgroundColor: 'white'
	});
	
	view.add(viewNoScroll);
	
	var label = headerLabelHelper(L('manage_quizzes'));
	
	view.add(label);
	
	var dbResult = db.execute('SELECT * FROM quizzies');
	
	var paddingTop = 72;
	
	var quizzies = [];
	
	var options = Ti.UI.createOptionDialog({
		options: [L('set_default'), L('edit'), L('remove'), L('cancel')],
		cancel: 3
	});
	
	options.addEventListener('click', function (e) {
		switch(e.index) {
			case 0:
				db.execute('UPDATE quizzies SET selected = 0');
				
				for(var i = 0; i < quizzies.length; i++) {
					quizzies[i].backgroundColor = '#EFEFEF';
					quizzies[i].color = 'black';
				}
				
				db.execute('UPDATE quizzies SET selected = 1 WHERE id = ?', this.element.details.id);
				
				this.element.backgroundColor = '#cccccc';
				this.element.color = '#ffffff';	
				this.element.selected = true;
			break;
			case 1:
				form.update({
					id: this.element.details.id,
					url: this.element.details.url,
					user: this.element.details.user,
					pass: this.element.details.pass
				});
			break;
			case 2:
				db.execute('DELETE FROM quizzies WHERE id = ?', this.element.details.id);
				db.execute('DELETE FROM questions WHERE quiz = ?', this.element.details.id);
				
				if(quizzies.length == 1) {
					add.show();
				}
				
				var needNewSelected = false;
				console.log(quizzies.length);
				for(var i = 0; i < quizzies.length; i++) {
					if(this.element.details.id == quizzies[i].details.id) {
						view.remove(quizzies[i]);
						quizzies.splice(i, 1);
						
						if(this.element.selected) {
							needNewSelected = true;
						}
						
						break;
					}
				}
				
				var paddingTop = 72;
				console.log(quizzies.length);
				for(var i = 0; i < quizzies.length; i++) {
					quizzies[i].top = (paddingTop + (68 *i)) + 'dp';
				}
				console.log(quizzies.length);
				if(quizzies.length > 0) {
					if(needNewSelected) {
						db.execute('UPDATE quizzies SET selected = 1 WHERE id = ?', quizzies[0].details.id);
						quizzies[0].backgroundColor = '#cccccc';
						quizzies[0].color = '#ffffff';
						quizzies[0].selected = true;
						quizObject.getCurrent();
					}
					
				} else {
					form.add();
				}
				
			break;
		}
	});
	
	while(dbResult.isValidRow()) {
		
		var quiz = Ti.UI.createLabel({
			text: dbResult.fieldByName('url'),
			details: {
				id: dbResult.fieldByName('id'),
				url: dbResult.fieldByName('url'),
				user: dbResult.fieldByName('user'),
				pass: dbResult.fieldByName('pass'),
			},
			left: 10,
			right: 10,
			top: paddingTop + 'dp',
			font: {fontSize: '21sp'},
			textAlign: 'center',
			backgroundColor: '#EFEFEF',
			color: 'black',
			borderRadius: 10,
			border: 0,
			width:  Ti.Platform.displayCaps.platformWidth - 20,
			height: '56dp',
			ellipsize: true,
			wordWrap : false,
			selected: dbResult.fieldByName('selected')
		});
		
		if(dbResult.fieldByName('selected')) {
			quiz.backgroundColor = '#cccccc';
			quiz.color = '#ffffff';	
		}
		
		view.add(quiz);
		
		quiz.addEventListener('click', function () {
			
			db.execute('UPDATE quizzies SET selected = 0');
			
			for(var i = 0; i < quizzies.length; i++) {
				quizzies[i].backgroundColor = '#EFEFEF';
				quizzies[i].color = 'black';
			}
			
			db.execute('UPDATE quizzies SET selected = 1 WHERE id = ?', this.details.id);
			
			this.backgroundColor = '#cccccc';
			this.color = '#ffffff';	
		});
		
		quiz.addEventListener('longpress', function () {
			
			options.element = this;
			options.selectedIndex = 4;
			options.show();
		});
		
		quizzies.push(quiz);
		
		dbResult.next();
		
		paddingTop += 68;
	}
	
	dbResult.close();
};

exports.show = show;