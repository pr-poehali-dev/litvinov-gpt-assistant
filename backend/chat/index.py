import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    '''Обработка чат-запросов через OpenAI API для LitvinovGPT'''
    
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
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API ключ не настроен'})
            }
        
        client = OpenAI(api_key=api_key)
        
        chat_history = body.get('history', [])
        messages = [
            {
                'role': 'system',
                'content': 'Ты — LitvinovGPT, умный и дружелюбный ИИ-ассистент. Отвечай кратко, по делу и полезно. Помогай с вопросами, задачами, кодом и идеями.'
            }
        ]
        
        for msg in chat_history[-10:]:
            role = 'user' if msg.get('sender') == 'user' else 'assistant'
            messages.append({
                'role': role,
                'content': msg.get('text', '')
            })
        
        messages.append({
            'role': 'user',
            'content': user_message
        })
        
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        bot_reply = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'reply': bot_reply,
                'model': 'gpt-4o-mini'
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
