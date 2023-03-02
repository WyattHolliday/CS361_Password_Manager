from flask import Flask
import string
import random
import json

app = Flask(__name__)

@app.route('/generate_password')
def generate_password():
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

    return json.dumps({'password': password}), 200, {'ContentType': 'application/json'}

if __name__ == '__main__':
    app.run()
