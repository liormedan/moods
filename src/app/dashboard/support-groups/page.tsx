'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users,
  MessageCircle,
  Calendar,
  Heart,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  MessageSquare,
  Eye,
  ThumbsUp,
  Share2,
  Flag,
  Settings,
  Crown,
  Shield,
  Zap,
  BookOpen,
  Video,
  Mic,
  Camera,
  Send,
  Smile,
  Paperclip,
  MoreHorizontal,
} from 'lucide-react';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category:
    | 'anxiety'
    | 'depression'
    | 'general'
    | 'addiction'
    | 'trauma'
    | 'relationships'
    | 'grief'
    | 'stress';
  type: 'public' | 'private' | 'closed';
  memberCount: number;
  isJoined: boolean;
  isModerator: boolean;
  lastActivity: string;
  tags: string[];
  meetingSchedule?: {
    day: string;
    time: string;
    frequency: 'weekly' | 'biweekly' | 'monthly';
  };
  onlineStatus: 'online' | 'offline' | 'scheduled';
  rating: number;
  language: 'hebrew' | 'english' | 'arabic';
}

interface Post {
  id: string;
  groupId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
  type: 'discussion' | 'question' | 'support' | 'resource' | 'announcement';
}

interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'meeting' | 'workshop' | 'webinar' | 'social';
  isOnline: boolean;
  location?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isRegistered: boolean;
}

export default function SupportGroupsPage() {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'groups' | 'posts' | 'events' | 'my-groups'
  >('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, postsRes, eventsRes] = await Promise.all([
        fetch('/api/support-groups'),
        fetch('/api/support-groups/posts'),
        fetch('/api/support-groups/events'),
      ]);

      if (groupsRes.ok) {
        const groupsResult = await groupsRes.json();
        setGroups(groupsResult.data);
      }

      if (postsRes.ok) {
        const postsResult = await postsRes.json();
        setPosts(postsResult.data);
      }

      if (eventsRes.ok) {
        const eventsResult = await eventsRes.json();
        setEvents(eventsResult.data);
      }
    } catch (error) {
      console.error('Error loading support groups data:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      await fetch(`/api/support-groups/${groupId}/join`, { method: 'POST' });
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
            : group
        )
      );
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      await fetch(`/api/support-groups/${groupId}/leave`, { method: 'POST' });
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, isJoined: false, memberCount: group.memberCount - 1 }
            : group
        )
      );
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const likePost = async (postId: string) => {
    try {
      await fetch(`/api/support-groups/posts/${postId}/like`, {
        method: 'POST',
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const registerForEvent = async (eventId: string) => {
    try {
      await fetch(`/api/support-groups/events/${eventId}/register`, {
        method: 'POST',
      });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
                ...event,
                isRegistered: true,
                currentParticipants: event.currentParticipants + 1,
              }
            : event
        )
      );
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anxiety':
        return <Zap className="w-4 h-4" />;
      case 'depression':
        return <Heart className="w-4 h-4" />;
      case 'general':
        return <Users className="w-4 h-4" />;
      case 'addiction':
        return <Shield className="w-4 h-4" />;
      case 'trauma':
        return <BookOpen className="w-4 h-4" />;
      case 'relationships':
        return <Heart className="w-4 h-4" />;
      case 'grief':
        return <Heart className="w-4 h-4" />;
      case 'stress':
        return <Zap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'anxiety':
        return 'חרדה';
      case 'depression':
        return 'דיכאון';
      case 'general':
        return 'כללי';
      case 'addiction':
        return 'התמכרויות';
      case 'trauma':
        return 'טראומה';
      case 'relationships':
        return 'מערכות יחסים';
      case 'grief':
        return 'אבל';
      case 'stress':
        return 'מתח';
      default:
        return 'כללי';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'closed':
        return <Shield className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'discussion':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'question':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'support':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'resource':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'announcement':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || group.category === categoryFilter;
    const matchesType = typeFilter === 'all' || group.type === typeFilter;

    if (activeTab === 'my-groups') {
      return group.isJoined && matchesSearch && matchesCategory && matchesType;
    }

    return matchesSearch && matchesCategory && matchesType;
  });

  const myGroups = groups.filter((group) => group.isJoined);
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .slice(0, 3);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען קבוצות תמיכה...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-8 h-8" />
              קבוצות תמיכה
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              התחבר לקהילה תומכת ושתף את החוויות שלך
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCreateGroup(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              צור קבוצה
            </Button>
            <Button onClick={() => setShowCreatePost(true)} variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              פרסם הודעה
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    קבוצות זמינות
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{myGroups.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    הקבוצות שלי
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    פוסטים פעילים
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {upcomingEvents.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    אירועים קרובים
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'groups', label: 'כל הקבוצות', icon: Users },
            { id: 'my-groups', label: 'הקבוצות שלי', icon: UserPlus },
            { id: 'posts', label: 'פוסטים', icon: MessageCircle },
            { id: 'events', label: 'אירועים', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        {(activeTab === 'groups' || activeTab === 'my-groups') && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="חפש קבוצות..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הקטגוריות</SelectItem>
                    <SelectItem value="anxiety">חרדה</SelectItem>
                    <SelectItem value="depression">דיכאון</SelectItem>
                    <SelectItem value="general">כללי</SelectItem>
                    <SelectItem value="addiction">התמכרויות</SelectItem>
                    <SelectItem value="trauma">טראומה</SelectItem>
                    <SelectItem value="relationships">מערכות יחסים</SelectItem>
                    <SelectItem value="grief">אבל</SelectItem>
                    <SelectItem value="stress">מתח</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסוגים</SelectItem>
                    <SelectItem value="public">פומבי</SelectItem>
                    <SelectItem value="private">פרטי</SelectItem>
                    <SelectItem value="closed">סגור</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content based on active tab */}
        {(activeTab === 'groups' || activeTab === 'my-groups') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(group.category)}
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(group.type)}
                      {group.isModerator && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.memberCount} חברים
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {group.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPostTypeColor('discussion')}`}
                    >
                      {getCategoryLabel(group.category)}
                    </span>
                    {group.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {group.meetingSchedule && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {group.meetingSchedule.day} {group.meetingSchedule.time}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {group.isJoined ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          צפה בקבוצה
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => leaveGroup(group.id)}
                        >
                          עזוב
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => joinGroup(group.id)}
                        className="flex-1"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        הצטרף
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.authorName.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{post.authorName}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString('he-IL')}
                        </span>
                        {post.isPinned && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPostTypeColor(post.type)}`}
                        >
                          {post.type === 'discussion'
                            ? 'דיון'
                            : post.type === 'question'
                              ? 'שאלה'
                              : post.type === 'support'
                                ? 'תמיכה'
                                : post.type === 'resource'
                                  ? 'משאב'
                                  : 'הודעה'}
                        </span>
                      </div>

                      <h4 className="font-medium mb-2">{post.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likePost(post.id)}
                          className={post.isLiked ? 'text-red-500' : ''}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`}
                          />
                          {post.likes}
                        </Button>

                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.replies}
                        </Button>

                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          שתף
                        </Button>

                        <Button variant="ghost" size="sm" className="mr-auto">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'meeting'
                          ? 'bg-blue-100 text-blue-700'
                          : event.type === 'workshop'
                            ? 'bg-green-100 text-green-700'
                            : event.type === 'webinar'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {event.type === 'meeting'
                        ? 'פגישה'
                        : event.type === 'workshop'
                          ? 'סדנה'
                          : event.type === 'webinar'
                            ? 'וובינר'
                            : 'חברתי'}
                    </span>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString(
                        'he-IL'
                      )} בשעה {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      משך: {event.duration} דקות
                    </div>
                    {event.isOnline ? (
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        מקוון
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.currentParticipants}
                      {event.maxParticipants &&
                        `/${event.maxParticipants}`}{' '}
                      משתתפים
                    </div>
                  </div>

                  <Button
                    onClick={() => registerForEvent(event.id)}
                    disabled={
                      event.isRegistered ||
                      !!(event.maxParticipants &&
                        event.currentParticipants >= event.maxParticipants)
                    }
                    className="w-full"
                  >
                    {event.isRegistered ? 'רשום' : 'הירשם לאירוע'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Events Sidebar */}
        {activeTab !== 'events' && upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                אירועים קרובים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString('he-IL')} •{' '}
                        {event.time}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      פרטים
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
