"""
Main Module for Blockchain1
"""
import os
from random import randint
from flask import Flask, render_template, request, jsonify
from bchain.bchain import create_block, create_hash, create_block_chain
app = Flask(__name__)


NONCE = '23df'
FIRST_HASH = ("0000100308e7e0bea95a3e88e4e406c3"
              "7133f0929c80866bda04bc0bce53a15")
 


@app.route("/")
def index():
    params = {'message': 'Blockchain1',
              'block_no': "000432",
              'event_data': create_block(),
              }
    return render_template('index.html', **params)


@app.route("/eventdata")
def event_data():
    return create_block()


@app.route("/hash")
def hashcode():
    nonce, hash_code = create_hash(request)
    return jsonify((hex(nonce).replace("0x", ''), hash_code))


@app.route("/houses")
def houses():
    params = {'message': 'Blockchain1',
              'block_no': "000432",
              'event_data': create_block(),
              'hash_list': create_block_chain(FIRST_HASH, NONCE),
              'production': os.environ.get('PRODUCTION', False)
              }
    return render_template('houses.html', **params)
