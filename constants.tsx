
import React from 'react';
import { Badge, User, CravingItem, CommunityData, CommunityEvent } from './types';

export const LOCATIONS = [
  'Chennai', 'Coimbatore', 'Bangalore', 'Mumbai', 'Delhi', 
  'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi'
];

export const TIER_COLORS = {
  Beginner: { bg: 'bg-[#A8E6CF]', text: 'text-green-800', border: 'border-green-200' },
  Intermediate: { bg: 'bg-[#80D8FF]', text: 'text-blue-800', border: 'border-blue-200' },
  Advanced: { bg: 'bg-[#FFB74D]', text: 'text-orange-800', border: 'border-orange-200' },
  Expert: { bg: 'bg-[#9C27B0]', text: 'text-purple-100', border: 'border-purple-300' },
};

export const CRAVINGS_MENU: CravingItem[] = [
  { id: 'pizza', name: 'Pizza Night', description: 'Enjoy a guilt-free pizza!', creditsCost: 100, icon: '🍕', category: 'food' },
  { id: 'ice-cream', name: 'Ice Cream Treat', description: 'Sweet reward for your efforts', creditsCost: 50, icon: '🍦', category: 'food' },
  { id: 'rest-day', name: 'Rest Day Pass', description: 'Take a day off without guilt', creditsCost: 150, icon: '🛌', category: 'rest' },
  { id: 'burger', name: 'Burger Feast', description: 'Treat yourself!', creditsCost: 120, icon: '🍔', category: 'food' },
  { id: 'dessert', name: 'Dessert Indulgence', description: 'Sweet satisfaction', creditsCost: 80, icon: '🍰', category: 'food' },
  { id: 'movie-night', name: 'Movie Marathon', description: 'Relax with entertainment', creditsCost: 60, icon: '🎬', category: 'treat' },
  { id: 'sleep-in', name: 'Sleep In Late', description: 'Skip the morning run', creditsCost: 100, icon: '😴', category: 'rest' },
  { id: 'cheat-meal', name: 'Cheat Meal Pass', description: 'Anything you want!', creditsCost: 200, icon: '🍽️', category: 'food' },
];

// Cumulative XP required to REACH the NEXT tier
export const XP_THRESHOLDS = {
  Beginner: 2000,      // 0-1999
  Intermediate: 7000,  // 2000-6999 (Requires +5000)
  Advanced: 17000,     // 7000-16999 (Requires +10000)
  Expert: 999999       // 17000+ (No limit)
};

export const COMMUNITY_XP_THRESHOLDS = {
  Beginner: 100000,
  Intermediate: 200000,
  Advanced: 350000,
  Expert: 500000
};

export const EVENT_IMAGES = {
  gathering: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
  collaborative: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  challenge: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
  party: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
  food: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
  music: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
  social: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
};

export const INITIAL_BADGES: Badge[] = [
  { id: 'b2', name: '10km Milestone', description: 'Reach 10km total distance', icon: '🥉', criteria: 'distance >= 10' },
  { id: 'b3', name: '50km Milestone', description: 'Reach 50km total distance', icon: '🥈', criteria: 'distance >= 50' },
  { id: 'b4', name: '100km Milestone', description: 'Reach 100km total distance', icon: '🥇', criteria: 'distance >= 100' },
  { id: 'b5', name: 'Streak Starter', description: 'Run 3 days in a row', icon: '🔥', criteria: 'streak >= 3' },
  { id: 'b6', name: 'Week Warrior', description: 'Run 7 days in a row', icon: '⚡', criteria: 'streak >= 7' },
  { id: 'b7', name: 'Speed Demon', description: 'Sub-25 min 5K', icon: '🏎️', criteria: 'pace_5k < 5.0' },
  { id: 'b8', name: 'Early Bird', description: 'Run before 6 AM', icon: '🌅', criteria: 'time < 06:00' },
  { id: 'gam_1', name: 'XP Hoarder', description: 'Accumulate 5,000 Personal XP', icon: '💎', criteria: 'xp >= 5000' },
  { id: 'gam_2', name: 'Community Pillar', description: 'Attend 1 Community Event', icon: '🏛️', criteria: 'events >= 1' },
  { id: 'cr_1', name: 'First Payday', description: 'Earn your first 100 Credits', icon: '💰', criteria: 'credits_earned >= 100' },
  { id: 'cr_2', name: 'Big Spender', description: 'Spend 500 Credits', icon: '🛍️', criteria: 'credits_spent >= 500' },
];

export const SAMPLE_USERS: User[] = [
  {
    id: 'u1',
    username: 'TrailBlazer',
    email: 'trail@example.com',
    avatar: 'https://picsum.photos/seed/user1/200',
    createdAt: new Date().toISOString(),
    goals: { weeklyDistance: 25, monthlyDistance: 100 },
    stats: { totalDistance: 154, totalPoints: 1200, currentStreak: 5, bestPace: 4.5, activitiesCount: 15, racesCompleted: 4 },
    following: ['u2'],
    followers: ['u2', 'u3'],
    showcaseBadges: ['b2'],
    location: 'Chennai',
    communityTier: 'Intermediate',
    personalXP: 2500,
    totalXPEarned: 2500,
    credits: 650,
    totalCreditsEarned: 1400,
    creditsSpent: 750,
    cravingsSatisfied: 8,
    cravingsPurchased: 8,
    eventsAttended: 1,
    eventParticipations: 1,
    globalRank: 2,
    communityRank: 1
  },
  {
    id: 'u2',
    username: 'PaceMaker',
    email: 'pace@example.com',
    avatar: 'https://picsum.photos/seed/user2/200',
    createdAt: new Date().toISOString(),
    goals: { weeklyDistance: 30, monthlyDistance: 120 },
    stats: { totalDistance: 82, totalPoints: 850, currentStreak: 2, bestPace: 5.1, activitiesCount: 8, racesCompleted: 2 },
    following: ['u1', 'u3'],
    followers: ['u1'],
    showcaseBadges: [],
    location: 'Chennai',
    communityTier: 'Beginner',
    personalXP: 450,
    totalXPEarned: 450,
    credits: 280,
    totalCreditsEarned: 530,
    creditsSpent: 250,
    cravingsSatisfied: 3,
    cravingsPurchased: 3,
    eventsAttended: 0,
    eventParticipations: 0,
    globalRank: 3,
    communityRank: 1
  },
  {
    id: 'u3',
    username: 'MountainGoat',
    email: 'goat@example.com',
    avatar: 'https://picsum.photos/seed/user3/200',
    createdAt: new Date().toISOString(),
    goals: { weeklyDistance: 15, monthlyDistance: 60 },
    stats: { totalDistance: 210, totalPoints: 2100, currentStreak: 12, bestPace: 4.8, activitiesCount: 22, racesCompleted: 6 },
    following: ['u1'],
    followers: ['u2'],
    showcaseBadges: ['b2', 'b3', 'b4'],
    location: 'Bangalore',
    communityTier: 'Advanced',
    personalXP: 7800,
    totalXPEarned: 7800,
    credits: 1200,
    totalCreditsEarned: 3000,
    creditsSpent: 1800,
    cravingsSatisfied: 15,
    cravingsPurchased: 15,
    eventsAttended: 3,
    eventParticipations: 3,
    globalRank: 1,
    communityRank: 1
  }
];

export const INITIAL_MESSAGES: any[] = [
  { id: 'm1', senderId: 'u2', recipientId: 'u1', text: 'Hey! Nice run yesterday.', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'm2', senderId: 'u1', recipientId: 'u2', text: 'Thanks! My legs are still feeling it though. 😅', timestamp: new Date(Date.now() - 172700000).toISOString() },
];

export const SAMPLE_EVENTS: CommunityEvent[] = [
  {
    id: 'ev1',
    communityId: 'Chennai-Beginner',
    title: 'Marina Beach Sunrise Run',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    location: 'Lighthouse, Marina Beach',
    description: 'A casual 3K run followed by breakfast. All beginners welcome to join this refreshing start to the day!',
    participants: ['u2'],
    status: 'upcoming',
    creditsCost: 50,
    image: EVENT_IMAGES.gathering,
    activities: [
        { name: 'Group Run', icon: '🏃', creditsCost: 0 },
        { name: 'Breakfast', icon: '🥞', creditsCost: 50 }
    ]
  },
  {
    id: 'ev2',
    communityId: 'Chennai-Intermediate',
    title: 'ECR 10K Challenge',
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    location: 'Thiruvanmiyur Beach',
    description: 'Push your limits with a scenic 10K. Hydration points provided along the route.',
    participants: ['u1'],
    status: 'upcoming',
    creditsCost: 100,
    image: EVENT_IMAGES.challenge,
    activities: [
        { name: 'Race Entry', icon: '🏁', creditsCost: 50 },
        { name: 'Medal', icon: '🥇', creditsCost: 50 }
    ]
  }
];

export const INITIAL_COMMUNITIES: Record<string, CommunityData> = {
  'Chennai-Beginner': {
    id: 'Chennai-Beginner',
    location: 'Chennai',
    tier: 'Beginner',
    currentXP: 35000,
    xpThreshold: 100000,
    nextEventDate: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  'Chennai-Intermediate': {
    id: 'Chennai-Intermediate',
    location: 'Chennai',
    tier: 'Intermediate',
    currentXP: 60000,
    xpThreshold: 200000,
    nextEventDate: new Date(Date.now() + 86400000 * 5).toISOString()
  },
  'Bangalore-Advanced': {
    id: 'Bangalore-Advanced',
    location: 'Bangalore',
    tier: 'Advanced',
    currentXP: 80000,
    xpThreshold: 350000,
  }
};
