from flask import Flask, request, jsonify
from mlx_lm import load, generate
import os

app = Flask(__name__)

# mlx-community/Mistral-7B-Instruct-v0.3-4bit

code_model, code_tokenizer = load("mlx-community/DeepSeek-Coder-V2-Lite-Instruct-8bit")
# chat_model, chat_tokenizer = load("mlx-community/Meta-Llama-3-8B-Instruct-4bit")

def generate_response(model, tokenizer, data):
    prompt = data.get('prompt', '')
    
    # Try to convert max_tokens to int, use 512 if conversion fails
    max_tokens = 512
    try:
        max_tokens = int(data.get('max_tokens',''))
    except ValueError:
        pass  # Silently fall back to the default value


    messages = [{"role": "user", "content": prompt}]
    formatted_prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    return generate(model, tokenizer, formatted_prompt, max_tokens=max_tokens)

@app.route('/coder', methods=['POST'])
def generate_code():
    data = request.json
    response = generate_response(code_model, code_tokenizer, data)
    return jsonify({"response": response})

# @app.route('/chat', methods=['POST'])
# def generate_chat():
#     data = request.json
#     response = generate_response(chat_model, chat_tokenizer, data)
#     return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))