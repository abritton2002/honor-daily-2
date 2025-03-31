import { LearningItem } from '@/types/learning';
import { getTodayDateString } from '@/utils/date-utils';

// Get today's date for the items
const today = getTodayDateString();

// Get dates for the past week (for testing the streak feature)
function getPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export const LEARNING_ITEMS: LearningItem[] = [
  // Leadership items
  {
    id: 'l1',
    category: 'Leadership',
    title: "Decisions reveal values more than words do",
    content: "Your team watches what you do, not what you say. When you claim to value work-life balance but email at midnight, you're teaching them to ignore your stated values. When you say quality matters but rush projects, you signal that deadlines trump excellence. Every decision, especially difficult ones with tradeoffs, reveals your true priorities. Be intentional about what your choices communicate to those you lead.",
    date: today,
  },
  {
    id: 'l2',
    category: 'Leadership',
    title: "The 5-minute intervention principle",
    content: "Address small issues immediately before they become large problems. When you notice a team member veering off course, a quick 5-minute conversation can prevent weeks of misalignment. This requires both awareness and courage. Most leaders wait too long to intervene, allowing small issues to compound. The best leaders make micro-corrections early and often.",
    date: today,
  },
  {
    id: 'l3',
    category: 'Leadership',
    title: "Lead with questions, not answers",
    content: "Great leaders don't provide all the answers; they ask the right questions. By asking thoughtful questions, you empower your team to think critically and develop their own solutions. This builds ownership and develops future leaders. Start meetings with questions rather than directives, and practice active listening without immediately jumping to your own conclusions.",
    date: getPastDate(1),
  },
  {
    id: 'l4',
    category: 'Leadership',
    title: "The leadership energy transfer",
    content: "Your emotional state is contagious. As a leader, your mood creates a multiplier effect throughout your team. Before entering any interaction, take a moment to check your emotional state. Are you bringing energy that will elevate or drain your team? This awareness allows you to regulate your impact and create the emotional climate needed for your team to thrive.",
    date: getPastDate(2),
  },
  
  // Productivity items
  {
    id: 'p1',
    category: 'Productivity',
    title: "Batching kills distractions. Try time-blocking.",
    content: "Context switching costs you 23 minutes of focus each time. Instead of reactive work, group similar tasks into dedicated time blocks on your calendar. Spend 90-120 minutes in deep work sessions on a single category of tasks. Your brain operates more efficiently when it doesn't need to constantly recalibrate to different types of thinking. Start with just one batch per day and expand as you see results.",
    date: today,
  },
  {
    id: 'p2',
    category: 'Productivity',
    title: "The 2-minute rule for instant momentum",
    content: "If a task takes less than 2 minutes, do it immediately rather than scheduling it for later. This prevents small tasks from accumulating and creating mental overhead. The principle applies to both work and personal tasks - responding to simple emails, making quick decisions, or putting items away. This habit eliminates the cognitive load of tracking numerous small obligations.",
    date: today,
  },
  {
    id: 'p3',
    category: 'Productivity',
    title: "Energy management trumps time management",
    content: "Your most important resource isn't time—it's energy. Map your energy patterns throughout the day and schedule your most important work during your peak energy periods. Save administrative or routine tasks for low-energy periods. This approach recognizes that not all hours are equal in terms of your capacity for focused, creative work.",
    date: getPastDate(3),
  },
  {
    id: 'p4',
    category: 'Productivity',
    title: "The weekly review ritual",
    content: "Dedicate 60-90 minutes each week to review your progress, update your systems, and plan the week ahead. This ritual prevents small issues from becoming emergencies and ensures alignment between your daily actions and long-term goals. The most effective leaders protect this time religiously, as it provides the strategic clarity needed for sustained productivity.",
    date: getPastDate(4),
  },
  
  // Finance items
  {
    id: 'f1',
    category: 'Finance',
    title: "The Rule of 72 – your money's doubling timeline",
    content: "Want to know how long it will take for your investment to double? Divide 72 by your expected annual return rate. At 8% growth, your money doubles in 9 years. At 12%, it takes just 6 years. This simple mental math helps you quickly evaluate investment opportunities and understand the power of compound interest over time. Remember that higher returns typically come with higher risk.",
    date: today,
  },
  {
    id: 'f2',
    category: 'Finance',
    title: "Cash flow trumps net worth for daily freedom",
    content: "Many high-net-worth individuals still feel financially constrained because they focus on accumulating assets rather than generating cash flow. True financial freedom comes from having reliable monthly income that exceeds your expenses without requiring your active work. Prioritize investments that generate consistent cash returns, not just appreciation. This creates both psychological freedom and practical options.",
    date: today,
  },
  {
    id: 'f3',
    category: 'Finance',
    title: "The 50/30/20 budget framework",
    content: "Allocate 50% of your after-tax income to needs (housing, food, transportation), 30% to wants (entertainment, dining out), and 20% to savings and debt reduction. This simple framework provides flexibility while ensuring progress toward financial goals. If your fixed expenses exceed 50%, focus on reducing them rather than cutting all discretionary spending, which leads to budget fatigue and abandonment.",
    date: getPastDate(5),
  },
  {
    id: 'f4',
    category: 'Finance',
    title: "The wealth-building hierarchy",
    content: "Build wealth in this order: 1) Emergency fund (3-6 months of expenses), 2) Employer retirement match, 3) High-interest debt, 4) Health Savings Account, 5) Roth/Traditional retirement accounts, 6) Taxable investments. This sequence optimizes tax advantages and return rates. Deviating from this order typically costs you money through missed tax benefits or unnecessary interest payments.",
    date: getPastDate(6),
  },
  
  // Mental Models items
  {
    id: 'm1',
    category: 'Mental Models',
    title: "Inversion: Solve problems backward, not forward",
    content: "Instead of asking \"How do I achieve success?\", ask \"What guarantees failure?\" Avoiding obvious mistakes is often easier and more effective than seeking complex solutions. Charlie Munger calls this \"inversion\" - approaching problems from the opposite direction. For example, to build wealth, first identify all the ways people destroy wealth (debt, emotional trading, etc.) and avoid those behaviors. This negative knowledge often provides clearer guidance than positive advice.",
    date: today,
  },
  {
    id: 'm2',
    category: 'Mental Models',
    title: "Second-order thinking: Look beyond the immediate",
    content: "First-order thinking considers only immediate consequences. Second-order thinking asks \"And then what?\" Most people stop at first-order effects, creating opportunity for those who think deeper. For example, a first-order thinker sees a competitor lowering prices and immediately matches them. A second-order thinker considers how this might trigger a price war, erode industry margins, and explores alternative responses that avoid this destructive cycle.",
    date: today,
  },
  {
    id: 'm3',
    category: 'Mental Models',
    title: "Circle of competence: Know your boundaries",
    content: "Define the areas where you have genuine expertise and stay primarily within those boundaries. The most costly mistakes happen when smart people operate outside their circle of competence with the same confidence they have within it. Regularly audit your circle by asking: \"Do I have significant experience here? Do I understand the fundamental principles? Can I accurately predict outcomes?\"",
    date: getPastDate(1),
  },
  {
    id: 'm4',
    category: 'Mental Models',
    title: "Opportunity cost: The hidden price of every choice",
    content: "Every decision isn't just about what you gain, but what you give up. When you say yes to one opportunity, you're saying no to all alternatives. High performers are ruthless about evaluating opportunity costs, asking not just \"Is this good?\" but \"Is this the absolute best use of my limited resources right now?\" This mindset prevents the accumulation of merely good commitments that crowd out great ones.",
    date: getPastDate(3),
  },
  
  // Performance items
  {
    id: 'perf1',
    category: 'Performance',
    title: "Recovery isn't optional, it's part of the work",
    content: "Elite performers don't work more hours - they recover more strategically. Your body and mind adapt and grow during rest periods, not during stress. Without proper recovery (sleep, nutrition, mental downtime), performance plateaus or declines regardless of effort. Schedule recovery with the same discipline you schedule work. The most sustainable high performers view rest as a competitive advantage, not a luxury.",
    date: today,
  },
  {
    id: 'perf2',
    category: 'Performance',
    title: "The minimum effective dose principle",
    content: "More isn't better; better is better. Identify the smallest intervention that produces the desired result. In fitness, this might mean shorter, more intense workouts rather than marathon sessions. In business, it could mean focusing on the 20% of clients that generate 80% of profit. This principle conserves energy and attention for what truly matters, preventing diminishing returns from excessive effort in any single area.",
    date: today,
  },
  {
    id: 'perf3',
    category: 'Performance',
    title: "Deliberate practice vs. mindless repetition",
    content: "Not all practice is equal. Deliberate practice involves focused attention on specific aspects of performance, immediate feedback, and working at the edge of your capabilities. One hour of deliberate practice outperforms ten hours of mindless repetition. Identify the precise skills that drive results in your field, then design practice sessions that isolate and improve those specific components.",
    date: getPastDate(2),
  },
  {
    id: 'perf4',
    category: 'Performance',
    title: "The performance review ritual",
    content: "After any significant performance (presentation, negotiation, creative work), conduct a structured review. Ask: What went well? What could improve? What surprised me? What will I do differently next time? This simple practice accelerates skill development by converting experiences into insights. The highest performers review even successful performances, recognizing that continuous improvement requires honest self-assessment regardless of outcomes.",
    date: getPastDate(4),
  },
];