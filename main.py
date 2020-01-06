import os
from flask import Flask, render_template, jsonify, request, session


app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')



