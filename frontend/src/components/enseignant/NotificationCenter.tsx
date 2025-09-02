import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { formatDate } from '@/utils/formatDate';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Users,
  Calendar,
  Eye,
  Trash2,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'course_approved' | 'course_rejected' | 'memoire_submitted' | 'system' | 'reminder';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  related_id?: string;
  related_type?: 'course' | 'memoire';
}

const NotificationCenter = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchNotifications();
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a notifications API yet, we'll generate some mock notifications
      // based on recent course and memoire activities
      const mockNotifications = await generateMockNotifications();
      setNotifications(mockNotifications);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الإشعارات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotifications = async (): Promise<Notification[]> => {
    try {
      // Fetch recent courses to generate notifications
      const coursesResponse = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      const courses = coursesResponse.data || [];
      
      // Fetch recent memoires
      let memoires: any[] = [];
      try {
        const memoiresResponse = await apiService.getMemoiresByEnseignant(userProfile.id_enseignant);
        memoires = memoiresResponse.data || [];
      } catch (error) {
        // Memoire endpoint might not exist
      }

      const notifications: Notification[] = [];

      // Generate notifications from courses
      courses.slice(0, 10).forEach((course: any, index: number) => {
        if (course.status === 'مقبول') {
          notifications.push({
            id: `course_approved_${course.id_cours}`,
            type: 'course_approved',
            title: 'تم اعتماد الدرس',
            message: `تم اعتماد درس "${course.titre_ar || course.titre_fr}" بنجاح`,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            read: Math.random() > 0.5,
            related_id: course.id_cours,
            related_type: 'course'
          });
        } else if (course.status === 'مرفوض') {
          notifications.push({
            id: `course_rejected_${course.id_cours}`,
            type: 'course_rejected',
            title: 'تم رفض الدرس',
            message: `تم رفض درس "${course.titre_ar || course.titre_fr}". يرجى مراجعة الملاحظات`,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            read: Math.random() > 0.3,
            related_id: course.id_cours,
            related_type: 'course'
          });
        }
      });

      // Generate notifications from memoires
      memoires.slice(0, 5).forEach((memoire: any) => {
        notifications.push({
          id: `memoire_submitted_${memoire.id_memoire}`,
          type: 'memoire_submitted',
          title: 'مذكرة جديدة للمراجعة',
          message: `تم تقديم مذكرة جديدة "${memoire.titre}" من الطالب ${memoire.stagiaire?.prenom_fr} ${memoire.stagiaire?.nom_fr}`,
          created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: Math.random() > 0.7,
          related_id: memoire.id_memoire,
          related_type: 'memoire'
        });
      });

      // Add some system notifications
      notifications.push({
        id: 'system_welcome',
        type: 'system',
        title: 'مرحباً بك في النظام',
        message: 'مرحباً بك في نظام إدارة التدريب. يمكنك الآن رفع دروسك ومراجعة المذكرات.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true
      });

      notifications.push({
        id: 'reminder_courses',
        type: 'reminder',
        title: 'تذكير: رفع الدروس',
        message: 'لا تنس رفع دروس هذا الأسبوع. الموعد النهائي يوم الجمعة.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      });

      // Sort by date (most recent first)
      return notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    } catch (error) {
      console.error('Error generating notifications:', error);
      return [];
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: 'تم',
      description: 'تم وضع علامة مقروء على جميع الإشعارات',
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast({
      title: 'تم',
      description: 'تم حذف الإشعار',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'course_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'memoire_submitted':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-purple-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    const baseColor = read ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50';
    
    switch (type) {
      case 'course_approved':
        return read ? 'border-green-200 bg-green-50' : 'border-green-300 bg-green-100';
      case 'course_rejected':
        return read ? 'border-red-200 bg-red-50' : 'border-red-300 bg-red-100';
      case 'memoire_submitted':
        return read ? 'border-blue-200 bg-blue-50' : 'border-blue-300 bg-blue-100';
      default:
        return baseColor;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'read':
        return notif.read;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل الإشعارات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>مركز الإشعارات</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                وضع علامة مقروء على الكل
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              الكل ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="relative"
            >
              غير مقروء ({unreadCount})
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              مقروء ({notifications.length - unreadCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'جميع الإشعارات مقروءة' : 'لا توجد إشعارات حالياً'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors hover:bg-gray-50 ${getNotificationColor(notification.type, notification.read)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          title="وضع علامة مقروء"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        title="حذف الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">إشعارات اعتماد الدروس</p>
                <p className="text-sm text-gray-600">تلقي إشعار عند اعتماد أو رفض دروسك</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                مفعل
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">إشعارات المذكرات الجديدة</p>
                <p className="text-sm text-gray-600">تلقي إشعار عند تقديم مذكرات جديدة للمراجعة</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                مفعل
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">إشعارات التذكير</p>
                <p className="text-sm text-gray-600">تلقي تذكيرات حول المواعيد النهائية والمهام</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                مفعل
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;