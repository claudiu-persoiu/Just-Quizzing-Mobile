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
	
	loader.show();
	
	if(view) {
		mainView.remove(view);
	}
	
	view = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		top: 0,
		backgroundGradient:  {
	        type: 'linear',
	        startPoint: { x: '50%', y: '0%' },
	        endPoint: { x: '50%', y: '100%' },
	        colors: [{ color: '#023E59'}, { color: '#21A7DA' }],
	    }
	});
	
	mainView.add(view);
	
	var imageView = Ti.UI.createImageView({ 
		image: '/appicon.png',
		top: '30dp',
		width: '90dp',
		canScale: true,
		height: 'auto'
	});
	
	view.add(imageView);
	
	var label = Ti.UI.createLabel({
		text: 'Just Quizzing',
		color: 'white',
		top: '120dp',
		font: { fontSize: '35sp' }
	});
	
	view.add(label);
	
	var label = Ti.UI.createLabel({
		text: L('about_description'),
		color: 'white',
		top: '170dp',
		font: { fontSize:'20sp' }
	});
	
	view.add(label);
	
	var label = Ti.UI.createLabel({
		text: L('official_page'),
		color: 'green',
		top: '200dp',
		font: { fontSize:'20sp' }
	});
	
	view.add(label);
	
	label.addEventListener('click', function () {
		Titanium.Platform.openURL('http://blog.claudiupersoiu.ro/just-quizzing/');
	});
	
	var label = Ti.UI.createLabel({
		text: L('by') + ' Claudiu Persoiu',
		right: '25dp',
		color: 'white',
		bottom: '25dp',
		font: { fontSize:'25sp' }
	});
	
	view.add(label);
	
	loader.hide();
	
};

exports.show = show;