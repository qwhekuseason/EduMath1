'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, Heart, Zap, Target, Gift, Sparkles, Volume2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';

interface PrimaryGameLessonProps {
  lessonId: string;
  lessonTitle: string;
}

// Game data for different lessons
const gameData = {
  'counting-numbers': {
    title: 'Counting Adventure! 🎯',
    description: 'Help Kofi count objects to win stars!',
    type: 'counting',
    levels: [
      { objects: 3, answer: 3, items: '🍎', question: 'How many apples does Ama have?' },
      { objects: 5, answer: 5, items: '⚽', question: 'Count the footballs in the field!' },
      { objects: 7, answer: 7, items: '🌟', question: 'How many stars can you see?' },
      { objects: 4, answer: 4, items: '🚗', question: 'Count the cars on the road!' },
      { objects: 6, answer: 6, items: '🎈', question: 'How many balloons are there?' }
    ]
  },
  'addition-basics': {
    title: 'Addition Magic! ✨',
    description: 'Solve addition problems to collect treasures!',
    type: 'addition',
    levels: [
      { num1: 2, num2: 1, answer: 3, story: 'Kwame has 2 oranges. His sister gives him 1 more. How many does he have now?' },
      { num1: 3, num2: 2, answer: 5, story: 'There are 3 birds in a tree. 2 more birds join them. How many birds in total?' },
      { num1: 4, num2: 3, answer: 7, story: 'Ama bought 4 pencils. Her friend gave her 3 more. How many pencils does she have?' },
      { num1: 5, num2: 2, answer: 7, story: 'In the classroom, there are 5 boys and 2 girls. How many children in total?' },
      { num1: 6, num2: 4, answer: 10, story: 'Kofi saved 6 cedis. His father gave him 4 more cedis. How much money does he have?' }
    ]
  },
  'subtraction-basics': {
    title: 'Subtraction Safari! 🦁',
    description: 'Help animals solve subtraction problems!',
    type: 'subtraction',
    levels: [
      { num1: 5, num2: 2, answer: 3, story: 'There were 5 mangoes on the tree. 2 fell down. How many are left?' },
      { num1: 7, num2: 3, answer: 4, story: 'Ama had 7 stickers. She gave 3 to her friend. How many does she have left?' },
      { num1: 8, num2: 5, answer: 3, story: 'There were 8 chickens in the yard. 5 went inside. How many are still outside?' },
      { num1: 6, num2: 4, answer: 2, story: 'Kwame had 6 marbles. He lost 4 while playing. How many marbles does he have now?' },
      { num1: 9, num2: 6, answer: 3, story: 'There were 9 students in class. 6 went home early. How many students are left?' }
    ]
  },
  'shapes-colors': {
    title: 'Shape Detective! 🔍',
    description: 'Find and match shapes to become a shape master!',
    type: 'shapes',
    levels: [
      { shape: '🔴', name: 'Circle', options: ['Circle', 'Square', 'Triangle'], answer: 'Circle' },
      { shape: '🟦', name: 'Square', options: ['Circle', 'Square', 'Triangle'], answer: 'Square' },
      { shape: '🔺', name: 'Triangle', options: ['Circle', 'Square', 'Triangle'], answer: 'Triangle' },
      { shape: '⭐', name: 'Star', options: ['Star', 'Heart', 'Diamond'], answer: 'Star' },
      { shape: '💎', name: 'Diamond', options: ['Star', 'Heart', 'Diamond'], answer: 'Diamond' }
    ]
  }
};

export default function PrimaryGameLesson({ lessonId, lessonTitle }: PrimaryGameLessonProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const game = gameData[lessonId as keyof typeof gameData];
  const currentQuestion = game?.levels[currentLevel];

  useEffect(() => {
    if (gameCompleted) {
      const earnedStars = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
      setStars(earnedStars);
      setShowCelebration(true);
    }
  }, [gameCompleted, score]);

  const playSound = (type: 'correct' | 'wrong' | 'complete') => {
    // In a real app, you would play actual sound effects here
    console.log(`Playing ${type} sound`);
  };

  const handleAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 20);
      playSound('correct');
    } else {
      setLives(prev => prev - 1);
      playSound('wrong');
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (correct || lives > 1) {
        if (currentLevel < game.levels.length - 1) {
          setCurrentLevel(prev => prev + 1);
        } else {
          setGameCompleted(true);
          playSound('complete');
        }
      }
      setSelectedAnswer('');
    }, 2000);
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedAnswer('');
    setShowFeedback(false);
    setStars(0);
    setShowCelebration(false);
  };

  const renderCountingGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="text-center space-y-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h3>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
          {Array.from({ length: currentQuestion.objects }).map((_, i) => (
            <div key={i} className="text-6xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {currentQuestion.items}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[currentQuestion.answer - 1, currentQuestion.answer, currentQuestion.answer + 1, currentQuestion.answer + 2].map((num) => (
            <Button
              key={num}
              onClick={() => handleAnswer(num)}
              className="h-20 text-3xl font-bold rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              disabled={showFeedback}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderMathGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="text-center space-y-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl">
          <p className="text-lg text-gray-700 mb-6">{currentQuestion.story}</p>
          
          <div className="flex items-center justify-center space-x-4 text-4xl font-bold text-gray-900 mb-8">
            <span className="bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              {currentQuestion.num1}
            </span>
            <span className="text-blue-500">
              {game.type === 'addition' ? '+' : '−'}
            </span>
            <span className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              {currentQuestion.num2}
            </span>
            <span className="text-purple-500">=</span>
            <span className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">?</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[currentQuestion.answer - 2, currentQuestion.answer, currentQuestion.answer + 1, currentQuestion.answer - 1].sort(() => Math.random() - 0.5).map((num, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(num)}
              className="h-20 text-3xl font-bold rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              disabled={showFeedback}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderShapeGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="text-center space-y-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">What shape is this?</h3>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-12 rounded-2xl">
          <div className="text-9xl mb-4 animate-pulse">
            {currentQuestion.shape}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              className="h-16 text-xl font-bold rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              disabled={showFeedback}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    switch (game?.type) {
      case 'counting':
        return renderCountingGame();
      case 'addition':
      case 'subtraction':
        return renderMathGame();
      case 'shapes':
        return renderShapeGame();
      default:
        return <div>Game not found</div>;
    }
  };

  if (!game) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Game Not Available</h1>
          <p className="text-gray-600 mb-8">This lesson doesn't have a game version yet.</p>
          <Button asChild>
            <Link href="/dashboard/lessons">Back to Lessons</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="rounded-xl">
            <Link href="/dashboard/lessons">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Link>
          </Button>
          
          {gameStarted && !gameCompleted && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-xl">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-700">{lives}</span>
              </div>
              <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-700">{score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Start Screen */}
        {!gameStarted && !gameCompleted && (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-bounce">🎮</div>
                <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
                <p className="text-xl mb-8 opacity-90">{game.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">5 Levels</h3>
                    <p className="text-sm opacity-80">Complete all challenges</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">3 Lives</h3>
                    <p className="text-sm opacity-80">Be careful with mistakes</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">Earn Stars</h3>
                    <p className="text-sm opacity-80">Get high scores for rewards</p>
                  </div>
                </div>

                <Button
                  onClick={() => setGameStarted(true)}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-xl font-bold px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-6 h-6 mr-3" />
                  Start Game!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Play Screen */}
        {gameStarted && !gameCompleted && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Level {currentLevel + 1} of {game.levels.length}</h2>
                  <Badge className="bg-blue-500 text-white px-4 py-2">
                    Score: {score}
                  </Badge>
                </div>
                <Progress value={((currentLevel + 1) / game.levels.length) * 100} className="h-3 progress-modern" />
              </CardContent>
            </Card>

            {/* Game Content */}
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                {renderGameContent()}
              </CardContent>
            </Card>

            {/* Feedback Modal */}
            {showFeedback && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className={`border-0 shadow-2xl ${isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-pink-500'} text-white`}>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">
                      {isCorrect ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
                    </div>
                    <h3 className="text-3xl font-bold mb-4">
                      {isCorrect ? 'Excellent! 🎉' : 'Try Again! 💪'}
                    </h3>
                    <p className="text-xl">
                      {isCorrect ? 'You got it right!' : `The answer is ${currentQuestion?.answer}`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Game Completion Screen */}
        {gameCompleted && (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                {showCelebration && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🎊</div>
                  </div>
                )}
                
                <div className="text-6xl mb-6">🏆</div>
                <h1 className="text-4xl font-bold mb-4">Game Complete!</h1>
                <p className="text-xl mb-8">You finished all levels!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Star className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">Final Score</h3>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">Stars Earned</h3>
                    <div className="flex justify-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className={`w-6 h-6 ${i < stars ? 'text-yellow-300 fill-current' : 'text-white/30'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <Gift className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold mb-2">Reward</h3>
                    <p className="text-sm">New badge unlocked!</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={resetGame}
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/dashboard/lessons">
                      <Sparkles className="w-5 h-5 mr-2" />
                      More Lessons
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}