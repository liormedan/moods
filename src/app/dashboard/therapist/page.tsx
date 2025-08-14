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
  UserCheck,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  Mail,
  MapPin,
  Star,
  Clock,
  Shield,
  Share2,
  Search,
  Filter,
  Plus,
  Send,
  FileText,
  Download,
  Upload,
  Heart,
  Brain,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  location: string;
  isOnline: boolean;
  priceRange: string;
  availability: string[];
  bio: string;
  education: string[];
  certifications: string[];
  profileImage?: string;
  isVerified: boolean;
  responseTime: string;
}

interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  notes?: string;
  cost: number;
}

interface Message {
  id: string;
  therapistId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'appointment' | 'report';
}

export default function TherapistPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'find' | 'appointments' | 'messages' | 'my-therapist'>('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [currentTherapist, setCurrentTherapist] = useState<Therapist | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [therapistsRes, appointmentsRes, messagesRes] = await Promise.all([
        fetch('/api/therapists'),
        fetch('/api/therapists/appointments'),
        fetch('/api/therapists/messages'),
      ]);

      if (therapistsRes.ok) {
        const therapistsResult = await therapistsRes.json();
        setTherapists(therapistsResult.data);
        // Set current therapist if user has one
        const current = therapistsResult.data.find((t: Therapist) => t.id === 'therapist-1');
        setCurrentTherapist(current);
      }

      if (appointmentsRes.ok) {
        const appointmentsResult = await appointmentsRes.json();
        setAppointments(appointmentsResult.data);
      }

      if (messagesRes.ok) {
        const messagesResult = await messagesRes.json();
        setMessages(messagesResult.data);
      }
    } catch (error) {
      console.error('Error loading therapist data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען מידע מטפלים...</p>
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
              <UserCheck className="w-8 h-8" />
              יצירת קשר עם מטפל
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              מצא מטפל מתאים, קבע פגישות ושתף נתונים בצורה מאובטחת
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'find', label: 'חיפוש מטפלים', icon: Search },
            { id: 'my-therapist', label: 'המטפל שלי', icon: UserCheck },
            { id: 'appointments', label: 'פגישות', icon: Calendar },
            { id: 'messages', label: 'הודעות', icon: MessageSquare },
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
              {tab.id === 'messages' && messages.filter(m => !m.isRead).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'find' && (
          <>
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="חפש מטפלים לפי שם או התמחות..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל ההתמחויות</SelectItem>
                      <SelectItem value="anxiety">חרדה</SelectItem>
                      <SelectItem value="depression">דיכאון</SelectItem>
                      <SelectItem value="trauma">טראומה</SelectItem>
                      <SelectItem value="couples">זוגיות</SelectItem>
                      <SelectItem value="family">משפחה</SelectItem>
                      <SelectItem value="addiction">התמכרויות</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל המיקומים</SelectItem>
                      <SelectItem value="online">מקוון</SelectItem>
                      <SelectItem value="tel-aviv">תל אביב</SelectItem>
                      <SelectItem value="jerusalem">ירושלים</SelectItem>
                      <SelectItem value="haifa">חיפה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Therapists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists
                .filter(therapist => {
                  const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      therapist.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
                  const matchesSpecialization = specializationFilter === 'all' || 
                                               therapist.specializations.includes(specializationFilter);
                  const matchesLocation = locationFilter === 'all' || 
                                         (locationFilter === 'online' && therapist.isOnline) ||
                                         therapist.location.toLowerCase().includes(locationFilter);
                  return matchesSearch && matchesSpecialization && matchesLocation;
                })
                .map((therapist) => (
                  <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {therapist.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{therapist.name}</CardTitle>
                            {therapist.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <CardDescription>{therapist.title}</CardDescription>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{therapist.rating}</span>
                              <span className="text-sm text-gray-500">({therapist.reviewCount})</span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{therapist.experience} שנות ניסיון</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">התמחויות:</h4>
                        <div className="flex flex-wrap gap-1">
                          {therapist.specializations.slice(0, 3).map((spec, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                              {spec}
                            </span>
                          ))}
                          {therapist.specializations.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                              +{therapist.specializations.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {therapist.location}
                          {therapist.isOnline && <span className="text-green-600">• מקוון</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          זמן תגובה: {therapist.responseTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{therapist.priceRange}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSelectedTherapist(therapist)}
                          className="flex-1"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          צפה בפרופיל
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          שלח הודעה
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}

        {/* Other tabs content will be added in the next part */}
      </div>
        {activeTab === 'my-therapist' && currentTherapist && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Therapist Profile */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                      {currentTherapist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{currentTherapist.name}</CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <CardDescription className="text-base">{currentTherapist.title}</CardDescription>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{currentTherapist.rating}</span>
                          <span className="text-gray-500">({currentTherapist.reviewCount} ביקורות)</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{currentTherapist.experience} שנות ניסיון</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">אודות</h4>
                    <p className="text-gray-700 dark:text-gray-300">{currentTherapist.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">התמחויות</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTherapist.specializations.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">השכלה</h4>
                    <ul className="space-y-2">
                      {currentTherapist.education.map((edu, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Award className="w-4 h-4 mt-0.5 text-blue-500" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">הסמכות</h4>
                    <ul className="space-y-2">
                      {currentTherapist.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Shield className="w-4 h-4 mt-0.5 text-green-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">פעולות מהירות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    קבע פגישה
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    שלח הודעה
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    שתף נתונים
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    פגישה מקוונת
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">הפגישה הבאה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>יום רביעי, 15 באוגוסט</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>16:00 - 17:00</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-purple-500" />
                      <span>פגישה מקוונת</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    הצטרף לפגישה
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">הפגישות שלי</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                קבע פגישה חדשה
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{appointment.therapistName}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appointment.status === 'scheduled' ? 'מתוכנן' :
                         appointment.status === 'completed' ? 'הושלם' :
                         appointment.status === 'cancelled' ? 'בוטל' : 'ממתין'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{new Date(appointment.date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{appointment.time} ({appointment.duration} דקות)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === 'video' && <Video className="w-4 h-4 text-purple-500" />}
                        {appointment.type === 'phone' && <Phone className="w-4 h-4 text-orange-500" />}
                        {appointment.type === 'in-person' && <MapPin className="w-4 h-4 text-red-500" />}
                        <span>
                          {appointment.type === 'video' ? 'פגישה מקוונת' :
                           appointment.type === 'phone' ? 'שיחת טלפון' : 'פגישה פרונטלית'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₪{appointment.cost}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <strong>הערות:</strong> {appointment.notes}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button size="sm" className="flex-1">
                            {appointment.type === 'video' ? 'הצטרף' : 'פרטים'}
                          </Button>
                          <Button variant="outline" size="sm">
                            בטל
                          </Button>
                        </>
                      )}
                      {appointment.status === 'completed' && (
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          צפה בסיכום
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>הודעות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.senderId === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {message.senderName.charAt(0)}
                        </div>
                        <div className={`flex-1 ${message.senderId === 'user' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.senderName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString('he-IL')}
                            </span>
                            {!message.isRead && message.senderId !== 'user' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className={`p-3 rounded-lg text-sm ${
                            message.senderId === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Textarea 
                      placeholder="כתוב הודעה..."
                      className="flex-1 min-h-[80px]"
                    />
                    <div className="flex flex-col gap-2">
                      <Button size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Sharing Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">שיתוף נתונים</CardTitle>
                  <CardDescription>
                    בחר איזה נתונים לשתף עם המטפל שלך
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">נתוני מצב רוח</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">רשומות יומן</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">תובנות AI</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-sm">דוחות התקדמות</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      צור דוח מקיף
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">הגדרות פרטיות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">שיתוף אוטומטי</span>
                    <Button variant="outline" size="sm">
                      <Lock className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">הצפנת הודעות</span>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}