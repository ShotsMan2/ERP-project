import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Tag, Button, Space } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const plans = [
  {
    name: 'Başlangıç', price: '0', period: '/ay', desc: 'Küçük işletmeler için temel özellikler',
    features: ['5 Kullanıcı', 'Temel Muhasebe Modülü', 'Personel Yönetimi', 'E-posta Desteği', '1GB Depolama', 'Temel Raporlar'],
    color: 'gray',
  },
  {
    name: 'Profesyonel', price: '149', period: '/ay', desc: 'Büyüyen işletmeler için tam çözüm',
    features: ['25 Kullanıcı', 'Tüm Modüller', 'API Erişimi', 'Öncelikli Destek', 'Özel Raporlar', '10GB Depolama', 'Otomasyon', 'Entegrasyonlar'],
    popular: true, color: 'indigo',
  },
  {
    name: 'Kurumsal', price: '399', period: '/ay', desc: 'Büyük ölçekli işletmeler için özel çözüm',
    features: ['Sınırsız Kullanıcı', 'Özel Entegrasyonlar', 'SLA Garantisi', '7/24 Öncelikli Destek', 'Özel Eğitim', 'Dedike Sunucu', 'Sınırsız Depolama', 'Özel Geliştirme'],
    color: 'purple',
  },
];

const comparisons = [
  { feature: 'Kullanıcı Sayısı', basic: '5', pro: '25', enterprise: 'Sınırsız' },
  { feature: 'Depolama', basic: '1 GB', pro: '10 GB', enterprise: 'Sınırsız' },
  { feature: 'Finans Modülü', basic: '✓', pro: '✓', enterprise: '✓' },
  { feature: 'İK Modülü', basic: '✓', pro: '✓', enterprise: '✓' },
  { feature: 'Envanter', basic: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Proje Yönetimi', basic: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'API Erişimi', basic: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Özel Raporlar', basic: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Öncelikli Destek', basic: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Özel Entegrasyon', basic: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'SLA Garantisi', basic: '✗', pro: '✗', enterprise: '✓' },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Tag className="mb-4 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300">FİYATLANDIRMA</Tag>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Basit ve Şeffaf Fiyatlandırma</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">İhtiyacınıza uygun planı seçin, 14 gün ücretsiz deneyin.</p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[24, 24]} justify="center">
            {plans.map((plan, i) => (
              <Col xs={24} md={8} key={i}>
                <Card className={`h-full relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-2xl ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-200' : 'border-gray-100'}`} bordered={false}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">POPÜLER</div>
                  )}
                  <div className="text-center mb-6 pt-2">
                    <Title level={4} className="mb-1">{plan.name}</Title>
                    <Paragraph className="text-gray-500 mb-4">{plan.desc}</Paragraph>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-400">{plan.period}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button type={plan.popular ? 'primary' : 'default'} size="large" block shape="round"
                    className={plan.popular ? 'h-11' : '!border-gray-300 !text-gray-700 h-11'}
                    onClick={() => navigate('/auth')}>
                    {plan.price === '0' ? 'Ücretsiz Başla' : 'Hemen Başla'}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Tag className="mb-4 text-xs font-semibold">KARŞILAŞTIRMA</Tag>
            <Title level={2}>Planları Karşılaştırın</Title>
          </div>
          <Card className="rounded-2xl shadow-sm overflow-hidden" bordered={false}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Özellik</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-500">Başlangıç</th>
                  <th className="text-center py-4 px-4 font-semibold text-indigo-600 bg-indigo-50">Profesyonel</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Kurumsal</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-sm">{row.basic}</td>
                    <td className="text-center py-3 px-4 text-sm bg-indigo-50/50 font-medium">{row.pro}</td>
                    <td className="text-center py-3 px-4 text-sm">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>
    </div>
  );
}
