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

Array.prototype.shuffle = function () {
    var i = this.length;
    if (i == 0) return false;
    while (--i) {
        var j = Math.floor(Math.random() * ( i + 1 ));
        var tempi = this[i];
        var tempj = this[j];
        this[i] = tempj;
        this[j] = tempi;
    }
    return this;
};

var headerLabelHelper = function (text) {
	return Ti.UI.createLabel({
		text: text,
		top: '8dp',
		color: '#000000',
		font: { fontSize: '35sp' }
	});
};

var formatTime = function () {
	
	var hours = Math.floor(timerSeconds / 3600);
    var minutes = Math.floor(timerSeconds / 60) - hours * 60;
    var seconds = timerSeconds - minutes * 60 - hours * 3600;

    if(minutes < 10) {
        minutes = '0' + minutes;
    }

    if(seconds < 10) {
        seconds = '0' + seconds;
    }
    
    if(hours < 10) {
    	hours = '0' + hours;
    }
    
    return hours + ':' + minutes + ':' + seconds;
};

var pxToDp = function (px) {
  return parseInt((px / (Titanium.Platform.displayCaps.dpi / 160)), 10);
};
 
 
var dpToPx = function (dp) {
  return parseInt((dp * (Titanium.Platform.displayCaps.dpi / 160)), 10);
};
