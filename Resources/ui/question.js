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

var displayResults = function () {
	
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
	
	var label = headerLabelHelper(L('results'));
	
	view.add(label);
	
	var correctBackground = Ti.UI.createLabel({
		text: '  ' + L('correct') + ': ',
		top: '80dp',
		color: 'white',
		backgroundColor: '#548F00',
		font: { fontSize:'30sp' },
		borderRadius: 8,
		width: Ti.Platform.displayCaps.platformWidth - 20,
		left: 10
	});
	
	view.add(correctBackground);
	
	var correctAnswers = Ti.UI.createLabel({
		text: quizObject.getCorect() + ' ',
		top: '80dp',
		color: 'white',
		backgroundColor: 'transparent',
		font: { fontSize:'30sp' },
		right: 10
	});
	
	view.add(correctAnswers);
	
	var incorrectBackground = Ti.UI.createLabel({
		text: '  ' + L('wrong') + ': ',
		top: '140dp',
		color: 'white',
		backgroundColor: '#E54B17',
		font: { fontSize:'30sp' },
		borderRadius: 8,
		width: Ti.Platform.displayCaps.platformWidth - 20,
		left: 10
	});
	
	view.add(incorrectBackground);
	
	var incorrectAnswers = Ti.UI.createLabel({
		text: quizObject.getIncorect() + ' ',
		top: '140dp',
		color: 'white',
		backgroundColor: 'transparent',
		font: { fontSize:'30sp' },
		right: 10
	});
	
	view.add(incorrectAnswers);
	
	var skippedBackground = Ti.UI.createLabel({
		text: '  ' + L('skipped') +': ',
		top: '200dp',
		color: 'white',
		backgroundColor: '#cccccc',
		font: { fontSize:'30sp' },
		borderRadius: 8,
		width: Ti.Platform.displayCaps.platformWidth - 20,
		left: 10
	});
	
	view.add(skippedBackground);
	
	var skippedAnswers = Ti.UI.createLabel({
		text: quizObject.questionsOriginalLength() - quizObject.getIncorect() - quizObject.getCorect() + ' ',
		top: '200dp',
		color: 'white',
		backgroundColor: 'transparent',
		font: { fontSize:'30sp' },
		right: 10
	});
	
	view.add(skippedAnswers);
	
	var timerBackground = Ti.UI.createLabel({
		text: '  ' + L('time') + ': ',
		top: '280dp',
		color: 'white',
		backgroundColor: '#cccccc',
		font: { fontSize:'30sp' },
		borderRadius: 8,
		width: Ti.Platform.displayCaps.platformWidth - 20,
		left: 10
	});
	
	view.add(timerBackground);
	
	var timerAnswers = Ti.UI.createLabel({
		text: formatTime() + '  ',
		top: '280dp',
		color: 'white',
		backgroundColor: 'transparent',
		font: { fontSize:'30sp' },
		right: 10
	});
	
	view.add(timerAnswers);
};

var show = function(questionData) {
	
	if(!questionData) {
		
		clearInterval(timerHandler);
		displayResults();
		return false;
	}
	
	
	if(view) {
		win.remove(view);
	}
	
	var question = JSON.parse(questionData.question);
	
	view = Ti.UI.createScrollView({
		width: Ti.Platform.displayCaps.platformWidth,
		backgroundColor: "white"
	});
	
	mainView.add(view);
	
	loader.show();
	
	// add a no scroll view
	var viewNoScroll = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		top: 0,
		backgroundColor: 'white'
	});
	
	view.add(viewNoScroll);
	
	var questionsLabel = Ti.UI.createLabel({
		text: '   ' + (quizObject.questionsOriginalLength() - quizObject.questionsLength()) + '/' + quizObject.questionsOriginalLength() + '   ',
		right: 10,
		top: '16dp',
		color: 'white',
		backgroundColor: '#5A5A5A',
		borderRadius: 8,
		borderWidth: 0,
		font: {fontSize: '18sp'}
	});
	
	view.add(questionsLabel);
	
	timerPlaceholder = Ti.UI.createLabel({
		text: '   ' + formatTime() + '   ',
		left: 10,
		top: '16dp',
		color: 'white',
		backgroundColor: '#5A5A5A',
		borderRadius: 8,
		borderWidth: 0,
		font: {fontSize: '18sp'}
	});
	
	view.add(timerPlaceholder);
	
	var questionLabel = Ti.UI.createLabel({
		text: question.question,
		color: 'black',
		top: '56dp',
		left: 10,
		right: 10,
		font: {fontSize: '22sp'},
		width:  Ti.Platform.displayCaps.platformWidth - 20
	});
	
	view.add(questionLabel);
	
	if (Ti.Platform.osname === "android") {
		var paddingTop = Math.round(pxToDp(questionLabel.toImage().height) + parseInt(questionLabel.top, 10));
	} else {
		var paddingTop = Math.round(questionLabel.toImage().height + parseInt(questionLabel.top, 10));
	}
	
	// shuffle answers
	question.ans.shuffle();
	
	if(questionData.image) {
		var imageBlob = Ti.Utils.base64decode(questionData.image.data);
		var imageView = Ti.UI.createImageView({ 
			image: imageBlob,
			width: Ti.Platform.displayCaps.platformWidth - 20,
			top: paddingTop + 'dp',
			canScale: true,
			height: 'auto'
		});
		
		// this is only working on Android, where auto scaling doesn't work
		if(imageView.getImage().height) {
			imageView.height = (imageView.getImage().height * (Ti.Platform.displayCaps.platformWidth - 20))/imageView.getImage().width;	
		}
		
		view.add(imageView);

		if (Ti.Platform.osname === "android") {
			paddingTop = pxToDp(imageView.toImage().height) + parseInt(imageView.top, 10);
		} else {
			paddingTop = imageView.toImage().height + parseInt(imageView.top, 10);
		}
	}
	
	var j, i = 0;
    var answerType = 'simple';
    
    var answerLabels = [];
    
    for (j = 0; j < question.ans.length; j++) {
		var answerLabel = Ti.UI.createButton({
			title: question.ans[j].text,
			left: 10,
			right: 10,
			/*height: 42,*/
			top: (paddingTop + 16) + 'dp',
			font: {fontSize: '21sp'},
			textAlign: 'center',
			backgroundColor: '#EFEFEF',
			color: 'black',
			borderRadius: 10,
			border: 0,
			width:  Ti.Platform.displayCaps.platformWidth - 20
		});
		
		if(question.ans[j].corect == 'true') {
			i++;
		}
		
		answerLabel.addEventListener('click', function () {
			
			if(checkAnswerButton.title === L('next')) {
				return false;
			}
			
			if(answerType == 'simple') {
				for(var key in answerLabels) {
					answerLabels[key].backgroundColor = '#EFEFEF';
					answerLabels[key].color = 'black';
					answerLabels[key].checked = false;
				}
			} else {
				if(this.checked) {
					this.backgroundColor = '#EFEFEF';
					this.color = 'black';
					this.checked = false;
					
					return;
				}
			}
			
			this.backgroundColor = '#666357';
			this.color = 'white';
			this.checked = true;
		});
		
		answerLabels.push(answerLabel);
		
		view.add(answerLabel);
		
		if (Ti.Platform.osname === "android") {
			paddingTop = pxToDp(answerLabel.toImage().height) + parseInt(answerLabel.top, 10);
		} else {
			paddingTop = answerLabel.toImage().height + parseInt(answerLabel.top, 10);
		}

    }
    
    if(i > 1) {
    	answerType = 'multiple';
    }
    
    var checkAnswerButton = Ti.UI.createButton({
    	title: L('check'),
    	textAlign: 'center',
    	borderRadius: 18,
    	font: {fontSize: '21sp'},
    	// height: 42,
    	color: 'white',
    	borderColor: '#427D93',
    	borderWidth: 1,
    	backgroundColor: '#6CBCDA',
    	backgroundSelectedColor: '#519cb8',
    	width: (Ti.Platform.displayCaps.platformWidth - 30) / 2,
    	left: 10,
    	top: (paddingTop + 16) + 'dp'
    });
    
    view.add(checkAnswerButton);
    
    checkAnswerButton.addEventListener('click', function () {
    	
    	if(this.title === L('next')) {
    		show(quizObject.popQuestion());
    		return;
    	}
    	
    	var correct = true;
    	
    	var answers = question.ans;
    	
    	for (var i = 0; i < answers.length; i++) {
    		
    		answerLabels[i].enabled = false;
    		
    		if(answers[i].corect === 'true' && answerLabels[i].checked) {
    			// corect selected
    			answerLabels[i].backgroundColor = '#548F00';
    			answerLabels[i].color = 'white';
    		} else if(answers[i].corect && !answerLabels[i].checked) {
    			// incorect
    			correct = false;
    			answerLabels[i].backgroundColor = '#70BF00';
    			answerLabels[i].color = 'white';
    		} else if(!answers[i].corect && answerLabels[i].checked) {
    			// corect but not selected
    			correct = false;
    			answerLabels[i].backgroundColor = '#E54B17';
    			answerLabels[i].color = 'white';
    		}

    	}
    	
    	if(!correct) {
    		// incorect question
    		this.title = L('next');
    		quizObject.increaseIncorect();
    	} else {
    		// move to next question
    		quizObject.increaseCorect();
    		show(quizObject.popQuestion());
    	}
    	
    });
    
    
    var skipButton = Ti.UI.createButton({
    	title: L('skip'),
    	textAlign: 'center',
    	borderRadius: 18,
    	font: {fontSize: '21sp'},
    	// height: 42,
    	color: 'white',
    	borderColor: '#427D93',
    	borderWidth: 1,
    	backgroundColor: '#6CBCDA',
    	backgroundSelectedColor: '#519cb8',
    	width: (Ti.Platform.displayCaps.platformWidth - 30) / 2,
    	right: 10,
    	top: (paddingTop + 16) + 'dp'
    });
    
    view.add(skipButton);
    
    skipButton.addEventListener('click', function () {
    	
    	show(quizObject.popQuestion());
    	
    });
    
    if (Ti.Platform.osname === "android") {
    	var paddingTop = parseInt(paddingTop, 10) + pxToDp(skipButton.toImage().height) + 16;
    } else {
    	var paddingTop = parseInt(paddingTop, 10) + skipButton.toImage().height + 16;
    }
    
    var paddingBottom = Ti.UI.createLabel({
    	text: ' ',
    	top: paddingTop + 'dp',
    	height: '40dp',
    	backgroundColor: 'white',
    	width: '100%'
    });
    
    view.add(paddingBottom);
    
    loader.hide();
    
};

exports.show = show;