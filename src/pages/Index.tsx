import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatHistory {
  id: number;
  title: string;
  date: string;
  preview: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я LitvinovGPT — твой личный ИИ-ассистент. Как я могу помочь?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [requestsUsed, setRequestsUsed] = useState(0);
  const [currentSection, setCurrentSection] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);

  const chatHistoryData: ChatHistory[] = [
    { id: 1, title: 'Создание веб-сайта', date: '16 янв', preview: 'Как создать сайт на React...' },
    { id: 2, title: 'Математические задачи', date: '15 янв', preview: 'Помоги решить уравнение...' },
    { id: 3, title: 'Планирование проекта', date: '14 янв', preview: 'Нужна помощь с планом...' }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || requestsUsed >= 10 || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b97cb280-e6f5-4d55-a641-3b1adc8edcf1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.slice(-10)
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const botMessage: Message = {
          id: messages.length + 2,
          text: data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setRequestsUsed(requestsUsed + 1);
      } else {
        const errorMessage: Message = {
          id: messages.length + 2,
          text: data.error || 'Ошибка получения ответа. Проверьте настройки API ключа.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Ошибка соединения с сервером. Попробуйте позже.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center animate-gradient-shift bg-[length:200%_200%]">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                LitvinovGPT
              </h1>
            </div>
            <div className="hidden md:flex gap-6">
              {['chat', 'features', 'pricing', 'about', 'faq', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setCurrentSection(section)}
                  className={`font-medium transition-all hover:text-purple-600 ${
                    currentSection === section ? 'text-purple-600' : 'text-gray-600'
                  }`}
                >
                  {section === 'chat' && 'Чат'}
                  {section === 'features' && 'Возможности'}
                  {section === 'pricing' && 'Тарифы'}
                  {section === 'about' && 'О боте'}
                  {section === 'faq' && 'FAQ'}
                  {section === 'contact' && 'Контакты'}
                </button>
              ))}
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Icon name="User" size={18} className="mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </nav>

      {currentSection === 'chat' && (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 border-purple-100 shadow-lg animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История чатов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {chatHistoryData.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-all border border-transparent hover:border-purple-200"
                      >
                        <div className="font-medium text-sm truncate">{chat.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{chat.date}</div>
                        <div className="text-xs text-gray-400 mt-1 truncate">{chat.preview}</div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Новый чат
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-purple-100 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-purple-300">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                        LG
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl">LitvinovGPT</div>
                      <Badge className="bg-green-500 text-white text-xs">Онлайн</Badge>
                    </div>
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Бесплатный тариф</div>
                    <div className="text-xs text-gray-500">
                      {requestsUsed}/10 запросов
                    </div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                        style={{ width: `${(requestsUsed / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[450px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 animate-fade-in ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={
                              message.sender === 'bot'
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                                : 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                            }
                          >
                            {message.sender === 'bot' ? 'LG' : 'Вы'}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                              : 'bg-white border border-purple-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <span className={`text-xs mt-2 block ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 animate-fade-in">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                            LG
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-purple-100 p-4 rounded-2xl shadow-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex gap-2 w-full">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={requestsUsed >= 10 ? 'Лимит исчерпан. Обновите тариф!' : 'Напишите сообщение...'}
                    disabled={requestsUsed >= 10}
                    className="flex-1 border-purple-200 focus-visible:ring-purple-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || requestsUsed >= 10 || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="Send" size={18} />}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {currentSection === 'features' && (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Возможности LitvinovGPT
            </h2>
            <p className="text-gray-600 text-lg">Всё, что нужно для эффективной работы с ИИ</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'MessageSquare', title: 'Умные диалоги', desc: 'Контекстные ответы на любые вопросы' },
              { icon: 'Code', title: 'Помощь с кодом', desc: 'Генерация, отладка и объяснение кода' },
              { icon: 'Lightbulb', title: 'Креативные идеи', desc: 'Генерация идей для проектов и контента' },
              { icon: 'BookOpen', title: 'Обучение', desc: 'Объяснение сложных концепций простым языком' },
              { icon: 'Zap', title: 'Быстрые ответы', desc: 'Мгновенная обработка запросов' },
              { icon: 'Shield', title: 'Безопасность', desc: 'Защита ваших данных и конфиденциальность' }
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-purple-100 hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                    <Icon name={feature.icon as any} size={24} className="text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'pricing' && (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Тарифные планы
            </h2>
            <p className="text-gray-600 text-lg">Выберите подходящий план для ваших задач</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-200 animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <Icon name="Rocket" size={24} className="text-gray-600" />
                </div>
                <CardTitle>Бесплатный</CardTitle>
                <CardDescription>Для начинающих пользователей</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0₽</span>
                  <span className="text-gray-500">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['10 запросов в день', 'Базовые возможности ИИ', 'История чатов (7 дней)', 'Поддержка сообщества'].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="Check" size={18} className="text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Текущий план
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-purple-500 border-2 shadow-2xl relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                Популярный
              </Badge>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-white" />
                </div>
                <CardTitle>Премиум</CardTitle>
                <CardDescription>Для активных пользователей</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">999₽</span>
                  <span className="text-gray-500">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Безлимитные запросы',
                    'Приоритетная обработка',
                    'Расширенные возможности ИИ',
                    'История чатов (безлимит)',
                    'Приоритетная поддержка'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="Check" size={18} className="text-purple-600" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Выбрать план
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                  <Icon name="Building" size={24} className="text-white" />
                </div>
                <CardTitle>Корпоративный</CardTitle>
                <CardDescription>Для команд и бизнеса</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">По запросу</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Всё из Премиум',
                    'Кастомизация модели',
                    'API доступ',
                    'Выделенная поддержка',
                    'SLA гарантии'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="Check" size={18} className="text-blue-600" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Связаться с нами
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {currentSection === 'about' && (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="border-purple-100 shadow-xl animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                О LitvinovGPT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                <strong>LitvinovGPT</strong> — это современный ИИ-ассистент, созданный для решения ваших задач.
                Мы используем передовые технологии искусственного интеллекта для предоставления точных и полезных ответов.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                {[
                  { icon: 'Target', title: 'Наша миссия', text: 'Сделать ИИ доступным каждому' },
                  { icon: 'Heart', title: 'Наши ценности', text: 'Качество, безопасность, инновации' },
                  { icon: 'Users', title: 'Наша команда', text: 'Эксперты в AI и разработке' },
                  { icon: 'TrendingUp', title: 'Наш рост', text: 'Постоянное развитие и улучшение' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as any} size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                Присоединяйтесь к тысячам пользователей, которые уже используют LitvinovGPT для повышения продуктивности,
                обучения и решения повседневных задач.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentSection === 'faq' && (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Часто задаваемые вопросы
            </h2>
            <p className="text-gray-600 text-lg">Ответы на популярные вопросы о LitvinovGPT</p>
          </div>
          <Card className="border-purple-100 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    q: 'Что такое LitvinovGPT?',
                    a: 'LitvinovGPT — это умный ИИ-ассистент, который может отвечать на вопросы, помогать с задачами, генерировать код и многое другое.'
                  },
                  {
                    q: 'Как работает бесплатный тариф?',
                    a: 'На бесплатном тарифе вы получаете 10 запросов в день. Лимит обновляется каждые 24 часа.'
                  },
                  {
                    q: 'Можно ли сохранить историю чатов?',
                    a: 'Да! На бесплатном тарифе история сохраняется 7 дней, на Премиум — безлимитно.'
                  },
                  {
                    q: 'Безопасно ли использовать сервис?',
                    a: 'Абсолютно. Мы используем шифрование данных и не передаём вашу информацию третьим лицам.'
                  },
                  {
                    q: 'Как обновить тариф?',
                    a: 'Перейдите в раздел "Тарифы" и выберите подходящий план. Оплата доступна картой или через другие способы.'
                  },
                  {
                    q: 'Есть ли API для интеграции?',
                    a: 'API доступен на корпоративном тарифе. Свяжитесь с нами для получения доступа.'
                  }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-medium hover:text-purple-600">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {currentSection === 'contact' && (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Свяжитесь с нами
            </h2>
            <p className="text-gray-600 text-lg">Мы всегда рады вашим вопросам и предложениям</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-purple-100 shadow-xl animate-fade-in-up">
              <CardHeader>
                <CardTitle>Напишите нам</CardTitle>
                <CardDescription>Заполните форму, и мы свяжемся с вами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                  <Input placeholder="Иван Иванов" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="ivan@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение</label>
                  <Input placeholder="Ваш вопрос или предложение..." className="h-24" />
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon name="Mail" className="text-purple-600" />
                    Email
                  </CardTitle>
                  <CardDescription>support@litvinovgpt.ru</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon name="MessageCircle" className="text-purple-600" />
                    Telegram
                  </CardTitle>
                  <CardDescription>@litvinovgpt_support</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon name="Globe" className="text-purple-600" />
                    Социальные сети
                  </CardTitle>
                  <CardDescription>
                    <div className="flex gap-4 mt-2">
                      {['Twitter', 'Linkedin', 'Github'].map((social) => (
                        <button
                          key={social}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center text-white transition-all hover:scale-110"
                        >
                          <Icon name={social as any} size={18} />
                        </button>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Sparkles" size={24} />
                LitvinovGPT
              </h3>
              <p className="text-purple-200 text-sm">Ваш умный ИИ-ассистент для решения любых задач</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-8 pt-8 text-center text-sm text-purple-200">
            <p>&copy; 2024 LitvinovGPT. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;