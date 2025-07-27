// app/dashboard/lessons/[lessonId]/LessonClient.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Lightbulb, BookOpen, Play, CheckCircle, Brain, Sparkles, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAiTutor, ChatMessage } from '@/hooks/useAiTutor';
import curriculumData from '@/lib/lessons.json';
import PrimaryGameLesson from './PrimaryGameLesson';
import { useAuth } from '@/hooks/useAuth';

// Helper function to format the lessonId back into a readable title
const formatTitle = (id: string | undefined) => {
  if (!id) return "Lesson"; 
  return id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

// Helper to get lesson content based on topic
const getLessonContent = (topicTitle: string) => {
  const lessons: Record<string, any> = {
    "Linear Equations": {
      description: "Master the fundamentals of linear equations and learn to solve real-world problems",
      duration: "45 minutes",
      difficulty: "Intermediate",
      objectives: [
        "Understand what linear equations are",
        "Learn different methods to solve linear equations",
        "Apply linear equations to real-world problems",
        "Practice with Ghanaian context examples"
      ],
      content: {
        introduction: "A linear equation is an equation where the highest power of the variable is 1. In Ghana, we use linear equations in many real-life situations like calculating costs, distances, and time.",
        examples: [
          {
            title: "Market Price Calculation",
            problem: "If tomatoes cost GH₵3 per kg, and you buy x kg, the total cost is 3x cedis. If you spent GH₵15, how many kg did you buy?",
            solution: "3x = 15, therefore x = 5 kg"
          },
          {
            title: "Distance and Speed",
            problem: "A trotro travels from Accra to Kumasi at 60 km/h. If the journey takes 4 hours, what's the distance?",
            solution: "Distance = Speed × Time = 60 × 4 = 240 km"
          }
        ],
        keyFormulas: [
          "ax + b = c (Standard form)",
          "x = (c - b) / a (Solution formula)"
        ]
      }
    },
    "Counting Numbers": {
      description: "Learn the basics of counting and number recognition",
      duration: "30 minutes", 
      difficulty: "Beginner",
      objectives: [
        "Count from 1 to 100",
        "Recognize number patterns",
        "Practice counting with everyday objects",
        "Learn counting in Twi and English"
      ],
      content: {
        introduction: "Numbers are everywhere! In Ghana, we use numbers to count money (cedis and pesewas), people, objects, and time. Let's learn to count together!",
        examples: [
          {
            title: "Counting Cedis",
            problem: "If you have 5 one-cedi coins, how much money do you have?",
            solution: "1 + 1 + 1 + 1 + 1 = 5 cedis"
          },
          {
            title: "Counting Students",
            problem: "In your class, there are 12 boys and 8 girls. How many students in total?",
            solution: "12 + 8 = 20 students"
          }
        ],
        keyFormulas: [
          "Counting: 1, 2, 3, 4, 5...",
          "Addition: a + b = total"
        ]
      }
    }
  };

  return lessons[topicTitle] || {
    description: "Learn important mathematical concepts",
    duration: "45 minutes",
    difficulty: "Intermediate", 
    objectives: ["Understand the topic", "Practice problems", "Apply knowledge"],
    content: {
      introduction: `This lesson covers ${topicTitle}. We'll explore the concepts step by step with examples relevant to Ghana.`,
      examples: [],
      keyFormulas: []
    }
  };
};

// Modern AI Chat Window Component
const AiChatWindow = ({ messages, isLoading, onSendMessage, lessonTitle }: {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
  lessonTitle: string;
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const quickQuestions = [
    "Explain this step by step",
    "Give me an example",
    "How do I solve this?",
    "What's the formula?"
  ];
  
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white/95 backdrop-blur-md rounded-2xl shadow-modern-lg flex flex-col z-50 border border-gray-200/50">
      <div className="p-6 gradient-primary text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Tutor</h3>
              <p className="text-sm opacity-90">Teaching {lessonTitle}</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.filter(m => m.role !== 'system').length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Hi! I'm your AI tutor. Ask me anything about {lessonTitle}!</p>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(question)}
                  className="text-left p-2 text-sm bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-xs p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'chat-bubble-user shadow-lg' 
                : 'chat-bubble-ai shadow-md'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">You</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask me anything..." 
            disabled={isLoading}
            className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus-modern"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="btn-modern gradient-primary text-white rounded-xl px-6"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

// Main component
export default function LessonClient({ lessonId }: { lessonId?: string }) {
  const { userData } = useAuth();
  const lessonTitle = formatTitle(lessonId);
  const lessonData = getLessonContent(lessonTitle);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check if this is a primary student (grades 1-3) and if the lesson should be gamified
  const isPrimaryStudent = userData?.grade?.toLowerCase().includes('primary');
  const primaryGrade = isPrimaryStudent ? parseInt(userData?.grade?.match(/\d+/)?.[0] || '0') : 0;
  const shouldShowGame = isPrimaryStudent && primaryGrade <= 3 && 
    ['counting-numbers', 'addition-basics', 'subtraction-basics', 'shapes-colors'].includes(lessonId || '');

  // If this is a primary 1-3 student with a gamified lesson, show the game version
  if (shouldShowGame) {
    return <PrimaryGameLesson lessonId={lessonId || ''} lessonTitle={lessonTitle} />;
  }

  // Enhanced system prompt for teaching
  const systemPrompt = `You are EduMath GH AI Tutor, an expert mathematics teacher for Ghanaian students.

LESSON CONTEXT: You are currently teaching "${lessonTitle}" to a student.

TEACHING APPROACH:
1. Always start with simple explanations using Ghanaian examples (cedis, trotro, market prices, etc.)
2. Break down complex problems into smaller steps
3. Ask guiding questions to help students think through problems
4. Provide encouragement and positive reinforcement
5. Use visual descriptions when helpful
6. Connect math to real-life situations in Ghana

LESSON CONTENT TO TEACH:
${JSON.stringify(lessonData, null, 2)}

PERSONALITY: Be patient, encouraging, and enthusiastic about mathematics. Use simple language appropriate for the student's level.

Remember: Your goal is to help the student truly understand the concept, not just memorize formulas.`;
  
  const { messages, isLoading, sendMessage } = useAiTutor(systemPrompt);

  useEffect(() => {
    // Simulate progress as user scrolls or interacts
    const timer = setTimeout(() => setProgress(25), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartLesson = () => {
    const introMessage = `Hi! I'm ready to learn about ${lessonTitle}. Can you start by explaining what this topic is about and why it's important?`;
    sendMessage(introMessage);
    setIsChatOpen(true);
    setProgress(50);
  };

  const handleAskQuestion = (question: string) => {
    sendMessage(question);
    setIsChatOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="rounded-xl">
            <Link href="/dashboard/lessons">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back to Lessons
            </Link>
          </Button>
          <Badge variant="secondary" className="px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 mr-2" />
            {lessonData.duration}
          </Badge>
        </div>

        {/* Lesson Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Target className="w-4 h-4 mr-2" />
            {lessonData.difficulty} Level
          </div>
          <h1 className="text-5xl font-bold text-gradient">{lessonTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {lessonData.description}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 progress-modern" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover border-0 shadow-modern">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Start Learning</h3>
              <p className="text-gray-600 mb-4">Begin with AI-guided instruction</p>
              <Button onClick={handleStartLesson} className="btn-modern w-full rounded-xl">
                Start Lesson
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-modern">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Get Examples</h3>
              <p className="text-gray-600 mb-4">See practical examples</p>
              <Button 
                variant="outline" 
                onClick={() => handleAskQuestion("Can you show me some examples with step-by-step solutions?")}
                className="w-full rounded-xl"
              >
                View Examples
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-modern">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ask Questions</h3>
              <p className="text-gray-600 mb-4">Get instant help from AI</p>
              <Button 
                variant="outline" 
                onClick={() => setIsChatOpen(true)}
                className="w-full rounded-xl"
              >
                Open Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Learning Objectives */}
        <Card className="border-0 shadow-modern">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
              Learning Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessonData.objectives.map((objective: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card className="border-0 shadow-modern">
          <CardContent className="lesson-content-body p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {lessonData.content.introduction}
            </p>

            {lessonData.content.examples.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Examples</h3>
                {lessonData.content.examples.map((example: any, index: number) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                    <h4 className="font-bold text-blue-900 mb-3">{example.title}</h4>
                    <p className="text-gray-700 mb-3"><strong>Problem:</strong> {example.problem}</p>
                    <p className="text-green-700"><strong>Solution:</strong> {example.solution}</p>
                  </div>
                ))}
              </div>
            )}

            {lessonData.content.keyFormulas.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-4">Key Formulas</h3>
                <div className="space-y-2">
                  {lessonData.content.keyFormulas.map((formula: string, index: number) => (
                    <div key={index} className="font-mono text-purple-800 bg-white p-3 rounded-lg border">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-green-900">Ready to Practice?</h3>
              </div>
              <p className="text-green-800 mb-4">
                Now that you've learned the basics, let's practice with our AI tutor! Click the chat button to get personalized help and practice problems.
              </p>
              <Button onClick={handleStartLesson} className="btn-modern gradient-success text-white rounded-xl">
                <Brain className="w-4 h-4 mr-2" />
                Start AI Practice Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 gradient-primary text-white rounded-2xl shadow-modern-lg hover:shadow-2xl z-40 transition-all duration-300 hover:scale-110 ${isChatOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Toggle AI Tutor"
      >
        <MessageSquare className="w-6 h-6 mx-auto" />
      </button>

      {/* AI Chat Window */}
      {isChatOpen && (
        <AiChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={sendMessage}
          lessonTitle={lessonTitle}
        />
      )}
    </DashboardLayout>
  );
}