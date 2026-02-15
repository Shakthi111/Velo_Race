
export type CommunityTier = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserStats {
  totalDistance: number;
  totalPoints: number; // Legacy field
  currentStreak: number;
  bestPace: number; // minutes per km
  activitiesCount: number;
  racesCompleted: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Simulated storage
  avatar: string;
  createdAt: string;
  goals: {
    weeklyDistance: number;
    monthlyDistance: number;
  };
  stats: UserStats;
  following: string[]; // user IDs
  followers: string[]; // user IDs
  showcaseBadges: string[]; // badge IDs
  
  // Gamification Fields
  location: string;
  communityTier: CommunityTier;
  
  // XP SYSTEM (Progression - NEVER decreases)
  personalXP: number; // Current XP toward next tier
  totalXPEarned: number; // Lifetime XP earned
  
  // CREDITS SYSTEM (Spending - CAN decrease)
  credits: number; // Current spendable balance
  totalCreditsEarned: number; // Lifetime credits earned
  creditsSpent: number; // Total credits spent
  
  // Statistics & Ranks
  cravingsPurchased: number;
  eventParticipations: number;
  eventsAttended: number; // Legacy, kept for compatibility
  cravingsSatisfied: number; // Legacy, mapped to cravingsPurchased
  globalRank: number;
  communityRank: number;
}

export interface Activity {
  id: string;
  userId: string;
  date: string;
  distance: number; // km
  time: number; // minutes
  pace: number; // min/km
  type: string;
  notes: string;
  xpEarned: number;
  creditsEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  unlockedAt: string;
}

export interface Friendship {
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted';
}

export interface FeedItem {
  id: string;
  userId: string;
  activityId?: string;
  type: 'activity' | 'badge' | 'follow' | 'tier_up' | 'event_join';
  timestamp: string;
  likes: string[]; // user IDs
  comments: { userId: string; text: string; timestamp: string }[];
  data?: any; // Extra data for events/tiers
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string; // Changed from receiverId to match store usage
  text: string; // Changed from content to match store usage
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'activity' | 'message' | 'event' | 'tier_promotion' | 'badge';
  message: string;
  sourceUserId?: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

// --- Gamification Types ---

export interface CravingItem {
  id: string;
  name: string;
  description: string;
  creditsCost: number;
  icon: string;
  category: 'food' | 'rest' | 'treat';
}

export interface CommunityEvent {
  id: string;
  communityId: string; // e.g., "Chennai-Beginner"
  title: string;
  date: string;
  location: string;
  description: string;
  participants: string[];
  status: 'upcoming' | 'completed';
  creditsCost?: number; // Entry cost
  image?: string; // Hero image URL
  activities?: { name: string; icon: string; creditsCost: number }[]; // Event specific activities
}

export interface CommunityData {
  id: string; // "Location-Tier"
  location: string;
  tier: CommunityTier;
  currentXP: number;
  xpThreshold: number;
  nextEventDate?: string;
}

export interface CurrencyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus' | 'adjustment';
  xpAmount: number;
  creditsAmount: number;
  source: string;
  timestamp: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  activities: Activity[];
  badges: Badge[];
  userBadges: UserBadge[];
  friendships: Friendship[];
  activityFeed: FeedItem[];
  notifications: Notification[];
  messages: Message[]; // Legacy
  directMessages: DirectMessage[]; // New system
  
  // Gamification State
  communities: Record<string, CommunityData>; // key is "Location-Tier"
  communityEvents: CommunityEvent[];
  cravingsHistory: { userId: string; cravingId: string; date: string; cost: number }[];
  currencyTransactions: CurrencyTransaction[];
}
