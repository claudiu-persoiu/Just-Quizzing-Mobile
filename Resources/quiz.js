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

var quiz = function () {
	
	var currentQuiz = false;
	
	var questions = false;
	
	var questionsLength = 0;
	
	var answers = {
		corect: 0,
		incorect: 0
	};
	
	var getQuestions = function () {

		if(!currentQuiz) {
			getCurrentQuiz();	
		}
		
		if(!currentQuiz) {
			return;
		}

		var dbResult = db.execute('SELECT * FROM questions WHERE quiz = ?', currentQuiz.id);
	
		questions = [];
		
		while(dbResult.isValidRow()) {
			
			questions.push(dbResult.fieldByName('question'));
			
			dbResult.next();
		}
		
		dbResult.close();
		
		questionsLength = questions.length;
	};
	
	var getCurrentQuiz = function () {
		try {
			var dbResult = db.execute('SELECT * FROM quizzies WHERE selected = 1');
			
			currentQuiz = false;
			
			if(dbResult.isValidRow()) {
				
				currentQuiz =  {
					id:   dbResult.fieldByName('id'),
					url:  dbResult.fieldByName('url'),
					user: dbResult.fieldByName('user'),
					pass: dbResult.fieldByName('pass')
				};
				
			}
			
			dbResult.close();
			
			return currentQuiz;
				
		} catch (e) {
			//console.log(e);
			db.execute("CREATE TABLE IF NOT EXISTS quizzies (\
				id INTEGER PRIMARY KEY, \
				url TEXT, \
				user TEXT, \
				pass TEXT, \
				selected INTEGER)");
		}
		
		return false;
	};
	
	return {
		getCurrent: function () {
			
			if(!currentQuiz) {
				questions = false;
				getCurrentQuiz();	
			}
			
			return currentQuiz;
		},
		reset: function () {
			currentQuiz = false;
			questions = false;
			questionsLength = 0;
			answers = {
				corect: 0,
				incorect: 0
			};
		},
		getQuestions: function () {
			
			if(!questions && currentQuiz) {
				getQuestions();
			} 
			
			return questions;
		},
		questionsOriginalLength: function () {
			if(questions === false) {
				getQuestions();
			}
			return questionsLength;
		},
		questionsLength: function () {
			if(questions === false) {
				getQuestions();
			}
			return questions.length;
		},
		popQuestion: function () {
			if(questions.length) {
				return JSON.parse(questions.pop());
			}
			
			return false;
		},
		shuffleQuestions: function () {
			
			questions.shuffle();
			
		},
		increaseCorect: function () {
			answers.corect++;
		},
		increaseIncorect: function () {
			answers.incorect++;
		},
		getCorect: function () {
			return answers.corect;
		},
		getIncorect: function () {
			return answers.incorect;
		}
	};
};

exports.create = quiz;