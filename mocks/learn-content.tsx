import React from 'react';
import { Zap, DollarSign, Clock, Brain, Lightbulb, Briefcase, Dumbbell, Globe } from 'lucide-react-native';
import colors from '@/constants/colors';

export const LEARN_CONTENT = [
  {
    id: '1',
    category: '🔥 Trending Topic',
    title: "How GPT-5 is reshaping solopreneur workflows",
    content: "The latest AI models are enabling solopreneurs to automate complex tasks that previously required entire teams. From content creation to customer service, GPT-5 is changing how independent professionals scale their impact without scaling their headcount. Early adopters report 3-5x productivity gains when implementing structured AI workflows.",
    icon: <Zap size={20} color="#FFFFFF" />,
    color: '#FF6B6B',
  },
  {
    id: '2',
    category: '💰 Financial Insight',
    title: "The Rule of 72 – your money's doubling timeline",
    content: "Want to know how long it will take for your investment to double? Divide 72 by your expected annual return rate. At 8% growth, your money doubles in 9 years. At 12%, it takes just 6 years. This simple mental math helps you quickly evaluate investment opportunities and understand the power of compound interest over time. Remember that higher returns typically come with higher risk.",
    icon: <DollarSign size={20} color="#FFFFFF" />,
    color: '#4ECDC4',
  },
  {
    id: '3',
    category: '⚙️ Productivity Hack',
    title: "Batching kills distractions. Try time-blocking.",
    content: "Context switching costs you 23 minutes of focus each time. Instead of reactive work, group similar tasks into dedicated time blocks on your calendar. Spend 90-120 minutes in deep work sessions on a single category of tasks. Your brain operates more efficiently when it doesn't need to constantly recalibrate to different types of thinking. Start with just one batch per day and expand as you see results.",
    icon: <Clock size={20} color="#FFFFFF" />,
    color: '#FFD166',
  },
  {
    id: '4',
    category: '🧠 Wisdom Drop',
    title: "A man without a standard becomes a slave to circumstance.",
    content: "When you lack clear principles and boundaries, you become reactive to whatever happens around you. Your mood, decisions, and actions are determined by external events rather than internal values. Developing personal standards means deciding in advance how you'll respond to challenges, opportunities, and temptations. This proactive approach puts you in control of your life rather than at the mercy of random circumstances.",
    icon: <Brain size={20} color="#FFFFFF" />,
    color: '#6A0572',
  },
  {
    id: '5',
    category: '💡 Mental Model',
    title: "Inversion: Solve problems backward, not forward",
    content: "Instead of asking \"How do I achieve success?\", ask \"What guarantees failure?\" Avoiding obvious mistakes is often easier and more effective than seeking complex solutions. Charlie Munger calls this \"inversion\" - approaching problems from the opposite direction. For example, to build wealth, first identify all the ways people destroy wealth (debt, emotional trading, etc.) and avoid those behaviors. This negative knowledge often provides clearer guidance than positive advice.",
    icon: <Lightbulb size={20} color="#FFFFFF" />,
    color: '#118AB2',
  },
  {
    id: '6',
    category: '💼 Leadership',
    title: "Decisions reveal values more than words do",
    content: "Your team watches what you do, not what you say. When you claim to value work-life balance but email at midnight, you're teaching them to ignore your stated values. When you say quality matters but rush projects, you signal that deadlines trump excellence. Every decision, especially difficult ones with tradeoffs, reveals your true priorities. Be intentional about what your choices communicate to those you lead.",
    icon: <Briefcase size={20} color="#FFFFFF" />,
    color: '#073B4C',
  },
  {
    id: '7',
    category: '💪 Performance',
    title: "Recovery isn't optional, it's part of the work",
    content: "Elite performers don't work more hours - they recover more strategically. Your body and mind adapt and grow during rest periods, not during stress. Without proper recovery (sleep, nutrition, mental downtime), performance plateaus or declines regardless of effort. Schedule recovery with the same discipline you schedule work. The most sustainable high performers view rest as a competitive advantage, not a luxury.",
    icon: <Dumbbell size={20} color="#FFFFFF" />,
    color: '#06D6A0',
  },
  {
    id: '8',
    category: '🌎 Global Perspective',
    title: "The next decade belongs to builders, not critics",
    content: "We're entering an era where creation outvalues criticism. While social media rewarded those who could critique and deconstruct, the coming decade will favor those who build solutions to real problems. The combination of AI tools, remote collaboration, and capital access means individual builders can have unprecedented impact. The question isn't \"what's wrong with this?\" but \"what can I build that matters?\"",
    icon: <Globe size={20} color="#FFFFFF" />,
    color: '#3A86FF',
  },
];