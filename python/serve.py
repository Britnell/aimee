from flask import Flask, request, jsonify
from mlx_lm import load, generate
import os

app = Flask(__name__)

repo = "mlx-community/Mistral-7B-Instruct-v0.3-4bit"
model, tokenizer = load(repo)

@app.route('/generate', methods=['POST'])
def generate_text():
    # Get the prompt from the request
    data = request.json
    prompt = data.get('prompt', '')

    messages = [{"role": "user", "content": prompt}]
    formatted_prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    response = generate(model, tokenizer, formatted_prompt, max_tokens=512)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))