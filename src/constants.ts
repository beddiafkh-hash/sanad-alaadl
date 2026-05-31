import { 
  BarChart3, Users, Scale, Calendar, Wallet, BookOpen, 
  Handshake, LayoutPanelLeft, ListTodo, Archive, History, 
  FileText, BrainCircuit, Mail, Bell, Settings, LogOut, Clock, Trash2,
  ShieldCheck, Lock, Search, Sun, Moon, Volume2, Landmark, Navigation,
  Sparkles, CalendarDays
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', icon: BarChart3, label: 'لوحة التحكم', path: '/dashboard' },
  { id: 'clients', icon: Users, label: 'الموكلون', path: '/clients', subItems: ['جميع الموكلين', 'إضافة موكل', 'الموكلون النشطون', 'أرشفة'] },
  { id: 'cases', icon: Scale, label: 'القضايا', path: '/cases', subItems: ['جميع القضايا', 'إضافة قضية', 'القضايا النشطة', 'قضايا اليوم', 'القضايا المؤجلة'] },
  { id: 'sessions', icon: Calendar, label: 'جدول الجلسات', path: '/sessions', subItems: ['جميع الجلسات', 'جلسات اليوم', 'جلسات الغد', 'جلسات هذا الأسبوع'] },
  { id: 'finance', icon: Wallet, label: 'النظام المالي', path: '/finance', subItems: ['نظرة عامة', 'الأتعاب', 'المصاريف', 'الرواتب', 'التقارير المالية'] },
  { id: 'templates', icon: FileText, label: 'النماذج والقوالب الذكية', path: '/templates', subItems: ['المراسلات الرسمية', 'قوالب العقود', 'الوكالات والإنذارات', 'نماذج مخصصة'] },
  { id: 'reminders', icon: History, label: 'الاستذكار القانوني', path: '/reminders', subItems: ['تذكيراتي', 'التذكيرات الدورية', 'متابعة التنفيذ', 'إشعارات التقادم'] },
  { id: 'library', icon: BookOpen, label: 'المكتبة القانونية', path: '/library', subItems: ['القوانين والتشريعات', 'الاجتهادات القضائية', 'البحث القانوني المتقدم'] },
  { id: 'law-professionals', icon: Handshake, label: 'رجال القانون', path: '/law-professionals' },
  { id: 'legal-services', icon: Sparkles, label: 'الخدمات القانونية الذكية', path: '/legal-services' },
  { id: 'appointments', icon: CalendarDays, label: 'سجل الزوار والمواعيد', path: '/appointments' },
  { id: 'reports', icon: BarChart3, label: 'التقارير والإحصائيات', path: '/reports' },
  { id: 'tasks', icon: ListTodo, label: 'المهام والتذاكر', path: '/tasks' },
  { id: 'ai-assistant', icon: BrainCircuit, label: 'المساعد سند AI', path: '/ai' },
  { id: 'vault', icon: Lock, label: 'الخزنة السرية والتواصل 🔒', path: '/vault' },
  { id: 'notifications', icon: Bell, label: 'الإشعارات', path: '/notifications' },
  { id: 'archive', icon: Archive, label: 'الأرشيف', path: '/archive' },
  { id: 'trash', icon: Trash2, label: 'سلة المهملات', path: '/trash' },
  { id: 'settings', icon: Settings, label: 'الإعدادات', path: '/settings' },
];

export const ADHKAR = [
  "سبحان الله وبحمده",
  "سبحان الله العظيم",
  "لا إله إلا الله",
  "الله أكبر",
  "الحمد لله",
  "استغفر الله العظيم",
  "اللهم صل وسلم على نبينا محمد",
  "لا حول ولا قوة إلا بالله",
  "سبحان الله والحمد لله",
  "يا حي يا قيوم برحمتك أستغيث",
  "حسبي الله ونعم الوكيل",
  "اللهم اغفر لي ولوالدي"
];

export const WELCOMES = [
  { start: 5, end: 7, text: "أسعد الله صباحك بالنور والبركة" },
  { start: 7, end: 12, text: "صباح الخير والهمة والنشاط" },
  { start: 12, end: 17, text: "طاب يومك بكل خير" },
  { start: 17, end: 20, text: "مساء الخير والتوفيق" },
  { start: 20, end: 5, text: "ليلة هادئة ومباركة" }
];
