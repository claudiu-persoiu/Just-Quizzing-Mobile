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
	
	if(overlay) {
		return;
	}
	
	overlay = Titanium.UI.createWindow({
		height: view.rect.height,
		width: Ti.Platform.displayCaps.platformWidth,
		backgroundColor:'#ffffff',
		opacity: 0.9
	});
	
	var activityIndicator = Ti.UI.createActivityIndicator({
		font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	
	if(Ti.Platform.osname === 'iphone') {
		activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	} else {
		activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	
	overlay.add(activityIndicator);
	
	activityIndicator.show();
	
	overlay.open();
};

var hide = function () {
	if(overlay) {
		overlay.close();
		overlay = false;	
	}
};

exports.show = show;
exports.hide = hide;