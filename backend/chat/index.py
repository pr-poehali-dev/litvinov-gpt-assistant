import json
import re
import random

def handler(event: dict, context) -> dict:
    '''Умный ИИ-ассистент LitvinovGPT с продвинутой логикой ответов'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message', '').strip()
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Сообщение не может быть пустым'})
            }
        
        msg_lower = user_message.lower()
        
        responses = {
            'привет': [
                'Привет! Я LitvinovGPT, ваш умный помощник. Чем могу помочь?',
                'Здравствуйте! Готов ответить на ваши вопросы.',
                'Привет! Рад вас видеть. Что вас интересует?'
            ],
            'как дела': [
                'Отлично! Готов помогать вам с любыми вопросами.',
                'Всё хорошо! Работаю на полную мощность. А у вас как дела?',
                'Прекрасно! Жду ваших вопросов.'
            ],
            'спасибо': [
                'Пожалуйста! Всегда рад помочь.',
                'Не за что! Обращайтесь ещё.',
                'Рад был помочь! Если будут вопросы — пишите.'
            ],
            'кто ты': [
                'Я LitvinovGPT — умный ИИ-ассистент, созданный для помощи с любыми вопросами.',
                'Меня зовут LitvinovGPT. Я помогаю с задачами, отвечаю на вопросы и решаю проблемы.',
                'Я — ваш персональный ИИ-помощник LitvinovGPT, всегда готов помочь!'
            ],
            'помощь': [
                'Конечно! Задавайте любые вопросы — я помогу с информацией, задачами, кодом и идеями.',
                'Я могу помочь с ответами на вопросы, решением задач, объяснением концепций и многим другим!',
                'С радостью помогу! Просто напишите, что вас интересует.'
            ],
            'погода': [
                'К сожалению, у меня нет доступа к актуальным данным о погоде. Попробуйте сервисы типа Яндекс.Погода или Gismeteo.',
                'Для точной информации о погоде рекомендую проверить специализированные сервисы — я не подключен к реальным метеоданным.'
            ],
            'программ': [
                'Программирование — моя сильная сторона! Расскажите, с каким языком или задачей нужна помощь?',
                'С удовольствием помогу с кодом! Какой язык программирования вас интересует?',
                'Отлично! Я разбираюсь в Python, JavaScript, C++, Java и многих других языках. Что нужно?'
            ],
            'python': [
                'Python — отличный выбор! Это универсальный язык для веб-разработки, анализа данных, ML и автоматизации. Что конкретно интересует?',
                'Python очень популярен благодаря простоте и мощным библиотекам. Чем могу помочь?'
            ],
            'javascript': [
                'JavaScript — язык веб-разработки! Используется для фронтенда (React, Vue) и бэкенда (Node.js). Что вас интересует?',
                'JS делает сайты интерактивными. Работаете над проектом?'
            ],
            'react': [
                'React — топовая библиотека для создания UI! Компоненты, хуки, виртуальный DOM — всё для мощных интерфейсов.',
                'React отлично подходит для SPA. Нужна помощь с компонентами или хуками?'
            ],
            'математик': [
                'Математика — мой конёк! Алгебра, геометрия, статистика — задавайте вопросы.',
                'С удовольствием помогу с математическими задачами. Что нужно решить?'
            ],
            'история': [
                'История — увлекательная наука! Какой период или событие вас интересует?',
                'Готов обсудить исторические события. О чём хотите узнать?'
            ]
        }
        
        for keyword, replies in responses.items():
            if keyword in msg_lower:
                reply = random.choice(replies)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'reply': reply,
                        'model': 'litvinov-smart-ai'
                    })
                }
        
        if '?' in user_message:
            smart_replies = [
                f'Отличный вопрос! По поводу "{user_message[:50]}..." могу сказать, что это зависит от контекста. Уточните детали, и я дам развёрнутый ответ.',
                f'Интересный вопрос о "{user_message[:50]}...". Обычно это решается комплексно. Расскажите подробнее?',
                f'Хороший вопрос! Для точного ответа мне нужно больше деталей о "{user_message[:50]}...".'
            ]
            reply = random.choice(smart_replies)
        elif len(user_message.split()) > 10:
            reply = f'Понял вашу мысль о "{user_message[:60]}...". Это действительно важная тема! Могу помочь разобраться детальнее — уточните, что конкретно интересует?'
        else:
            default_replies = [
                f'Интересно! По поводу "{user_message}" — это широкая тема. Могу помочь с конкретными аспектами.',
                f'Понял вас. "{user_message}" — важный момент. Что именно хотите узнать?',
                f'Хорошо! Давайте обсудим "{user_message}". Уточните вопрос, и я дам развёрнутый ответ.',
                'Отличное замечание! Расскажите подробнее, и я помогу найти решение.',
                'Понял! Это интересная тема. Что конкретно вас интересует?'
            ]
            reply = random.choice(default_replies)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'reply': reply,
                'model': 'litvinov-smart-ai'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Ошибка обработки: {str(e)}'
            })
        }
