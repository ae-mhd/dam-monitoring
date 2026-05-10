import {
  Thermometer,
  Waves,
  Droplets,
  FlaskConical,
  Zap,
  EyeOff,
  Wind,
  Database,
  Beaker,
  Activity,
  BarChart2,
  Settings,
  Bell,
  Map,
  Home,
  TrendingUp,
  TrendingDown,
  Minus,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from 'lucide-react'

const iconMap: Record<string, React.FC<LucideProps>> = {
  thermometer: Thermometer,
  waves: Waves,
  droplets: Droplets,
  'flask-conical': FlaskConical,
  zap: Zap,
  'eye-off': EyeOff,
  salt: Database,
  wind: Wind,
  database: Database,
  beaker: Beaker,
  activity: Activity,
  'bar-chart': BarChart2,
  settings: Settings,
  bell: Bell,
  map: Map,
  home: Home,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  minus: Minus,
  sun: Sun,
  moon: Moon,
  search: Search,
  menu: Menu,
  x: X,
  copy: Copy,
  check: Check,
  refresh: RefreshCw,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'wifi-off': WifiOff,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
}

interface IconProps extends LucideProps {
  name: string
}

export function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name] ?? Activity
  return <Component {...props} />
}

export {
  Thermometer, Waves, Droplets, FlaskConical, Zap, EyeOff, Wind,
  Database, Beaker, Activity, BarChart2, Settings, Bell, Map, Home,
  TrendingUp, TrendingDown, Minus, Sun, Moon, Search, Menu, X,
  Copy, Check, RefreshCw, AlertTriangle, AlertCircle, WifiOff,
  ChevronLeft, ChevronRight,
}
