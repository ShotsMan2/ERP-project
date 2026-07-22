import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Space, Button, Select } from 'antd';
import {
  MenuOutlined, CloseOutlined, GithubOutlined,
  GlobalOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import { useUIStore } from '@/store/uiStore';

const { Header, Content, Footer } = Layout;

const navLinks = [
  { key: '/', label: 'Ana Sayfa' },
  { key: '/features', label: 'Özellikler' },
  { key: '/pricing', label: 'Fiyatlandırma' },
  { key: '/about', label: 'Hakkımızda' },
  { key: '/contact', label: 'İletişim' },
  { key: '/blog', label: 'Blog' },
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLanding = location.pathname === '/';

  return (
    <Layout className="min-h-screen bg-white">
      <Header
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-12 transition-all duration-300 ${
          scrolled || !isLanding
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <span className={`font-bold text-lg ${scrolled || !isLanding ? 'text-gray-900' : 'text-white'}`}>
            EnterprisePlatform
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => navigate(link.key)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-indigo-600 ${
                location.pathname === link.key
                  ? 'text-indigo-600'
                  : scrolled || !isLanding
                  ? 'text-gray-600'
                  : 'text-white/80'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Select
            value={language}
            onChange={setLanguage}
            size="small"
            className="w-20"
            style={{ background: 'transparent' }}
            options={[
              { value: 'en', label: '🇬🇧 EN' },
              { value: 'tr', label: '🇹🇷 TR' },
              { value: 'de', label: '🇩🇪 DE' },
            ]}
          />
          <Button type="primary" shape="round" icon={<ArrowRightOutlined />} onClick={() => navigate('/auth')}>
            Giriş Yap
          </Button>
        </div>

        <button className="md:hidden text-xl" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </Header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 md:hidden">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => { navigate(link.key); setMobileOpen(false); }}
                className={`text-left py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.key
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Select value={language} onChange={setLanguage} size="middle" options={[{ value: 'en', label: 'English' }, { value: 'tr', label: 'Türkçe' }, { value: 'de', label: 'Deutsch' }]} />
              <Button type="primary" size="large" block onClick={() => navigate('/auth')}>
                Giriş Yap
              </Button>
            </div>
          </nav>
        </div>
      )}

      <Content className={isLanding ? '' : 'pt-16'}>
        <Outlet />
      </Content>

      <Footer className="bg-gray-900 text-gray-300 px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-white font-bold text-lg">EnterprisePlatform</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Modern işletmeler için kapsamlı ERP çözümü. Finans, İK, envanter, satış ve daha fazlasını tek platformda yönetin.
            </p>
            <Space className="mt-4">
              <Button shape="circle" icon={<GithubOutlined />} className="!text-gray-400 hover:!text-white" type="text" />
            </Space>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ürün</h4>
            <div className="flex flex-col gap-2">
              {['Özellikler', 'Fiyatlandırma', 'API', 'Entegrasyonlar'].map((item) => (
                <button key={item} onClick={() => navigate('/features')} className="text-sm text-gray-400 hover:text-white transition-colors text-left">{item}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Şirket</h4>
            <div className="flex flex-col gap-2">
              {['Hakkımızda', 'Blog', 'Kariyer', 'İletişim'].map((item) => (
                <button key={item} onClick={() => navigate(item === 'Blog' ? '/blog' : item === 'İletişim' ? '/contact' : item === 'Hakkımızda' ? '/about' : '/about')} className="text-sm text-gray-400 hover:text-white transition-colors text-left">{item}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} EnterprisePlatform. Tüm hakları saklıdır.</p>
          <Space className="text-sm text-gray-500">
            <button className="hover:text-white transition-colors">Gizlilik Politikası</button>
            <span>·</span>
            <button className="hover:text-white transition-colors">Kullanım Şartları</button>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
}
