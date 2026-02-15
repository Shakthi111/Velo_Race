
import { AppState, User, Activity, Badge, UserBadge, Friendship, FeedItem, Message, CommunityTier, CommunityData, CommunityEvent, CurrencyTransaction, DirectMessage, Notification } from './types';
import { INITIAL_BADGES, SAMPLE_USERS, INITIAL_MESSAGES, XP_THRESHOLDS, COMMUNITY_XP_THRESHOLDS, INITIAL_COMMUNITIES, SAMPLE_EVENTS, CRAVINGS_MENU } from './constants';

const STORAGE_KEY = 'velorace_data_v4_fix';

const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  // Initialize sample users with a default password for the demo
  const usersWithPasswords = SAMPLE_USERS.map(u => ({ ...u, password: 'password123' }));

  return {
    currentUser: null, // Start unauthenticated
    users: usersWithPasswords,
    activities: [],
    badges: INITIAL_BADGES,
    userBadges: [],
    friendships: [],
    activityFeed: [],
    notifications: [],
    messages: INITIAL_MESSAGES,
    directMessages: [],
    communities: INITIAL_COMMUNITIES,
    communityEvents: SAMPLE_EVENTS,
    cravingsHistory: [],
    currencyTransactions: []
  };
};

export class AppStore {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = getInitialState();
  }

  getState() {
    return this.state;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  login(identifier: string, password: string): { success: boolean; message: string } {
    const user = this.state.users.find(u => 
      (u.username === identifier || u.email === identifier) && u.password === password
    );

    if (user) {
      this.state.currentUser = user;
      // Recalculate ranks on login
      this.updateUserRanks(user.id);
      this.save();
      return { success: true, message: 'Logged in successfully' };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  signup(username: string, email: string, password: string, location: string, paceLevel: string): { success: boolean; message: string } {
    if (this.state.users.some(u => u.username === username || u.email === email)) {
      return { success: false, message: 'Username or email already exists' };
    }

    // Determine initial tier based on pace
    let tier: CommunityTier = 'Beginner';
    if (paceLevel === 'Intermediate') tier = 'Intermediate';
    if (paceLevel === 'Advanced') tier = 'Advanced';
    if (paceLevel === 'Expert') tier = 'Expert';

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      avatar: `https://picsum.photos/seed/${username}/200`,
      createdAt: new Date().toISOString(),
      goals: { weeklyDistance: 20, monthlyDistance: 80 },
      stats: { totalDistance: 0, totalPoints: 0, currentStreak: 0, bestPace: 0, activitiesCount: 0, racesCompleted: 0 },
      following: [],
      followers: [],
      showcaseBadges: [],
      // New fields
      location,
      communityTier: tier,
      personalXP: 0,
      totalXPEarned: 0,
      credits: 0,
      totalCreditsEarned: 0,
      creditsSpent: 0,
      cravingsSatisfied: 0,
      cravingsPurchased: 0,
      eventsAttended: 0,
      eventParticipations: 0,
      globalRank: this.state.users.length + 1,
      communityRank: 1
    };

    // Initialize community if needed
    const commId = `${location}-${tier}`;
    if (!this.state.communities[commId]) {
      this.state.communities[commId] = {
        id: commId,
        location,
        tier,
        currentXP: 0,
        xpThreshold: COMMUNITY_XP_THRESHOLDS[tier] || 100000,
      };
    }

    this.state.users.push(newUser);
    this.state.currentUser = newUser;
    this.save();
    return { success: true, message: 'Account created successfully' };
  }

  logout() {
    this.state.currentUser = null;
    this.save();
  }

  // --- Rank Calculation ---
  private updateUserRanks(userId: string) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    // Global Rank
    const sortedGlobal = [...this.state.users].sort((a, b) => b.personalXP - a.personalXP);
    const globalRank = sortedGlobal.findIndex(u => u.id === userId) + 1;
    
    // Community Rank
    const sortedCommunity = this.state.users
      .filter(u => u.location === user.location && u.communityTier === user.communityTier)
      .sort((a, b) => b.personalXP - a.personalXP);
    const communityRank = sortedCommunity.findIndex(u => u.id === userId) + 1;

    user.globalRank = globalRank;
    user.communityRank = communityRank;
  }

  // --- Dual Currency Calculation ---
  calculateRewards(distance: number, time: number, pace: number): { xp: number; credits: number } {
    const baseScore = (distance * 10) + (time * 0.5);
    
    let xp = baseScore;
    let credits = baseScore;
    
    // Pace Bonuses
    let multiplier = 1.0;
    if (pace < 3) multiplier = 1.6; // Sub-3: +60%
    else if (pace < 4) multiplier = 1.4; // Sub-4: +40%
    else if (pace < 5) multiplier = 1.2; // Sub-5: +20%
    
    xp *= multiplier;
    credits *= multiplier;

    return { 
      xp: Math.floor(xp), 
      credits: Math.floor(credits) 
    };
  }

  addActivity(activity: Omit<Activity, 'id' | 'pace' | 'xpEarned' | 'creditsEarned'>) {
    const pace = activity.time / activity.distance;
    const rewards = this.calculateRewards(activity.distance, activity.time, pace);

    // Add Streak Bonus
    if (this.state.currentUser && this.state.currentUser.stats.currentStreak > 0) {
        rewards.xp += 10;
        rewards.credits += 10;
    }

    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      pace,
      xpEarned: rewards.xp,
      creditsEarned: rewards.credits
    };

    this.state.activities.push(newActivity);
    
    if (this.state.currentUser) {
      const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
      if (user) {
        // Update User Stats
        user.stats.totalDistance += activity.distance;
        user.stats.totalPoints += rewards.xp;
        user.stats.activitiesCount += 1;
        if (pace < user.stats.bestPace || user.stats.bestPace === 0) {
          user.stats.bestPace = pace;
        }
        user.stats.currentStreak += 1;
        
        // Update XP & Credits
        user.personalXP += rewards.xp;
        user.totalXPEarned += rewards.xp;
        user.credits += rewards.credits;
        user.totalCreditsEarned += rewards.credits;

        // Log Transaction
        this.logTransaction(user.id, 'earned', rewards.xp, rewards.credits, `activity-${newActivity.type.toLowerCase()}`);

        // Update Community XP
        const commId = `${user.location}-${user.communityTier}`;
        if (!this.state.communities[commId]) {
             this.state.communities[commId] = {
                id: commId,
                location: user.location,
                tier: user.communityTier,
                currentXP: 0,
                xpThreshold: COMMUNITY_XP_THRESHOLDS[user.communityTier] || 100000,
             };
        }
        const community = this.state.communities[commId];
        community.currentXP += rewards.xp;

        // Trigger Community Event if Threshold Reached
        if (community.currentXP >= community.xpThreshold) {
          community.currentXP = 0; // Reset
          this.triggerCommunityEvent(community);
          this.sendNotification(user.id, 'event', `🎉 Community Event Unlocked for ${user.location} ${user.communityTier}s!`);
        }

        // Check for Tier Promotion
        this.checkTierPromotion(user);
        this.updateUserRanks(user.id);
        
        // Notify
        this.sendNotification(user.id, 'activity', `You earned ${rewards.xp} XP & ${rewards.credits} Credits!`);
      }
    }

    this.state.activityFeed.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: activity.userId,
      activityId: newActivity.id,
      type: 'activity',
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    });

    this.checkBadges(activity.userId);
    this.save();
  }

  deleteActivity(activityId: string) {
    const index = this.state.activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      const activity = this.state.activities[index];
      const user = this.state.users.find(u => u.id === activity.userId);
      
      const xp = activity.xpEarned || 0;
      const credits = activity.creditsEarned || 0;
      const distance = activity.distance || 0;

      if (user) {
        // Revert User Stats
        user.stats.totalDistance = Math.max(0, user.stats.totalDistance - distance);
        user.stats.totalPoints = Math.max(0, user.stats.totalPoints - xp);
        user.stats.activitiesCount = Math.max(0, user.stats.activitiesCount - 1);
        
        // Revert XP & Credits
        user.personalXP = Math.max(0, user.personalXP - xp);
        user.totalXPEarned = Math.max(0, user.totalXPEarned - xp);
        user.credits = Math.max(0, user.credits - credits);
        user.totalCreditsEarned = Math.max(0, user.totalCreditsEarned - credits);

        // Log Reversal
        this.logTransaction(user.id, 'adjustment', -xp, -credits, `delete-activity-${activity.id}`);

        // Revert Community XP
        const commId = `${user.location}-${user.communityTier}`;
        if (this.state.communities[commId]) {
            this.state.communities[commId].currentXP = Math.max(0, this.state.communities[commId].currentXP - xp);
        }

        this.updateUserRanks(user.id);
      }

      this.state.activities.splice(index, 1);
      this.state.activityFeed = this.state.activityFeed.filter(f => f.activityId !== activityId);
      this.save();
    }
  }

  // --- Notifications & Messaging ---
  sendDirectMessage(senderId: string, recipientId: string, text: string) {
      const newMessage: DirectMessage = {
          id: Math.random().toString(36).substr(2, 9),
          senderId,
          recipientId,
          text,
          timestamp: new Date().toISOString(),
          read: false
      };
      
      if (!this.state.directMessages) this.state.directMessages = [];
      this.state.directMessages.push(newMessage);
      
      // Send notification to recipient
      const sender = this.state.users.find(u => u.id === senderId);
      this.sendNotification(recipientId, 'message', `New message from ${sender?.username || 'someone'}`, senderId);
      
      this.save();
  }

  sendNotification(userId: string, type: Notification['type'], message: string, sourceUserId?: string) {
      const notification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          type,
          message,
          sourceUserId,
          timestamp: new Date().toISOString(),
          read: false
      };
      if (!this.state.notifications) this.state.notifications = [];
      this.state.notifications.unshift(notification);
      this.save();
  }

  markNotificationsRead(userId: string) {
      if (this.state.notifications) {
          this.state.notifications.forEach(n => {
              if (n.userId === userId) n.read = true;
          });
          this.save();
      }
  }

  private logTransaction(userId: string, type: 'earned' | 'spent' | 'bonus' | 'adjustment', xp: number, credits: number, source: string) {
      const user = this.state.users.find(u => u.id === userId);
      if (!user) return;

      const tx: CurrencyTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          type,
          xpAmount: xp,
          creditsAmount: credits,
          source,
          timestamp: new Date().toISOString()
      };
      if (!this.state.currencyTransactions) this.state.currencyTransactions = [];
      this.state.currencyTransactions.unshift(tx);
  }

  private triggerCommunityEvent(community: CommunityData) {
    const newEvent: CommunityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        communityId: community.id,
        title: `${community.location} ${community.tier} Gathering`,
        date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days later
        location: 'City Center Park',
        description: 'We hit our XP goal! Time to celebrate.',
        participants: [],
        status: 'upcoming',
        creditsCost: 50
    };
    this.state.communityEvents.unshift(newEvent);
  }

  private checkTierPromotion(user: User) {
    let nextTier: CommunityTier | null = null;
    
    // Check total XP against cumulative thresholds
    if (user.communityTier === 'Beginner' && user.personalXP >= XP_THRESHOLDS.Beginner) nextTier = 'Intermediate';
    else if (user.communityTier === 'Intermediate' && user.personalXP >= (XP_THRESHOLDS.Intermediate + XP_THRESHOLDS.Beginner)) nextTier = 'Advanced';
    
    // Correct Logic based on prompt:
    if (user.communityTier === 'Beginner' && user.personalXP >= 2000) nextTier = 'Intermediate';
    else if (user.communityTier === 'Intermediate' && user.personalXP >= 7000) nextTier = 'Advanced';
    else if (user.communityTier === 'Advanced' && user.personalXP >= 17000) nextTier = 'Expert';

    if (nextTier) {
        user.communityTier = nextTier;
        this.sendNotification(user.id, 'tier_promotion', `🏆 PROMOTED! You are now an ${nextTier} runner!`);
        
        this.state.activityFeed.unshift({
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            type: 'tier_up',
            timestamp: new Date().toISOString(),
            likes: [],
            comments: [],
            data: { tier: nextTier }
        });
    }
  }

  // --- Cravings Shop ---
  purchaseCraving(cravingId: string) {
    if (!this.state.currentUser) return { success: false, message: "Not logged in" };
    
    const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
    const craving = CRAVINGS_MENU.find(c => c.id === cravingId);

    if (!user || !craving) return { success: false, message: "Invalid item" };

    if (user.credits < craving.creditsCost) {
        return { success: false, message: `Need ${craving.creditsCost} Credits (You have ${user.credits})` };
    }

    // Spending Transaction (Only Credits decrease)
    user.credits -= craving.creditsCost;
    user.creditsSpent += craving.creditsCost;
    user.cravingsSatisfied = (user.cravingsSatisfied || 0) + 1;
    user.cravingsPurchased = (user.cravingsPurchased || 0) + 1;

    this.state.cravingsHistory.unshift({
        userId: user.id,
        cravingId: cravingId,
        date: new Date().toISOString(),
        cost: craving.creditsCost
    });

    this.logTransaction(user.id, 'spent', 0, craving.creditsCost, `craving-${craving.id}`);

    this.save();
    return { success: true, message: `Purchased ${craving.name}!` };
  }

  joinEvent(eventId: string) {
      if (!this.state.currentUser) return;
      const event = this.state.communityEvents.find(e => e.id === eventId);
      const cost = event?.creditsCost || 0;

      if (!event) return;
      if (event.participants.includes(this.state.currentUser.id)) return;

      const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
      if (!user) return;

      if (user.credits < cost) {
          this.sendNotification(user.id, 'event', `Not enough credits to join! Need ${cost}.`);
          this.save();
          return;
      }

      if (cost > 0) {
          user.credits -= cost;
          user.creditsSpent += cost;
          this.logTransaction(user.id, 'spent', 0, cost, `event-join-${event.id}`);
      }

      event.participants.push(user.id);
      user.eventsAttended = (user.eventsAttended || 0) + 1;
      user.eventParticipations = (user.eventParticipations || 0) + 1;

      this.state.activityFeed.unshift({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'event_join',
        timestamp: new Date().toISOString(),
        likes: [],
        comments: [],
        data: { eventTitle: event.title }
      });
      
      this.save();
  }

  toggleFollow(targetUserId: string) {
    if (!this.state.currentUser) return;
    const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
    const targetUser = this.state.users.find(u => u.id === targetUserId);
    if (!user || !targetUser) return;

    const index = user.following.indexOf(targetUserId);
    if (index === -1) {
      user.following.push(targetUserId);
      if (!targetUser.followers) targetUser.followers = [];
      targetUser.followers.push(user.id);
      
      this.state.activityFeed.unshift({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'follow',
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
      });
      
      this.sendNotification(targetUserId, 'activity', `${user.username} started following you!`, user.id);
    } else {
      user.following.splice(index, 1);
      const followerIndex = targetUser.followers.indexOf(user.id);
      if (followerIndex !== -1) targetUser.followers.splice(followerIndex, 1);
    }
    this.save();
  }

  updateGoals(weekly: number, monthly: number) {
    if (!this.state.currentUser) return;
    const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
    if (user) {
      user.goals = { weeklyDistance: weekly, monthlyDistance: monthly };
      this.save();
    }
  }

  updateShowcase(badgeIds: string[]) {
    if (!this.state.currentUser) return;
    const user = this.state.users.find(u => u.id === this.state.currentUser?.id);
    if (user) {
      user.showcaseBadges = badgeIds;
      this.save();
    }
  }

  // Helper method for legacy call
  sendMessage(recipientId: string, text: string) {
      if (!this.state.currentUser) return;
      this.sendDirectMessage(this.state.currentUser.id, recipientId, text);
  }

  likeFeedItem(itemId: string) {
    if (!this.state.currentUser) return;
    const item = this.state.activityFeed.find(f => f.id === itemId);
    if (item) {
      const index = item.likes.indexOf(this.state.currentUser.id);
      if (index === -1) {
        item.likes.push(this.state.currentUser.id);
      } else {
        item.likes.splice(index, 1);
      }
      this.save();
    }
  }

  dismissNotification(id: string) {
    this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    this.save();
  }

  private checkBadges(userId: string) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;
    const existingBadgeIds = new Set(this.state.userBadges.filter(ub => ub.userId === userId).map(ub => ub.badgeId));
    
    const unlock = (badgeId: string) => {
      if (!existingBadgeIds.has(badgeId)) {
        const badge = this.state.badges.find(b => b.id === badgeId);
        this.state.userBadges.push({ userId, badgeId, unlockedAt: new Date().toISOString() });
        this.state.activityFeed.unshift({ id: Math.random().toString(36).substr(2, 9), userId, type: 'badge', timestamp: new Date().toISOString(), likes: [], comments: [] });
        
        if (badge) {
          this.sendNotification(userId, 'badge', `New Badge Unlocked: ${badge.name}!`);
        }
      }
    };

    if (user.stats.totalDistance >= 10) unlock('b2');
    if (user.stats.totalDistance >= 50) unlock('b3');
    if (user.stats.totalDistance >= 100) unlock('b4');
    if (user.stats.currentStreak >= 3) unlock('b5');
    if (user.stats.currentStreak >= 7) unlock('b6');
    // Gamification badges
    if (user.personalXP >= 5000) unlock('gam_1');
    if (user.eventsAttended >= 1) unlock('gam_2');
    if (user.totalCreditsEarned >= 100) unlock('cr_1');
    if (user.creditsSpent >= 500) unlock('cr_2');
  }
}

export const appStore = new AppStore();
