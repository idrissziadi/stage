import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
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
  Settings,
  Building,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'programme_approved' | 'programme_rejected' | 'programme_submitted' | 'course_approved' | 'course_rejected' | 'system' | 'reminder' | 'infrastructure';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  related_id?: string;
  related_type?: 'programme' | 'course' | 'infrastructure';
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (userProfile?.id_etab_regionale) {
      fetchNotifications();
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock notifications for regional establishment
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'programme_approved',
          title: 'تم اعتماد برنامج تدريبي جديد',
          message: 'تم اعتماد برنامج "تطوير تطبيقات الويب المتقدمة" من مؤسسة تكوين الجزائر العاصمة',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          related_id: 'prog_001',
          related_type: 'programme',
          priority: 'high'
        },
        {
          id: '2',
          type: 'programme_submitted',
          title: 'برنامج جديد مقدم للمراجعة',
          message: 'تم تقديم برنامج "قواعد البيانات المتقدمة" من مؤسسة تكوين وهران للمراجعة',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          related_id: 'prog_002',
          related_type: 'programme',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'course_approved',
          title: 'تم اعتماد درس جديد',
          message: 'تم اعتماد درس "مقدمة في الذكاء الاصطناعي" من الأستاذ أحمد محمد',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true,
          related_id: 'course_001',
          related_type: 'course',
          priority: 'medium'
        },
        {
          id: '4',
          type: 'infrastructure',
          title: 'تحديث في البنية التحتية',
          message: 'تم إضافة فرع جديد "تكنولوجيا المعلومات" في منطقتك',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          related_id: 'branch_001',
          related_type: 'infrastructure',
          priority: 'low'
        },
        {
          id: '5',
          type: 'system',
          title: 'تحديث النظام',
          message: 'تم تحديث النظام إلى الإصدار الجديد 2.1 مع ميزات محسنة',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low'
        },
        {
          id: '6',
          type: 'reminder',
          title: 'تذكير: مراجعة البرامج',
          message: 'يجب مراجعة البرامج المقدمة من مؤسسات التكوين في منطقتك قبل نهاية الشهر',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high'
        }
      ];
      
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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: 'تم التحديث',
      description: 'تم تحديد جميع الإشعارات كمقروءة',
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast({
      title: 'تم الحذف',
      description: 'تم حذف الإشعار بنجاح',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'programme_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'programme_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'programme_submitted':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'course_approved':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'course_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'infrastructure':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'programme_approved':
        return 'برنامج معتمد';
      case 'programme_rejected':
        return 'برنامج مرفوض';
      case 'programme_submitted':
        return 'برنامج مقدم';
      case 'course_approved':
        return 'درس معتمد';
      case 'course_rejected':
        return 'درس مرفوض';
      case 'infrastructure':
        return 'بنية تحتية';
      case 'system':
        return 'نظام';
      case 'reminder':
        return 'تذكير';
      default:
        return 'إشعار';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return 'غير محدد';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'منذ دقائق';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-arabic">جارٍ تحميل الإشعارات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-arabic">
            <Bell className="w-8 h-8" />
            مركز الإشعارات
          </CardTitle>
          <p className="text-purple-100 font-arabic">
            إدارة وإشعارات المؤسسة الجهوية
          </p>
        </CardHeader>
      </Card>

      {/* Stats and Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
            <p className="text-sm text-gray-600 font-arabic">إجمالي الإشعارات</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <p className="text-sm text-gray-600 font-arabic">إشعارات غير مقروءة</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
            <p className="text-sm text-gray-600 font-arabic">إشعارات مقروءة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-arabic">الإشعارات</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-purple-100 text-purple-700' : ''}
              >
                الكل
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-purple-100 text-purple-700' : ''}
              >
                غير مقروءة ({unreadCount})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('read')}
                className={filter === 'read' ? 'bg-purple-100 text-purple-700' : ''}
              >
                مقروءة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                تحديد الكل كمقروء
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-arabic">
                {filter === 'all' ? 'لا توجد إشعارات' : 
                 filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 
                 'لا توجد إشعارات مقروءة'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 ${!notification.read ? 'ring-2 ring-purple-200 bg-purple-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white font-arabic">
                          {notification.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {getPriorityLabel(notification.priority)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-arabic">
                          {formatDate(notification.created_at)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3 font-arabic">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          تحديد كمقروء
                        </Button>
                      )}
                      
                      {notification.related_id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
