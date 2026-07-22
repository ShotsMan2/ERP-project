import { useState } from 'react';
import { Row, Col, Card, Typography, Tag, Form, Input, Button, message, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const contactInfo = [
  { icon: <MailOutlined />, title: 'E-posta', value: 'info@enterpriseproject.com', desc: '7/24 yanıt süresi' },
  { icon: <PhoneOutlined />, title: 'Telefon', value: '+90 (212) 555 0123', desc: 'Hafta içi 09:00 - 18:00' },
  { icon: <EnvironmentOutlined />, title: 'Adres', value: 'Maslak Mah. Büyükdere Cad. No:255', desc: 'Sarıyer / İstanbul' },
  { icon: <ClockCircleOutlined />, title: 'Çalışma Saatleri', value: 'Hafta içi 09:00 - 18:00', desc: 'Hafta sonu kapalı' },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      message.success('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
      form.resetFields();
    } catch {
      // validation failed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Tag className="mb-4 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300">İLETİŞİM</Tag>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Bizimle İletişime Geçin</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya iş birliği için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={14}>
              <Card className="border border-gray-100 rounded-2xl shadow-sm" bordered={false}>
                <Title level={4} className="mb-6">Mesaj Gönderin</Title>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="name" label="Ad Soyad" rules={[{ required: true, message: 'Lütfen adınızı girin' }]}>
                        <Input size="large" placeholder="Adınız Soyadınız" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="email" label="E-posta" rules={[{ required: true, type: 'email', message: 'Geçerli bir e-posta girin' }]}>
                        <Input size="large" placeholder="ornek@firma.com" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Lütfen konu girin' }]}>
                    <Input size="large" placeholder="Mesajınızın konusu" />
                  </Form.Item>
                  <Form.Item name="message" label="Mesaj" rules={[{ required: true, message: 'Lütfen mesajınızı girin' }]}>
                    <TextArea rows={6} size="large" placeholder="Mesajınızı buraya yazın..." />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} loading={loading} className="h-12 px-8">
                    Mesajı Gönder
                  </Button>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Space direction="vertical" size="large" className="w-full">
                {contactInfo.map((item, i) => (
                  <Card key={i} className="border border-gray-100 hover:shadow-md transition-all duration-300 rounded-xl" bordered={false}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <Title level={5} className="mb-0">{item.title}</Title>
                        <Paragraph className="text-gray-900 font-medium mb-0">{item.value}</Paragraph>
                        <Paragraph className="text-gray-400 text-sm mb-0">{item.desc}</Paragraph>
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}
