import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Tag, Button, Space } from 'antd';
import { ArrowRightOutlined, TeamOutlined, GlobalOutlined, HeartOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const values = [
  { icon: <TeamOutlined />, title: 'İnsan Odaklı', desc: 'Müşterilerimizin ve çalışanlarımızın başarısı bizim önceliğimizdir.' },
  { icon: <TrophyOutlined />, title: 'Mükemmellik', desc: 'Sürekli iyileştirme ve yenilikçilik ile en yüksek kaliteyi hedefleriz.' },
  { icon: <GlobalOutlined />, title: 'Küresel Vizyon', desc: 'Yerel ihtiyaçları anlayan, küresel standartlarda çözümler sunarız.' },
  { icon: <HeartOutlined />, title: 'Güven', desc: 'Şeffaflık, dürüstlük ve güvenilirlik temel değerlerimizdir.' },
];

const team = [
  { name: 'Ali Uysal', role: 'CEO & Kurucu', avatar: 'AU' },
  { name: 'Zeynep Kaya', role: 'CTO', avatar: 'ZK' },
  { name: 'Mehmet Demir', role: 'COO', avatar: 'MD' },
  { name: 'Elif Yıldız', role: 'CPO', avatar: 'EY' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Tag className="mb-4 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300">HAKKIMIZDA</Tag>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            İşletmeleri Güçlendirme<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Misyonumuz</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            EnterprisePlatform olarak, işletmelerin dijital dönüşüm yolculuğunda yanlarında oluyoruz. 
            2020 yılında kurulan ekibimiz, modern teknolojilerle iş süreçlerini optimize eden kapsamlı bir ERP çözümü geliştirdi.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">DEĞERLERİMİZ</Tag>
            <Title level={2} className="mb-4">Bizi Farklı Kılan Değerler</Title>
          </div>
          <Row gutter={[24, 24]}>
            {values.map((v, i) => (
              <Col xs={24} sm={12} key={i}>
                <Card className="h-full border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-2xl" bordered={false}>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl mb-4">{v.icon}</div>
                  <Title level={5}>{v.title}</Title>
                  <Paragraph className="text-gray-500 mb-0">{v.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">EKİBİMİZ</Tag>
            <Title level={2} className="mb-4">Arkamızdaki Ekip</Title>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {team.map((m, i) => (
              <Col xs={12} md={6} key={i}>
                <Card className="text-center border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-2xl" bordered={false}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {m.avatar}
                  </div>
                  <Title level={5} className="mb-1">{m.name}</Title>
                  <Paragraph className="text-gray-400 text-sm mb-0">{m.role}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 to-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Bize Katılın</h2>
          <p className="text-lg text-gray-400 mb-8">500'den fazla kurumsal müşteriye katılın, işletmenizi büyütün.</p>
          <Button type="primary" size="large" shape="round" className="h-12 px-8"
            onClick={() => navigate('/auth')}>
            Ücretsiz Başlayın <ArrowRightOutlined />
          </Button>
        </div>
      </section>
    </div>
  );
}
